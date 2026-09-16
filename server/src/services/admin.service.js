import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import { Vehicle } from '../models/vehicle.model.js';
import { Booking } from '../models/booking.model.js';
import { Payment } from '../models/payment.model.js';
import { Maintenance } from '../models/maintenance.model.js';
import { Review } from '../models/review.model.js';
import { Category } from '../models/category.model.js';
import { Notification } from '../models/notification.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ROLES } from '../constants/roles.js';
import { VEHICLE_STATUS, BOOKING_STATUS, PAYMENT_STATUS } from '../constants/status.js';

export class AdminService {
  /**
   * Comprehensive Platform Analytics, KPIs & Recharts-ready Datasets
   */
  static async getPlatformOverviewStats() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalCustomers,
      totalVendors,
      totalVehicles,
      approvedVehicles,
      pendingApprovals,
      maintenanceVehicles,
      bookings,
      payments,
      categories
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: ROLES.CUSTOMER }),
      User.countDocuments({ role: ROLES.VENDOR }),
      Vehicle.countDocuments(),
      Vehicle.countDocuments({ isApproved: true }),
      Vehicle.countDocuments({ isApproved: false }),
      Vehicle.countDocuments({ status: VEHICLE_STATUS.MAINTENANCE }),
      Booking.find()
        .populate('vehicleId', 'brand model registrationNumber location')
        .populate('vendorId', 'name email phone vendorProfile')
        .populate('customerId', 'name email phone')
        .sort({ createdAt: -1 }),
      Payment.find({ status: PAYMENT_STATUS.SUCCESS }),
      Category.find().select('name slug')
    ]);

    let totalGMV = 0;
    let totalPlatformCommission = 0;
    let totalVendorPayouts = 0;

    const statusCounts = {
      CONFIRMED: 0,
      ACTIVE: 0,
      COMPLETED: 0,
      CANCELLED: 0,
      PENDING_PAYMENT: 0
    };

    const vehicleBookingMap = {};
    const vendorBookingMap = {};

    bookings.forEach((b) => {
      // Accumulate status counts
      if (statusCounts[b.status] !== undefined) {
        statusCounts[b.status] += 1;
      }

      // Financials for valid bookings
      if (b.status === BOOKING_STATUS.CONFIRMED || b.status === BOOKING_STATUS.ACTIVE || b.status === BOOKING_STATUS.COMPLETED) {
        totalGMV += b.priceBreakdown?.subtotal || b.priceBreakdown?.totalAmount || 0;
        totalPlatformCommission += b.priceBreakdown?.platformCommission || 0;
        totalVendorPayouts += b.priceBreakdown?.vendorPayout || 0;
      }

      // Top Vehicles tracker
      if (b.vehicleId && b.vehicleId._id) {
        const vId = b.vehicleId._id.toString();
        if (!vehicleBookingMap[vId]) {
          vehicleBookingMap[vId] = {
            id: vId,
            name: `${b.vehicleId.brand} ${b.vehicleId.model}`,
            plate: b.vehicleId.registrationNumber,
            bookingsCount: 0,
            revenue: 0
          };
        }
        vehicleBookingMap[vId].bookingsCount += 1;
        vehicleBookingMap[vId].revenue += b.priceBreakdown?.totalAmount || 0;
      }

      // Top Vendors tracker
      if (b.vendorId && b.vendorId._id) {
        const vnId = b.vendorId._id.toString();
        if (!vendorBookingMap[vnId]) {
          vendorBookingMap[vnId] = {
            id: vnId,
            name: b.vendorId.vendorProfile?.businessName || b.vendorId.name,
            email: b.vendorId.email,
            bookingsCount: 0,
            revenue: 0
          };
        }
        vendorBookingMap[vnId].bookingsCount += 1;
        vendorBookingMap[vnId].revenue += b.priceBreakdown?.vendorPayout || 0;
      }
    });

    // 30-Day Daily Booking & Revenue Trend (Recharts-friendly)
    const dailyMap = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().slice(5, 10); // MM-DD
      dailyMap[dateStr] = { date: dateStr, bookings: 0, revenue: 0, commission: 0 };
    }

    bookings.forEach((b) => {
      const bDate = new Date(b.createdAt);
      if (bDate >= thirtyDaysAgo) {
        const dateStr = bDate.toISOString().slice(5, 10);
        if (dailyMap[dateStr]) {
          dailyMap[dateStr].bookings += 1;
          if (b.status === BOOKING_STATUS.CONFIRMED || b.status === BOOKING_STATUS.ACTIVE || b.status === BOOKING_STATUS.COMPLETED) {
            dailyMap[dateStr].revenue += b.priceBreakdown?.subtotal || b.priceBreakdown?.totalAmount || 0;
            dailyMap[dateStr].commission += b.priceBreakdown?.platformCommission || 0;
          }
        }
      }
    });

    const bookingTrends = Object.values(dailyMap);

    // Fleet Category Distribution
    const categoryDistributionAgg = await Vehicle.aggregate([
      {
        $group: {
          _id: '$categoryId',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: '$category'
      },
      {
        $project: {
          name: '$category.name',
          count: 1
        }
      }
    ]);

    const categoryDistribution = categoryDistributionAgg.map((c) => ({
      name: c.name,
      value: c.count
    }));

    // Top 5 Vehicles and Vendors
    const topVehicles = Object.values(vehicleBookingMap)
      .sort((a, b) => b.bookingsCount - a.bookingsCount)
      .slice(0, 5);

    const topVendors = Object.values(vendorBookingMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Pending Payments count
    const pendingPayments = await Payment.countDocuments({ status: PAYMENT_STATUS.PENDING });

    // Recent 10 bookings
    const recentBookings = bookings.slice(0, 10);

    return {
      overview: {
        totalUsers,
        totalCustomers,
        totalVendors,
        totalVehicles,
        approvedVehicles,
        pendingApprovals,
        maintenanceVehicles,
        totalBookings: bookings.length,
        activeRentals: statusCounts.ACTIVE,
        completedBookings: statusCounts.COMPLETED,
        cancelledBookings: statusCounts.CANCELLED,
        pendingPayments
      },
      financials: {
        totalGMV,
        totalPlatformCommission,
        totalVendorPayouts,
        totalPaymentsCollected: payments.reduce((sum, p) => sum + p.amount, 0)
      },
      charts: {
        bookingTrends,
        categoryDistribution,
        statusDistribution: [
          { name: 'Completed', count: statusCounts.COMPLETED, fill: '#10B981' },
          { name: 'Active', count: statusCounts.ACTIVE, fill: '#6366F1' },
          { name: 'Confirmed', count: statusCounts.CONFIRMED, fill: '#3B82F6' },
          { name: 'Cancelled', count: statusCounts.CANCELLED, fill: '#EF4444' },
          { name: 'Pending Payment', count: statusCounts.PENDING_PAYMENT, fill: '#F59E0B' }
        ],
        topVehicles,
        topVendors
      },
      recentBookings
    };
  }

  // ==========================================
  // USER MANAGEMENT
  // ==========================================

  /**
   * List users with role, status, and search filters
   */
  static async getAllUsers({ role, status = 'ALL', search = '', page = 1, limit = 20 } = {}) {
    const query = {};
    if (role) query.role = role;
    if (status === 'ACTIVE') query.isActive = true;
    if (status === 'SUSPENDED') query.isActive = false;

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      query.$or = [{ name: searchRegex }, { email: searchRegex }, { phone: searchRegex }];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(query)
    ]);

    return {
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  /**
   * Get User Detail by ID with associated activity summary
   */
  static async getUserById(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    let stats = {};
    if (user.role === ROLES.CUSTOMER) {
      const [bookingsCount, completedCount, totalSpentAgg] = await Promise.all([
        Booking.countDocuments({ customerId: user._id }),
        Booking.countDocuments({ customerId: user._id, status: BOOKING_STATUS.COMPLETED }),
        Booking.aggregate([
          { $match: { customerId: user._id, status: { $in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.ACTIVE, BOOKING_STATUS.COMPLETED] } } },
          { $group: { _id: null, totalSpent: { $sum: '$priceBreakdown.totalAmount' } } }
        ])
      ]);

      const recentBookings = await Booking.find({ customerId: user._id })
        .populate('vehicleId', 'brand model registrationNumber')
        .sort({ createdAt: -1 })
        .limit(5);

      stats = {
        bookingsCount,
        completedCount,
        totalSpent: totalSpentAgg[0]?.totalSpent || 0,
        recentBookings
      };
    } else if (user.role === ROLES.VENDOR) {
      const [fleetCount, bookingsCount, earningsAgg] = await Promise.all([
        Vehicle.countDocuments({ vendorId: user._id }),
        Booking.countDocuments({ vendorId: user._id }),
        Booking.aggregate([
          { $match: { vendorId: user._id, status: { $in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.ACTIVE, BOOKING_STATUS.COMPLETED] } } },
          { $group: { _id: null, totalEarnings: { $sum: '$priceBreakdown.vendorPayout' } } }
        ])
      ]);

      const fleet = await Vehicle.find({ vendorId: user._id })
        .populate('categoryId', 'name')
        .sort({ createdAt: -1 })
        .limit(10);

      stats = {
        fleetCount,
        bookingsCount,
        totalEarnings: earningsAgg[0]?.totalEarnings || 0,
        fleet
      };
    }

    return { user, stats };
  }

  /**
   * Toggle User Account Status (Active/Suspended)
   */
  static async updateUserStatus(userId, { isActive, status, reason = '' }, adminUserId) {
    if (userId.toString() === adminUserId.toString()) {
      throw new ApiError(400, 'Security violation: You cannot suspend your own admin account');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const targetActive = isActive !== undefined ? Boolean(isActive) : status === 'ACTIVE';
    user.isActive = targetActive;
    await user.save();

    // Create in-app notification for the user
    await Notification.create({
      recipientId: user._id,
      recipientRole: user.role,
      type: targetActive ? 'ACCOUNT_ACTIVATED' : 'ACCOUNT_SUSPENDED',
      title: targetActive ? 'Account Re-activated' : 'Account Suspended',
      message: targetActive
        ? 'Your RentRide account access has been restored.'
        : `Your RentRide account has been suspended by administration. Reason: ${reason || 'Terms of service violation review.'}`,
      data: { userId: user._id }
    });

    return await User.findById(user._id).select('-password');
  }

  // ==========================================
  // VENDOR MANAGEMENT
  // ==========================================

  /**
   * List all vendors with aggregated fleet size, revenue, and approval status
   */
  static async getAllVendors({ isApproved = 'all', status = 'ALL', search = '', page = 1, limit = 20 } = {}) {
    const query = { role: ROLES.VENDOR };

    if (isApproved === 'true') query['vendorProfile.isApproved'] = true;
    if (isApproved === 'false') query['vendorProfile.isApproved'] = false;
    if (status === 'ACTIVE') query.isActive = true;
    if (status === 'SUSPENDED') query.isActive = false;

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { 'vendorProfile.businessName': searchRegex },
        { 'vendorProfile.gstNumber': searchRegex },
        { 'vendorProfile.address.city': searchRegex }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [vendors, total] = await Promise.all([
      User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(query)
    ]);

    // Attach fleet count and total revenue for each vendor
    const vendorIds = vendors.map((v) => v._id);

    const [fleetCounts, earningsCounts] = await Promise.all([
      Vehicle.aggregate([
        { $match: { vendorId: { $in: vendorIds } } },
        { $group: { _id: '$vendorId', totalVehicles: { $sum: 1 }, activeVehicles: { $sum: { $cond: [{ $eq: ['$status', VEHICLE_STATUS.AVAILABLE] }, 1, 0] } } } }
      ]),
      Booking.aggregate([
        { $match: { vendorId: { $in: vendorIds }, status: { $in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.ACTIVE, BOOKING_STATUS.COMPLETED] } } },
        { $group: { _id: '$vendorId', totalRevenue: { $sum: '$priceBreakdown.vendorPayout' }, totalBookings: { $sum: 1 } } }
      ])
    ]);

    const fleetMap = {};
    fleetCounts.forEach((f) => {
      fleetMap[f._id.toString()] = f;
    });

    const earningsMap = {};
    earningsCounts.forEach((e) => {
      earningsMap[e._id.toString()] = e;
    });

    const enrichedVendors = vendors.map((v) => {
      const vObj = v.toObject();
      const vId = v._id.toString();
      vObj.fleetMetrics = fleetMap[vId] || { totalVehicles: 0, activeVehicles: 0 };
      vObj.revenueMetrics = earningsMap[vId] || { totalRevenue: 0, totalBookings: 0 };
      return vObj;
    });

    return {
      vendors: enrichedVendors,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  /**
   * Get single vendor details by ID with complete fleet and earnings
   */
  static async getVendorById(vendorId) {
    const vendor = await User.findOne({ _id: vendorId, role: ROLES.VENDOR }).select('-password');
    if (!vendor) {
      throw new ApiError(404, 'Vendor not found');
    }

    const [vehicles, recentBookings, revenueSummary] = await Promise.all([
      Vehicle.find({ vendorId: vendor._id }).populate('categoryId', 'name type'),
      Booking.find({ vendorId: vendor._id })
        .populate('vehicleId', 'brand model registrationNumber')
        .populate('customerId', 'name phone')
        .sort({ createdAt: -1 })
        .limit(10),
      Booking.aggregate([
        { $match: { vendorId: vendor._id, status: { $in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.ACTIVE, BOOKING_STATUS.COMPLETED] } } },
        { $group: { _id: null, totalEarnings: { $sum: '$priceBreakdown.vendorPayout' }, totalBookings: { $sum: 1 } } }
      ])
    ]);

    return {
      vendor,
      vehicles,
      recentBookings,
      revenueSummary: revenueSummary[0] || { totalEarnings: 0, totalBookings: 0 }
    };
  }

  /**
   * Approve or reject vendor partner
   */
  static async updateVendorApproval(vendorId, { isApproved, reason = '' }) {
    const vendor = await User.findOne({ _id: vendorId, role: ROLES.VENDOR });
    if (!vendor) {
      throw new ApiError(404, 'Vendor not found');
    }

    if (!vendor.vendorProfile) {
      vendor.vendorProfile = {};
    }

    vendor.vendorProfile.isApproved = Boolean(isApproved);
    await vendor.save();

    await Notification.create({
      recipientId: vendor._id,
      recipientRole: ROLES.VENDOR,
      type: isApproved ? 'VENDOR_APPROVED' : 'VENDOR_REJECTED',
      title: isApproved ? 'Vendor Account Approved!' : 'Vendor Application Rejected',
      message: isApproved
        ? 'Congratulations! Your RentRide vendor account is approved. You can now list fleet vehicles.'
        : `Your vendor application was rejected. Reason: ${reason || 'Verification requirements not met.'}`,
      data: { vendorId: vendor._id }
    });

    return await User.findById(vendor._id).select('-password');
  }

  /**
   * Suspend or activate vendor account
   */
  static async updateVendorStatus(vendorId, { isActive, reason = '' }) {
    const vendor = await User.findOne({ _id: vendorId, role: ROLES.VENDOR });
    if (!vendor) {
      throw new ApiError(404, 'Vendor not found');
    }

    vendor.isActive = Boolean(isActive);
    await vendor.save();

    // If suspended, also temporarily mark available vehicles as inactive
    if (!isActive) {
      await Vehicle.updateMany(
        { vendorId: vendor._id, status: VEHICLE_STATUS.AVAILABLE },
        { status: VEHICLE_STATUS.INACTIVE }
      );
    } else {
      await Vehicle.updateMany(
        { vendorId: vendor._id, isApproved: true, status: VEHICLE_STATUS.INACTIVE },
        { status: VEHICLE_STATUS.AVAILABLE }
      );
    }

    await Notification.create({
      recipientId: vendor._id,
      recipientRole: ROLES.VENDOR,
      type: isActive ? 'ACCOUNT_ACTIVATED' : 'ACCOUNT_SUSPENDED',
      title: isActive ? 'Vendor Account Restored' : 'Vendor Account Suspended',
      message: isActive
        ? 'Your vendor operational access has been re-activated.'
        : `Your vendor account has been suspended. Reason: ${reason || 'Compliance review.'}`,
      data: { vendorId: vendor._id }
    });

    return await User.findById(vendor._id).select('-password');
  }

  // ==========================================
  // VEHICLE MANAGEMENT & APPROVAL WORKFLOW
  // ==========================================

  /**
   * List all vehicles with approval, status, category, city filters
   */
  static async getAllVehicles({ isApproved = 'all', status = 'ALL', categoryId, vendorId, city, search = '', page = 1, limit = 20 } = {}) {
    const query = {};

    if (isApproved === 'true') query.isApproved = true;
    if (isApproved === 'false') query.isApproved = false;
    if (status !== 'ALL') query.status = status;
    if (categoryId) query.categoryId = categoryId;
    if (vendorId) query.vendorId = vendorId;
    if (city && city !== 'ALL') query['location.city'] = { $regex: city, $options: 'i' };

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      query.$or = [
        { brand: searchRegex },
        { model: searchRegex },
        { registrationNumber: searchRegex },
        { 'location.city': searchRegex }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [vehicles, total] = await Promise.all([
      Vehicle.find(query)
        .populate('categoryId', 'name slug type')
        .populate('vendorId', 'name email phone vendorProfile')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Vehicle.countDocuments(query)
    ]);

    return {
      vehicles,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  /**
   * Get single vehicle details by ID
   */
  static async getVehicleById(vehicleId) {
    const vehicle = await Vehicle.findById(vehicleId)
      .populate('categoryId', 'name slug type')
      .populate('vendorId', 'name email phone vendorProfile')
      .populate('catalogId');

    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found');
    }

    const [recentBookings, maintenanceRecords, reviews] = await Promise.all([
      Booking.find({ vehicleId: vehicle._id })
        .populate('customerId', 'name phone email')
        .sort({ createdAt: -1 })
        .limit(5),
      Maintenance.find({ vehicleId: vehicle._id }).sort({ createdAt: -1 }).limit(5),
      Review.find({ vehicleId: vehicle._id }).populate('customerId', 'name avatar').sort({ createdAt: -1 }).limit(10)
    ]);

    return {
      vehicle,
      recentBookings,
      maintenanceRecords,
      reviews
    };
  }

  /**
   * Approve or reject vendor vehicle listing
   */
  static async approveOrRejectVehicle(vehicleId, { isApproved, status = VEHICLE_STATUS.AVAILABLE, rejectionReason = '' }) {
    const vehicle = await Vehicle.findById(vehicleId).populate('vendorId');
    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found');
    }

    vehicle.isApproved = Boolean(isApproved);
    vehicle.status = isApproved ? status : VEHICLE_STATUS.INACTIVE;
    await vehicle.save();

    // Send in-app notification to vendor
    if (vehicle.vendorId) {
      await Notification.create({
        recipientId: vehicle.vendorId._id,
        recipientRole: ROLES.VENDOR,
        type: isApproved ? 'VEHICLE_APPROVED' : 'VEHICLE_REJECTED',
        title: isApproved ? 'Vehicle Listing Approved!' : 'Vehicle Listing Rejected',
        message: isApproved
          ? `Your vehicle ${vehicle.brand} ${vehicle.model} (${vehicle.registrationNumber}) has been approved and is now live on the marketplace!`
          : `Your vehicle listing for ${vehicle.brand} ${vehicle.model} was rejected. Reason: ${rejectionReason || 'Quality check requirements not met.'}`,
        data: { vehicleId: vehicle._id }
      });
    }

    return vehicle;
  }

  /**
   * Activate or Deactivate vehicle
   */
  static async updateVehicleStatus(vehicleId, { status, reason = '' }) {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found');
    }

    vehicle.status = status;
    await vehicle.save();
    return vehicle;
  }

  // ==========================================
  // BOOKING MANAGEMENT
  // ==========================================

  /**
   * Global Bookings Audit Trail
   */
  static async getAllBookings({ status = 'ALL', paymentStatus = 'ALL', bookingType = 'ALL', vendorId, vehicleId, customerId, search = '', page = 1, limit = 20 } = {}) {
    const query = {};

    if (status !== 'ALL') query.status = status;
    if (paymentStatus !== 'ALL') query.paymentStatus = paymentStatus;
    if (bookingType !== 'ALL') query.bookingType = bookingType;
    if (vendorId) query.vendorId = vendorId;
    if (vehicleId) query.vehicleId = vehicleId;
    if (customerId) query.customerId = customerId;

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      query.$or = [
        { bookingNumber: searchRegex },
        { 'offlineCustomer.name': searchRegex },
        { 'offlineCustomer.phone': searchRegex }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('vehicleId', 'brand model registrationNumber location pricing images')
        .populate('vendorId', 'name email phone vendorProfile')
        .populate('customerId', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Booking.countDocuments(query)
    ]);

    return {
      bookings,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  /**
   * Get single booking details by ID
   */
  static async getBookingById(bookingId) {
    const booking = await Booking.findById(bookingId)
      .populate('vehicleId')
      .populate('vendorId', 'name email phone vendorProfile')
      .populate('customerId', 'name email phone customerProfile')
      .populate('couponApplied');

    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    const [payments, review] = await Promise.all([
      Payment.find({ bookingId: booking._id }),
      Review.findOne({ bookingId: booking._id })
    ]);

    return {
      booking,
      payments,
      review
    };
  }

  // ==========================================
  // PAYMENT MANAGEMENT
  // ==========================================

  /**
   * List all platform payments with status and method filters
   */
  static async getAllPayments({ status = 'ALL', paymentMethod = 'ALL', search = '', page = 1, limit = 20 } = {}) {
    const query = {};

    if (status !== 'ALL') query.status = status;
    if (paymentMethod !== 'ALL') query.paymentMethod = paymentMethod;

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      query.$or = [
        { razorpayOrderId: searchRegex },
        { razorpayPaymentId: searchRegex }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [payments, total] = await Promise.all([
      Payment.find(query)
        .populate('userId', 'name email phone role')
        .populate({
          path: 'bookingId',
          select: 'bookingNumber status rentalPlan priceBreakdown startDateTime endDateTime',
          populate: [
            { path: 'vehicleId', select: 'brand model registrationNumber' },
            { path: 'vendorId', select: 'name email vendorProfile' }
          ]
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
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  /**
   * Get payment details by ID
   */
  static async getPaymentById(paymentId) {
    const payment = await Payment.findById(paymentId)
      .populate('userId', 'name email phone role')
      .populate({
        path: 'bookingId',
        populate: [
          { path: 'vehicleId', select: 'brand model registrationNumber location' },
          { path: 'vendorId', select: 'name email phone vendorProfile' },
          { path: 'customerId', select: 'name email phone' }
        ]
      });

    if (!payment) {
      throw new ApiError(404, 'Payment record not found');
    }

    return payment;
  }

  // ==========================================
  // MAINTENANCE MANAGEMENT
  // ==========================================

  /**
   * List all maintenance records across the marketplace
   */
  static async getAllMaintenance({ status = 'ALL', maintenanceType = 'ALL', vehicleId, vendorId, search = '', page = 1, limit = 20 } = {}) {
    const query = {};

    if (status !== 'ALL') query.status = status;
    if (maintenanceType !== 'ALL') query.maintenanceType = maintenanceType;
    if (vehicleId) query.vehicleId = vehicleId;
    if (vendorId) query.vendorId = vendorId;

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      query.description = searchRegex;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [maintenance, total] = await Promise.all([
      Maintenance.find(query)
        .populate('vehicleId', 'brand model registrationNumber location status images')
        .populate('vendorId', 'name email phone vendorProfile')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Maintenance.countDocuments(query)
    ]);

    return {
      maintenance,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  // ==========================================
  // REVIEW MANAGEMENT
  // ==========================================

  /**
   * List customer reviews with rating and moderation filters
   */
  static async getAllReviews({ rating, isModerated = 'all', vehicleId, vendorId, search = '', page = 1, limit = 20 } = {}) {
    const query = {};

    if (rating) query.rating = Number(rating);
    if (isModerated === 'true') query.isModerated = true;
    if (isModerated === 'false') query.isModerated = false;
    if (vehicleId) query.vehicleId = vehicleId;
    if (vendorId) query.vendorId = vendorId;

    if (search && search.trim()) {
      query.comment = { $regex: search.trim(), $options: 'i' };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate('vehicleId', 'brand model registrationNumber images')
        .populate('vendorId', 'name email vendorProfile')
        .populate('customerId', 'name email avatar')
        .populate('bookingId', 'bookingNumber startDateTime endDateTime')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Review.countDocuments(query)
    ]);

    return {
      reviews,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  /**
   * Moderate Review (publish / unpublish) and recalculate vehicle average rating
   */
  static async moderateReview(reviewId, { isModerated }) {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    review.isModerated = Boolean(isModerated);
    await review.save();

    // Recalculate vehicle rating
    if (review.vehicleId) {
      await Review.calculateAverageRating(review.vehicleId);
    }

    return review;
  }
}
