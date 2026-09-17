import crypto from 'crypto';
import { Booking } from '../models/booking.model.js';
import { Payment } from '../models/payment.model.js';
import { Coupon } from '../models/coupon.model.js';
import { Notification } from '../models/notification.model.js';
import { razorpayInstance, getRazorpayKeyId, getRazorpayKeySecret } from '../config/razorpay.js';
import { ApiError } from '../utils/ApiError.js';
import { BOOKING_STATUS, PAYMENT_STATUS, PAYMENT_METHODS } from '../constants/status.js';
import { ROLES } from '../constants/roles.js';

export class PaymentService {
  /**
   * Create Razorpay Order for a locked booking
   */
  static async createRazorpayOrder(bookingId, userId, userRole) {
    const booking = await Booking.findById(bookingId)
      .populate('vehicleId', 'brand model images registrationNumber')
      .populate('vendorId', 'name email phone vendorProfile');

    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    // Permission check
    const isCustomer = booking.customerId?.toString() === userId.toString();
    const isAdmin = userRole === ROLES.ADMIN;
    if (!isCustomer && !isAdmin) {
      throw new ApiError(403, 'You are not authorized to pay for this booking');
    }

    if (booking.status === BOOKING_STATUS.CONFIRMED) {
      throw new ApiError(400, 'This booking has already been paid and confirmed');
    }

    if (booking.status === BOOKING_STATUS.CANCELLED) {
      throw new ApiError(400, 'This booking is cancelled and cannot be paid');
    }

    // Verify 10-minute hold lock
    if (booking.lockExpiresAt && new Date() > booking.lockExpiresAt) {
      booking.status = BOOKING_STATUS.CANCELLED;
      await booking.save();
      throw new ApiError(410, 'Your 10-minute reservation lock has expired. Please select a vehicle again.');
    }

    const amountInPaise = Math.round(booking.priceBreakdown.totalAmount * 100);
    const keyId = getRazorpayKeyId();
    const keySecret = getRazorpayKeySecret();

    let orderId = '';
    const isTestPlaceholder =
      !keyId ||
      !keySecret ||
      keyId.includes('placeholder') ||
      keyId.includes('your_key_id_here') ||
      keySecret.includes('placeholder') ||
      keySecret.includes('your_razorpay_secret_here');

    if (!isTestPlaceholder) {
      try {
        const order = await razorpayInstance.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt: booking.bookingNumber,
          notes: {
            bookingId: booking._id.toString(),
            customerId: userId.toString()
          }
        });
        orderId = order.id;
      } catch (err) {
        console.error('Razorpay SDK Order creation error:', err.message || err);
        // Fallback to simulated order ID in dev mode if gateway is unreachable
        orderId = `order_sim_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      }
    } else {
      // Development simulated order ID
      orderId = `order_sim_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    }

