import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingApi } from '../../services/bookingApi';
import { PriceBreakdownCard } from '../../features/booking/PriceBreakdownCard';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  Store, 
  FileText, 
  ShieldCheck, 
  CheckCircle, 
  Printer,
  ArrowLeft,
  KeyRound
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const BookingDetailsPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    setIsLoading(true);
    try {
      const res = await bookingApi.getBookingById(id);
      setBooking(res.data.booking);
    } catch (err) {
      setError(err.message || 'Failed to load booking details');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">Booking Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'This booking does not exist or you do not have permission to view it.'}</p>
        <Link to="/my-bookings" className="inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-sm">
          Back to Bookings
        </Link>
      </div>
    );
  }

  const v = booking.vehicleId;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Top Action & Breadcrumb Bar */}
      <div className="flex items-center justify-between">
        <Breadcrumb
          items={[
            { label: 'My Bookings', href: '/my-bookings' },
            { label: `Invoice #${booking.bookingNumber}` }
          ]}
        />

        <button
          type="button"
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Printer className="w-4 h-4" />
          <span>Print Tax Invoice</span>
        </button>
      </div>

      {/* Invoice Container */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-8 shadow-card">
        
        {/* Header with RentRide Logo & Booking Meta */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-2xl font-black bg-gradient-to-r from-brand-600 to-emerald-500 bg-clip-text text-transparent">
                RentRide
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                Official Tax Invoice
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Issued: {new Date(booking.createdAt).toLocaleDateString()} • GST Registered Marketplace
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <span className="text-xs text-slate-400 font-semibold block">Booking Reference</span>
            <div className="flex items-center gap-2 justify-start sm:justify-end">
              <span className="font-mono text-base font-black text-slate-900 dark:text-white">
                #{booking.bookingNumber}
              </span>
              <StatusBadge status={booking.status} size="xs" />
            </div>
          </div>
        </div>

        {/* Handover OTP Notice if Confirmed */}
        {booking.handoverOtp && booking.status === 'CONFIRMED' && (
          <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <KeyRound className="w-5 h-5 text-brand-600" />
              <div>
                <h4 className="font-bold text-xs text-brand-900 dark:text-brand-200">
                  Vehicle Dispatch OTP: <span className="font-mono font-black text-base ml-1">{booking.handoverOtp}</span>
                </h4>
                <p className="text-[11px] text-brand-700 dark:text-brand-300/80">
                  Show this code to the fleet owner at the hub to start your trip.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Vehicle & Trip Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Rented Vehicle</span>
            <h4 className="font-heading font-extrabold text-base text-slate-900 dark:text-white">
              {v?.brand} {v?.model}
            </h4>
            <div className="text-xs text-slate-500 space-y-1">
              <p>Registration Number: <span className="font-mono font-bold uppercase text-slate-800 dark:text-slate-200">{v?.registrationNumber}</span></p>
              <p>Pickup Hub: {v?.location?.address ? `${v.location.address}, ` : ''}{v?.location?.city}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Schedule & Duration</span>
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <p><span className="text-slate-400">Pickup:</span> <strong>{new Date(booking.startDateTime).toLocaleString()}</strong></p>
              <p><span className="text-slate-400">Return:</span> <strong>{new Date(booking.endDateTime).toLocaleString()}</strong></p>
              <p><span className="text-slate-400">Rental Plan:</span> {booking.rentalPlan} ({booking.durationHours} Hours)</p>
            </div>
          </div>
        </div>

        {/* Itemized Price Breakdown */}
        <PriceBreakdownCard
          priceBreakdown={booking.priceBreakdown}
          rentalPlan={booking.rentalPlan}
          durationHours={booking.durationHours}
          appliedCoupon={booking.couponApplied}
        />

        {/* Cancellation details if cancelled */}
        {booking.status === 'CANCELLED' && booking.cancellationDetails && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs space-y-1 text-rose-800 dark:text-rose-300">
            <h4 className="font-bold">Reservation Cancelled</h4>
            <p>Reason: {booking.cancellationDetails.reason || 'Customer requested'}</p>
            <p>Refund Amount: ₹{booking.cancellationDetails.refundAmount} (Cancellation Fee: ₹{booking.cancellationDetails.cancellationFee})</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetailsPage;
