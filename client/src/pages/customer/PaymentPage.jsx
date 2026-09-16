import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { bookingApi } from '../../services/bookingApi';
import { paymentApi } from '../../services/paymentApi';
import { PriceBreakdownCard } from '../../features/booking/PriceBreakdownCard';
import { 
  CreditCard, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight, 
  Lock, 
  Sparkles,
  Zap,
  Building
} from 'lucide-react';

export const PaymentPage = () => {
  const { id: bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    fetchBooking();
    loadRazorpayScript();
  }, [bookingId]);

  useEffect(() => {
    if (!booking?.lockExpiresAt || paymentSuccess) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((new Date(booking.lockExpiresAt).getTime() - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [booking, paymentSuccess]);

  const loadRazorpayScript = () => {
    if (document.getElementById('razorpay-sdk')) return;
    const script = document.createElement('script');
    script.id = 'razorpay-sdk';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  };

  const fetchBooking = async () => {
    setIsLoading(true);
    try {
      const res = await bookingApi.getBookingById(bookingId);
      setBooking(res.data.booking);
      if (res.data.booking.paymentStatus === 'SUCCESS') {
        setPaymentSuccess(true);
        setConfirmedBooking(res.data.booking);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load booking details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    setErrorMessage('');

    try {
      // 1. Create order on backend
      const orderRes = await paymentApi.createRazorpayOrder(bookingId);
      const { orderId, amount, currency, keyId } = orderRes.data;

      const isDummyKey =
        !keyId ||
        keyId.includes('your_key_id_here') ||
        keyId.includes('placeholder') ||
        orderId.startsWith('order_sim_');

      if (isDummyKey) {
        // Automatically process through simulated verification in sandbox mode
        await handleSimulatedPayment(orderId);
        return;
      }

      // 2. Configure Razorpay Standard Checkout options for live/real test keys
      const options = {
        key: keyId,
        amount,
        currency,
        name: 'RentRide Marketplace',
        description: `Rental Booking #${booking.bookingNumber}`,
        image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=200&q=80',
        order_id: orderId,
        prefill: {
          name: user?.name || 'Customer',
          email: user?.email || 'customer@rentride.in',
          contact: user?.phone || '9999999999'
        },
        theme: {
          color: '#0284c7'
        },
        handler: async (response) => {
          try {
            const verifyRes = await paymentApi.verifyPayment({
              bookingId,
              razorpay_order_id: response.razorpay_order_id || orderId,
              razorpay_payment_id: response.razorpay_payment_id || `pay_${Date.now()}`,
              razorpay_signature: response.razorpay_signature || 'simulated_sig_dev'
            });

            setPaymentSuccess(true);
            setConfirmedBooking(verifyRes.data.booking);
          } catch (verifyErr) {
            setErrorMessage(verifyErr.message || 'Payment verification failed');
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          }
        }
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          setErrorMessage(response.error?.description || 'Payment was declined by your bank.');
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        await handleSimulatedPayment(orderId);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to initialize payment gateway');
      setIsProcessing(false);
    }
  };

  const handleSimulatedPayment = async (existingOrderId = null) => {
    setIsProcessing(true);
    setErrorMessage('');
    try {
      let finalOrderId = existingOrderId;
      if (!finalOrderId) {
        const orderRes = await paymentApi.createRazorpayOrder(bookingId);
        finalOrderId = orderRes.data.orderId;
      }
      const fakePaymentId = `pay_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const fakeSig = `simulated_sig_${Date.now()}`;

      const verifyRes = await paymentApi.verifyPayment({
        bookingId,
        razorpay_order_id: finalOrderId,
        razorpay_payment_id: fakePaymentId,
        razorpay_signature: fakeSig
      });

      setPaymentSuccess(true);
      setConfirmedBooking(verifyRes.data.booking);
    } catch (err) {
      setErrorMessage(err.message || 'Simulated payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg animate-bounce">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
            Payment Confirmed
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
            Your Ride is Reserved!
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Booking <span className="font-bold text-slate-800 dark:text-slate-200">#{confirmedBooking?.bookingNumber || booking?.bookingNumber}</span> has been confirmed. The vendor has been notified for pickup.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left space-y-3 text-xs">
          <div className="flex justify-between border-b pb-2 border-slate-200 dark:border-slate-700">
            <span className="text-slate-400">Total Paid (with deposit):</span>
            <span className="font-bold text-slate-900 dark:text-white">₹{booking?.priceBreakdown?.totalAmount}</span>
          </div>
          <div className="flex justify-between border-b pb-2 border-slate-200 dark:border-slate-700">
            <span className="text-slate-400">Pickup Date & Time:</span>
            <span className="font-bold text-slate-900 dark:text-white">{new Date(booking?.startDateTime).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Vehicle:</span>
            <span className="font-bold text-slate-900 dark:text-white">{booking?.vehicleId?.brand} {booking?.vehicleId?.model}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            to={`/bookings/${booking?._id}`}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-colors"
          >
            View Tax Invoice
          </Link>
          <Link
            to="/my-bookings"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Go to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Lock Banner */}
      <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-amber-200/90 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-subtle">
        <div className="flex items-center gap-3 text-amber-800 dark:text-amber-300">
          <Clock className="w-6 h-6 flex-shrink-0 animate-pulse text-amber-600" />
          <div className="text-xs">
            <span className="font-bold block">Vehicle Inventory Slot Locked</span>
            <span className="text-amber-700 dark:text-amber-400">
              Complete payment before timer expires to guarantee reservation.
            </span>
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-amber-600 text-white font-mono text-base font-extrabold shadow-sm">
          {timeLeft > 0 ? formatTimer(timeLeft) : 'EXPIRED'}
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {timeLeft <= 0 && (
        <div className="p-6 rounded-3xl bg-red-50 text-red-700 text-center space-y-3">
          <AlertCircle className="w-8 h-8 mx-auto" />
          <h3 className="font-bold text-base">Your 10-Minute Reservation Slot Has Expired</h3>
          <p className="text-xs">The vehicle slot has been released back into the fleet. Please pick a new time.</p>
          <Link to="/explore" className="inline-block px-5 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold">
            Back to Explore
          </Link>
        </div>
      )}

      {timeLeft > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left 2 Cols: Payment Options */}
          <div className="md:col-span-2 space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-subtle">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Secure Checkout</span>
                <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Select Payment Option
                </h2>
              </div>

              {/* Razorpay Gateway Card */}
              <div className="p-5 rounded-2xl border-2 border-brand-600 bg-brand-50/40 dark:bg-brand-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-white text-sm">
                    <CreditCard className="w-5 h-5 text-brand-600" />
                    <span>Razorpay Standard Gateway</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-600 text-white">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Pay instantly via UPI (GPay, PhonePe, Paytm), Credit & Debit Cards (Visa, Mastercard, RuPay), or NetBanking.
                </p>
                <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>256-Bit SSL Encrypted & RBI Compliant</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  disabled={isProcessing || timeLeft <= 0}
                  onClick={handleRazorpayPayment}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-700 hover:to-sky-700 text-white font-bold text-sm shadow-md hover:shadow-hover transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ₹{booking?.priceBreakdown?.totalAmount} with Razorpay</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Instant Dev Mode Sandbox Simulator */}
                <button
                  type="button"
                  disabled={isProcessing || timeLeft <= 0}
                  onClick={handleSimulatedPayment}
                  className="w-full py-2.5 px-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Zap className="w-3.5 h-3.5 text-accent-500" />
                  <span>Simulate Instant Success (Development Sandbox Test)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Col: Order Breakdown */}
          <div className="space-y-4">
            <PriceBreakdownCard
              priceBreakdown={booking?.priceBreakdown}
              rentalPlan={booking?.rentalPlan}
              durationHours={booking?.durationHours}
              appliedCoupon={booking?.couponApplied}
            />
          </div>
        </div>
      )}
    </div>
  );
};