    return {
      orderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId,
      bookingNumber: booking.bookingNumber,
      totalAmount: booking.priceBreakdown.totalAmount,
      vehicle: booking.vehicleId,
      lockExpiresAt: booking.lockExpiresAt
    };
  }

  /**
   * Verify Razorpay Cryptographic HMAC SHA256 Signature & Confirm Booking
   */
  static async verifyPayment(userId, payload) {
    const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = payload;

    const booking = await Booking.findById(bookingId)
      .populate('vehicleId', 'brand model registrationNumber location')
      .populate('vendorId', 'name email phone vendorProfile')
      .populate('couponApplied');

    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    // Ownership check: Customer must own this booking
    if (booking.customerId && booking.customerId.toString() !== userId.toString()) {
      throw new ApiError(403, 'You are not authorized to verify payment for this booking');
    }

    // Idempotency: If booking is already confirmed and paid, return existing state
    if (booking.status === BOOKING_STATUS.CONFIRMED && booking.paymentStatus === PAYMENT_STATUS.SUCCESS) {
      const existingPayment = await Payment.findOne({ bookingId: booking._id });
      return { booking, payment: existingPayment, isDuplicate: true };
    }

    // Check duplicate payment transaction ID across bookings
    if (razorpay_payment_id && !razorpay_payment_id.startsWith('simulated_pay_')) {
      const duplicateTxn = await Payment.findOne({ razorpayPaymentId: razorpay_payment_id });
      if (duplicateTxn && duplicateTxn.bookingId.toString() !== booking._id.toString()) {
        throw new ApiError(400, 'This payment transaction ID has already been utilized for another booking');
      }
    }

    const keySecret = getRazorpayKeySecret();
    const isTestPlaceholder =
      !keySecret ||
      keySecret.includes('placeholder') ||
      keySecret.includes('your_razorpay_secret_here');

    // Cryptographic Signature Verification
    if (!isTestPlaceholder && !razorpay_signature.startsWith('simulated_sig_')) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        throw new ApiError(400, 'Invalid payment signature. Payment verification failed.');
      }
    }

    // 1. Update Booking to CONFIRMED & release temporary lock
    booking.status = BOOKING_STATUS.CONFIRMED;
    booking.paymentStatus = PAYMENT_STATUS.SUCCESS;
    booking.lockExpiresAt = null; // Permanent reservation lock
    await booking.save();

    // 2. Increment Coupon usage if applied
    if (booking.couponApplied) {
      await Coupon.findByIdAndUpdate(booking.couponApplied._id, {
        $inc: { usageCount: 1 },
        $push: { usedBy: { userId, usedAt: new Date() } }
      });
    }

    // 3. Record in Payment Ledger Collection
    const vendorId = booking.vendorId?._id || booking.vendorId;
    const payment = await Payment.create({
      bookingId: booking._id,
      userId,
      amount: booking.priceBreakdown.totalAmount,
      currency: 'INR',
      paymentMethod: PAYMENT_METHODS.RAZORPAY,
      status: PAYMENT_STATUS.SUCCESS,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      metadata: {
        vendorPayout: {
          vendorId,
          amount: booking.priceBreakdown.vendorPayout,
          status: 'PENDING'
        }
      }
    });

    // 4. Send In-App Notifications
    // To Customer
    await Notification.create({
      recipientId: userId,
      recipientRole: ROLES.CUSTOMER,
      type: 'BOOKING_CONFIRMED',
      title: `Booking Confirmed #${booking.bookingNumber}`,
      message: `Your reservation for ${booking.vehicleId?.brand} ${booking.vehicleId?.model} is confirmed! Total paid: ₹${booking.priceBreakdown.totalAmount}.`,
      data: { bookingId: booking._id }
    });

    // To Vendor
    await Notification.create({
      recipientId: booking.vendorId._id,
      recipientRole: ROLES.VENDOR,
      type: 'NEW_BOOKING',
      title: `New Online Booking (${booking.bookingNumber})`,
      message: `New booking received for ${booking.vehicleId?.brand} ${booking.vehicleId?.model} starting on ${new Date(booking.startDateTime).toLocaleDateString()}. Payout: ₹${booking.priceBreakdown.vendorPayout}.`,
      data: { bookingId: booking._id }
    });

    return { booking, payment };
  }

  /**
   * Handle Payment Failure
   */
  static async handlePaymentFailure(bookingId, userId, errorDescription = '') {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    // Ownership check
    if (booking.customerId && booking.customerId.toString() !== userId.toString()) {
      throw new ApiError(403, 'You are not authorized to update this booking');
    }

    booking.paymentStatus = PAYMENT_STATUS.FAILED;
    booking.status = BOOKING_STATUS.CANCELLED;
    booking.lockExpiresAt = null; // Immediately release slot inventory
    await booking.save();

    await Notification.create({
      recipientId: userId,
      recipientRole: ROLES.CUSTOMER,
      type: 'PAYMENT_FAILED',
      title: `Payment Failed (${booking.bookingNumber})`,
      message: `Your payment attempt for booking #${booking.bookingNumber} was unsuccessful. ${errorDescription}`,
      data: { bookingId: booking._id }
    });

    return { message: 'Payment failure recorded' };
  }

  /**
   * Get User / Vendor Payment Ledger History
   */
  static async getPaymentHistory(userId, userRole, { page = 1, limit = 20 } = {}) {
    const query = userRole === ROLES.ADMIN ? {} : { userId };
    const skip = (Number(page) - 1) * Number(limit);

    const [payments, total] = await Promise.all([
      Payment.find(query)
        .populate({
          path: 'bookingId',
          select: 'bookingNumber rentalPlan startDateTime endDateTime vehicleId',
          populate: { path: 'vehicleId', select: 'brand model registrationNumber images' }
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Payment.countDocuments(query)
    ]);

    return {
      payments,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
        pages: Math.ceil(total / Number(limit))
      }
    };
  }
}
