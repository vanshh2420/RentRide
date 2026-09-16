import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingApi } from '../../services/bookingApi';
import { ReviewModal } from '../../features/reviews/ReviewModal';
import { ActiveRentalDashboard } from '../../features/trips/ActiveRentalDashboard';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Car, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  ArrowRight, 
  FileText,
  IndianRupee,
  RotateCcw,
  Star,
  Navigation
} from 'lucide-react';

export const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingBookingId, setCancellingBookingId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [activeTrackingBookingId, setActiveTrackingBookingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await bookingApi.getMyBookings({ status: statusFilter });
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error('Error fetching bookings', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    if (!cancellingBookingId) return;

    setIsCancelling(true);
    try {
      await bookingApi.cancelBooking(cancellingBookingId, cancelReason);
      setCancellingBookingId(null);
      setCancelReason('');
      fetchBookings();
    } catch (err) {
      alert(err.message || 'Failed to cancel booking');
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200">Confirmed</span>;
      case 'ACTIVE':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-200">Ride In Progress</span>;
      case 'PENDING_PAYMENT':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200">Pending Payment</span>;
      case 'COMPLETED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">Completed</span>;
      case 'CANCELLED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 dark:bg-red-950/80 dark:text-red-300 border border-red-200">Cancelled</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900 dark:text-white">
            My Rental Bookings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track active rides, view invoices, or cancel upcoming reservations.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl self-start sm:self-auto overflow-x-auto">
          {['ALL', 'UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === tab
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs text-slate-500">Loading your bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass-panel p-16 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-subtle">
          <Calendar className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
            No Bookings Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don't have any bookings matching this status. Explore our verified fleet and plan your next trip!
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs shadow-md"
          >
            Explore Fleet <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="glass-panel p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-brand-500/40 transition-colors"
            >
              {/* Left Info */}
              <div className="flex items-start sm:items-center gap-4 w-full md:w-auto">
                <img
                  src={b.vehicleId?.images?.[0]?.url || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80'}
                  alt="Vehicle"
                  className="w-24 sm:w-28 aspect-[16/10] rounded-2xl object-cover"
                />

                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400">#{b.bookingNumber}</span>
                    {getStatusBadge(b.status)}
                  </div>

                  <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                    {b.vehicleId?.brand} {b.vehicleId?.model}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-600" />
                      {new Date(b.startDateTime).toLocaleDateString()} {new Date(b.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span>→</span>
                    <span>{new Date(b.endDateTime).toLocaleDateString()} {new Date(b.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
                      {b.durationHours}h ({b.rentalPlan})
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Fare & Action */}
              <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                <div className="text-left md:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Fare</span>
                  <span className="font-heading text-xl font-extrabold text-slate-900 dark:text-white">
                    ₹{b.priceBreakdown?.totalAmount}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    to={`/bookings/${b._id}`}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" /> Invoice
                  </Link>

                  {b.status === 'ACTIVE' && (
                    <button
                      type="button"
                      onClick={() => setActiveTrackingBookingId(b._id)}
                      className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 animate-pulse"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Live Ride Tracking
                    </button>
                  )}

                  {b.status === 'COMPLETED' && (
                    <button
                      type="button"
                      onClick={() => setReviewBooking(b)}
                      className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Write Review
                    </button>
                  )}

                  {b.status === 'CONFIRMED' && (
                    <button
                      type="button"
                      onClick={() => setCancellingBookingId(b._id)}
                      className="px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-bold transition-colors"
                    >
                      Cancel
                    </button>
                  )}

                  {b.status === 'PENDING_PAYMENT' && (
                    <Link
                      to={`/payment/${b._id}`}
                      className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm"
                    >
                      Pay Now
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={!!reviewBooking}
        onClose={() => setReviewBooking(null)}
        booking={reviewBooking}
        onSuccess={() => {
          fetchBookings();
        }}
      />

      {/* Cancel Booking Modal */}
      {cancellingBookingId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              Cancel Rental Reservation
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to cancel this booking? Full refund is provided if cancelled at least 4 hours before pickup.
            </p>

            <form onSubmit={handleCancelSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Reason for Cancellation
                </label>
                <textarea
                  rows="3"
                  placeholder="e.g. Change of plans, found alternate travel..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancellingBookingId(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                >
                  Keep Booking
                </button>
                <button
                  type="submit"
                  disabled={isCancelling}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md disabled:opacity-60"
                >
                  {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Ride Telemetry & Active Rental Dashboard */}
      {activeTrackingBookingId && (
        <ActiveRentalDashboard
          bookingId={activeTrackingBookingId}
          isOpen={!!activeTrackingBookingId}
          onClose={() => setActiveTrackingBookingId(null)}
          isVendor={false}
        />
      )}
    </div>
  );
};
