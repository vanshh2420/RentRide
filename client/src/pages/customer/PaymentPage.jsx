import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { bookingApi } from '../../services/bookingApi';
import { paymentApi } from '../../services/paymentApi';
import { PriceBreakdownCard } from '../../features/booking/PriceBreakdownCard';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
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
  Building,
  CheckCircle2,
  Calendar,
  MapPin,
  FileText,
  KeyRound
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { getVehiclePrimaryImage } from '../../features/vehicles/utils/vehicleImageResolver';

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
        image: getVehiclePrimaryImage(booking?.vehicleId) || '',
        order_id: orderId,
        prefill: {
          name: user?.name || 'Customer',
          email: user?.email || 'customer@rentride.in',
          contact: user?.phone || '9999999999'
        },
        theme: {
          color: '#2557eb'
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

  // =========================================================================
  // SUCCESS / CONFIRMATION EXPERIENCE (Guideline 20)
  // =========================================================================
  if (paymentSuccess) {
    const finalBooking = confirmedBooking || booking;
    const v = finalBooking?.vehicleId;

    return (
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8 animate-fadeIn">
        {/* Success Icon & Confirmation Heading */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Payment Verified & Locked
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Booking Confirmed
            </h1>
            <p className="font-mono text-sm font-bold text-slate-500">
              Reference: <span className="text-slate-900 dark:text-white">{finalBooking?.bookingNumber || 'RR-CONFIRMED'}</span>
            </p>
          </div>
        </div>

        {/* Vehicle & Trip Summary Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-5">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
            <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center p-1 border border-slate-100 dark:border-slate-800">
              <img
                src={getVehiclePrimaryImage(v) || v?.images?.[0]?.url}
                alt={v?.model || 'Vehicle'}
                className="w-full h-full object-contain filter drop-shadow-sm"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                {v?.categoryId?.name || 'Ride'}
              </span>
              <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
                {v?.brand} {v?.model}
              </h3>
              <p className="text-xs text-slate-400 font-mono">{v?.registrationNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Pickup Date</span>
              <p className="font-bold text-slate-900 dark:text-white">
                {finalBooking?.startDateTime ? new Date(finalBooking.startDateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'As Scheduled'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Return Date</span>
              <p className="font-bold text-slate-900 dark:text-white">
                {finalBooking?.endDateTime ? new Date(finalBooking.endDateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'As Scheduled'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Hub Location</span>
              <p className="font-bold text-slate-900 dark:text-white">
                {v?.location?.city || 'Indore'} Central Hub
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Total Paid</span>
              <p className="font-heading font-black text-slate-900 dark:text-white text-base">
                ₹{finalBooking?.pricing?.totalAmount || '0'}
              </p>
            </div>
          </div>

          {/* Handover OTP Pill */}
          {finalBooking?.handoverOtp && (
            <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 flex items-center justify-center gap-1">
                <KeyRound className="w-3 h-3" /> Pickup Dispatch OTP
              </span>
              <p className="font-mono font-black text-2xl tracking-widest text-brand-600 dark:text-brand-400">
                {finalBooking.handoverOtp}
              </p>
              <p className="text-[11px] text-slate-500">
                Show this OTP to the fleet host at the hub to start your journey.
              </p>
            </div>
          )}
        </div>

        {/* Booking Lifecycle Timeline (Guideline 20) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-4">
          <h4 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-900 dark:text-white">
            Trip Timeline
          </h4>
          <div className="space-y-3">
            {[
              { label: 'Booking Confirmed', desc: 'Payment verified & slot locked atomically', done: true },
              { label: 'Pick Up Vehicle', desc: 'Reach dispatch hub and provide 4-digit OTP', current: true },
              { label: 'Start Your Trip', desc: 'Complete rapid digital vehicle inspection', upcoming: true },
              { label: 'Return Vehicle', desc: 'Return to hub & security deposit auto-refunded', upcoming: true },
              { label: 'Leave a Review', desc: 'Rate your ride experience & earn mobility rewards', upcoming: true },
            ].map((step, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5",
                  step.done
                    ? "bg-emerald-500 text-white"
                    : step.current
                    ? "bg-brand-600 text-white ring-4 ring-brand-500/20 animate-pulse"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                )}>
                  {step.done ? '✓' : idx + 1}
                </div>
                <div>
                  <h5 className={cn("text-xs font-bold", step.done || step.current ? "text-slate-900 dark:text-white" : "text-slate-400")}>
                    {step.label}
                  </h5>
                  <p className="text-[11px] text-slate-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to={`/bookings/${finalBooking?._id || bookingId}`}
            className="px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-md text-center flex items-center justify-center gap-2"
          >
            <span>View Full Booking Details</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/my-bookings"
            className="px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs text-center"
          >
            My Bookings Center
          </Link>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PAYMENT SELECTION VIEW
  // =========================================================================
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Header */}
      <Breadcrumb
        items={[
          { label: 'Explore', href: '/explore' },
          { label: 'Checkout', href: `/checkout/${booking?.vehicleId?._id || ''}` },
          { label: 'Secure Payment' }
        ]}
      />

      {/* 10-Minute Lock Hold Timer */}
      <div className="p-4 sm:p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Clock className="w-5 h-5 text-amber-600 animate-pulse flex-shrink-0" />
          <div>
            <h4 className="font-extrabold text-amber-900 dark:text-amber-200">
              Inventory Held For You
            </h4>
            <p className="text-amber-700 dark:text-amber-300/80">
              This vehicle is temporarily locked against double-booking. Complete payment before time runs out.
            </p>
          </div>
        </div>
        <div className="font-mono font-black text-2xl text-amber-900 dark:text-amber-200 px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-900/60 flex-shrink-0">
          {formatTimer(timeLeft)}
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Payment Gateway Options */}
        <div className="md:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-6">
            <div className="space-y-1">
              <h2 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
                Select Payment Method
              </h2>
              <p className="text-xs text-slate-500">
                Safe, PCI-DSS compliant checkout with instant refund protection.
              </p>
            </div>

            {/* Gateway Card */}
            <div className="p-5 rounded-2xl border-2 border-brand-600 bg-brand-50/40 dark:bg-brand-950/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold shadow-xs">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white">
                      Razorpay Online Gateway
                    </h3>
                    <p className="text-[11px] text-slate-500">UPI, GooglePay, Cards, NetBanking, Wallets</p>
                  </div>
                </div>
                <span className="w-4 h-4 rounded-full border-4 border-brand-600 bg-white dark:bg-slate-900 flex-shrink-0" />
              </div>

              <div className="pt-2 border-t border-brand-200/60 dark:border-brand-900/60 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" /> 256-Bit SSL Encrypted
                </span>
                <span>Zero convenience surcharge</span>
              </div>
            </div>

            {/* Pay Button */}
            <button
              type="button"
              onClick={handleRazorpayPayment}
              disabled={isProcessing}
              className="w-full py-4 px-6 rounded-2xl bg-brand-600 hover:bg-brand-500 active:scale-[0.99] disabled:opacity-50 text-white font-extrabold text-sm shadow-md hover:shadow-hover transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Secure Checkout...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay ₹{booking?.pricing?.totalAmount} & Confirm Reservation</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Simulated Sandbox Pay Option */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                type="button"
                onClick={() => handleSimulatedPayment()}
                disabled={isProcessing}
                className="text-xs font-semibold text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 underline"
              >
                Fast-track Simulator (Instant Test Verification)
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Summary Card */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-4">
            <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-900 dark:text-white">
              Booking Summary
            </h3>

            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center p-1 border border-slate-100 dark:border-slate-800">
                <img
                  src={getVehiclePrimaryImage(booking?.vehicleId) || booking?.vehicleId?.images?.[0]?.url}
                  alt="Vehicle"
                  className="w-full h-full object-contain filter drop-shadow-sm"
                />
              </div>
              <div>
                <h4 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white">
                  {booking?.vehicleId?.brand} {booking?.vehicleId?.model}
                </h4>
                <p className="text-[11px] text-slate-400 font-mono">{booking?.bookingNumber}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Rental Plan</span>
                <span className="font-bold text-slate-900 dark:text-white">{booking?.rentalPlan}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Duration</span>
                <span className="font-bold text-slate-900 dark:text-white">{booking?.billableHours} Hours</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Base Fare</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{booking?.pricing?.basePrice}</span>
              </div>
              {booking?.pricing?.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Discount</span>
                  <span>-₹{booking?.pricing?.couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Security Deposit</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{booking?.pricing?.securityDeposit}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline text-sm">
                <span className="font-extrabold text-slate-900 dark:text-white">Amount Due</span>
                <span className="font-heading font-black text-xl text-slate-900 dark:text-white">
                  ₹{booking?.pricing?.totalAmount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
