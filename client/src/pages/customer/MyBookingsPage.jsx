import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingApi } from '../../services/bookingApi';
import { ReviewModal } from '../../features/reviews/ReviewModal';
import { ActiveRentalDashboard } from '../../features/trips/ActiveRentalDashboard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Tabs } from '../../components/ui/Tabs';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
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
  Navigation,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { getVehiclePrimaryImage } from '../../features/vehicles/utils/vehicleImageResolver';
import { cn } from '../../utils/cn';

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

  const filterTabs = [
    { id: 'ALL', label: 'All Trips' },
    { id: 'UPCOMING', label: 'Upcoming' },
    { id: 'ACTIVE', label: 'In Progress' },
    { id: 'COMPLETED', label: 'Completed' },
    { id: 'CANCELLED', label: 'Cancelled' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Breadcrumb Header */}
      <Breadcrumb
        items={[
          { label: 'Account Center', href: '/profile' },
          { label: 'My Rental Bookings' }
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-black text-slate-900 dark:text-white">
            My Rental Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track active rides, view tax invoices, or cancel upcoming reservations.
          </p>
        </div>

        {/* Status Filter Tabs (Guideline 21) */}
        <Tabs
          tabs={filterTabs}
          activeTab={statusFilter}
          onChange={(tab) => setStatusFilter(tab)}
        />
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400">Loading your reservations...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-4 shadow-subtle max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 flex items-center justify-center mx-auto shadow-xs">
            <Calendar className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
              No Bookings Found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              You don't have any bookings matching this category. Explore our verified fleet and plan your next journey!
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-all"
          >
            <span>Explore Fleet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-brand-500/40 dark:hover:border-brand-500/40 hover:shadow-card transition-all duration-200"
            >
              {/* Left Vehicle & Trip Info */}
              <div className="flex items-start sm:items-center gap-4 w-full md:w-auto">
                <div className="w-24 sm:w-28 aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center p-1.5 border border-slate-100 dark:border-slate-800">
                  <img
                    src={getVehiclePrimaryImage(b.vehicleId) || b.vehicleId?.images?.[0]?.url}
                    alt={`${b.vehicleId?.brand || ''} ${b.vehicleId?.model || 'Vehicle'}`}
                    className="w-full h-full object-contain filter drop-shadow-sm"
                  />
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-slate-400">#{b.bookingNumber}</span>
                    <StatusBadge status={b.status} size="xs" />
                  </div>

                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                    {b.vehicleId?.brand} {b.vehicleId?.model}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-brand-600" />
                      {new Date(b.startDateTime).toLocaleDateString()} {new Date(b.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span>→</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {new Date(b.endDateTime).toLocaleDateString()} {new Date(b.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
                      {b.durationHours}h ({b.rentalPlan})
                    </span>
                  </div>

                  {/* Show OTP if Confirmed/Active */}
                  {b.handoverOtp && b.status === 'CONFIRMED' && (
                    <div className="pt-1 flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 font-bold">
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Pickup OTP: <strong className="font-mono text-sm tracking-wider">{b.handoverOtp}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Fare & Contextual Actions */}
              <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-5 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                <div className="text-left md:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Fare</span>
                  <span className="font-heading text-xl font-black text-slate-900 dark:text-white">
                    ₹{b.priceBreakdown?.totalAmount}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    to={`/bookings/${b._id}`}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Receipt</span>
                  </Link>

                  {b.status === 'ACTIVE' && (
                    <button
                      type="button"
                      onClick={() => setActiveTrackingBookingId(b._id)}
                      className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 animate-pulse"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Live Track</span>
                    </button>
                  )}

                  {b.status === 'COMPLETED' && (
                    <button
                      type="button"
                      onClick={() => setReviewBooking(b)}
                      className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-bold transition-colors flex items-center gap-1 border border-amber-200/60 dark:border-amber-800/40"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>Review</span>
                    </button>
                  )}

                  {b.status === 'CONFIRMED' && (
                    <button
                      type="button"
                      onClick={() => setCancellingBookingId(b._id)}
                      className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold transition-colors"
                    >
                      Cancel
                    </button>
                  )}

                  {b.status === 'PENDING_PAYMENT' && (
                    <Link
                      to={`/payment/${b._id}`}
                      className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-sm"
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

      {/* Active Trip Live Dashboard Modal */}
      {activeTrackingBookingId && (
        <Modal
          isOpen={true}
          onClose={() => setActiveTrackingBookingId(null)}
          title="Live Trip Telemetry & Meter"
          subtitle="Real-time odometer, trip timeline, and emergency assistance"
          maxWidth="max-w-2xl"
        >
          <ActiveRentalDashboard
            bookingId={activeTrackingBookingId}
            onClose={() => setActiveTrackingBookingId(null)}
          />
        </Modal>
      )}

      {/* Cancel Booking Modal */}
      <Modal
        isOpen={!!cancellingBookingId}
        onClose={() => setCancellingBookingId(null)}
        title="Cancel Vehicle Reservation"
        subtitle="Please tell us why you are cancelling your reservation"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCancellingBookingId(null)}
              disabled={isCancelling}
            >
              Keep Booking
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleCancelSubmit}
              isLoading={isCancelling}
            >
              Confirm Cancellation
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cancellations made more than 4 hours before scheduled pickup receive a 100% refund of all base fares and security deposits.
          </p>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            rows={3}
            placeholder="Reason for cancellation (optional)..."
            className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>
      </Modal>

    </div>
  );
};

export default MyBookingsPage;
