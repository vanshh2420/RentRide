import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { vehicleApi } from '../../services/vehicleApi';
import { bookingApi } from '../../services/bookingApi';
import { toLocalISOString, toApiISOString } from '../../utils/dateUtils';
import { PriceBreakdownCard } from '../../features/booking/PriceBreakdownCard';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  Tag, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  Lock, 
  Check, 
  User, 
  CreditCard,
  ChevronRight,
  Info
} from 'lucide-react';

export const CheckoutPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Form State
  const [vehicle, setVehicle] = useState(null);
  const [rentalPlan, setRentalPlan] = useState(searchParams.get('plan') || 'HOURLY');
  const [hours, setHours] = useState(Number(searchParams.get('hours')) || 3);
  
  // Set default start time 2 hours from current time in local timezone
  const defaultStartTime = toLocalISOString(new Date(Date.now() + 2 * 60 * 60 * 1000));
  const [startDateTime, setStartDateTime] = useState(searchParams.get('pickup') || defaultStartTime);
  const [endDateTime, setEndDateTime] = useState('');

  // Coupon state
  const [couponCode, setCouponCode] = useState('WELCOME100');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Calculation & Availability state
  const [priceData, setPriceData] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [availabilityReason, setAvailabilityReason] = useState('');
  const [isCheckingPrice, setIsCheckingPrice] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  useEffect(() => {
    computeEndDateTime();
  }, [startDateTime, rentalPlan, hours]);

  useEffect(() => {
    if (vehicle && startDateTime && endDateTime) {
      checkLiveAvailabilityAndPrice();
    }
  }, [vehicle, rentalPlan, startDateTime, endDateTime, appliedCoupon]);

  const fetchVehicle = async () => {
    try {
      const res = await vehicleApi.getVehicleById(id);
      setVehicle(res.data.vehicle);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load vehicle');
    }
  };

  const computeEndDateTime = () => {
    if (!startDateTime) return;
    const start = new Date(startDateTime);
    let durationHours = hours;

    if (rentalPlan === '12_HOURS') durationHours = 12;
    if (rentalPlan === '24_HOURS') durationHours = 24;

    const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
    setEndDateTime(toLocalISOString(end));
  };

  const checkLiveAvailabilityAndPrice = async () => {
    setIsCheckingPrice(true);
    setErrorMessage('');
    try {
      const payload = {
        vehicleId: id,
        rentalPlan,
        startDateTime: toApiISOString(startDateTime),
        endDateTime: toApiISOString(endDateTime),
        couponCode: appliedCoupon?.code || undefined
      };

      const res = await bookingApi.checkAvailability(payload);
      if (res.data.available) {
        setIsAvailable(true);
        setAvailabilityReason('');
        setPriceData(res.data.priceBreakdown);
        if (res.data.appliedCoupon) {
          setAppliedCoupon(res.data.appliedCoupon);
        }
      } else {
        setIsAvailable(false);
        setAvailabilityReason(res.data.reason || 'Vehicle is not available for this time slot');
      }
    } catch (err) {
      setIsAvailable(false);
      setAvailabilityReason(err.message || 'Availability check failed');
    } finally {
      setIsCheckingPrice(false);
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setAppliedCoupon({ code: couponCode.trim().toUpperCase() });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const handleCreateBooking = async () => {
    if (!isAvailable) {
      setErrorMessage('Selected time slot is unavailable. Please select another time.');
      return;
    }

    setIsBooking(true);
    setErrorMessage('');

    try {
      const payload = {
        vehicleId: id,
        rentalPlan,
        startDateTime: toApiISOString(startDateTime),
        endDateTime: toApiISOString(endDateTime),
        couponCode: appliedCoupon?.code || undefined
      };

      const response = await bookingApi.createOnlineBooking(payload);
      const booking = response.data.booking;

      // Navigate to Payment page with locked booking
      navigate(`/payment/${booking._id}`);
    } catch (err) {
      setErrorMessage(err.message || 'Booking reservation failed. Slot might have been booked by someone else.');
    } finally {
      setIsBooking(false);
    }
  };

  if (!vehicle) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Header */}
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-slate-900 dark:hover:text-white">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/explore" className="hover:text-slate-900 dark:hover:text-white">Fleet</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-bold">Checkout & Reserve</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Confirm & Lock Reservation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review rental schedule, driver credentials, and secure your 10-minute temporary inventory lock.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Instant Confirmation</span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-700 dark:text-red-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form & Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vehicle Showcase Card */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle flex flex-col sm:flex-row items-center gap-5">
            <div className="relative w-full sm:w-48 aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
              <img
                src={vehicle.images?.[0]?.url || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80'}
                alt={vehicle.model}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold">
                {vehicle.registrationNumber}
              </span>
            </div>

            <div className="space-y-1.5 flex-1 text-center sm:text-left">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200/60">
                {vehicle.categoryId?.name || 'Ride'}
              </span>
              <h2 className="font-heading font-black text-xl text-slate-900 dark:text-white">
                {vehicle.brand} {vehicle.model}
              </h2>
              <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-600" />
                <span>{vehicle.location?.address ? `${vehicle.location.address}, ` : ''}{vehicle.location?.city} Hub</span>
              </p>
            </div>
          </div>

          {/* Schedule & Duration Configuration Card */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-6">
            <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600" />
              <span>1. Rental Schedule & Duration Plan</span>
            </h3>

            {/* Plan selector buttons */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'HOURLY', label: 'Hourly Flexi', rate: `₹${vehicle.pricing.hourlyRate}/hr` },
                { id: '12_HOURS', label: '12-Hour Day Pack', rate: `₹${vehicle.pricing.rate12Hour}` },
                { id: '24_HOURS', label: '24-Hour Escape', rate: `₹${vehicle.pricing.rate24Hour}` }
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setRentalPlan(p.id)}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    rentalPlan === p.id
                      ? 'border-brand-600 bg-brand-50/70 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 shadow-xs scale-[1.02]'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold block">{p.label}</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white mt-0.5 block">{p.rate}</span>
                </button>
              ))}
            </div>

            {rentalPlan === 'HOURLY' && (
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Selected Duration:</span>
                  <span className="text-brand-600 font-extrabold">{hours} Hours</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="11"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer h-1.5"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>1 Hour</span>
                  <span>11 Hours</span>
                </div>
              </div>
            )}

            {/* Date Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Pickup Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Estimated Return Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={endDateTime}
                  readOnly
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Availability Alert */}
            {!isAvailable && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600" />
                <span>{availabilityReason}</span>
              </div>
            )}
          </div>

          {/* Rider Verification */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-4">
            <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-brand-600" />
              <span>2. Primary Driver Verification</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Driver Name</span>
                <p className="font-extrabold text-slate-900 dark:text-white">{user?.name}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Contact Mobile</span>
                <p className="font-extrabold text-slate-900 dark:text-white">{user?.phone || 'Verified Phone'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Bring your original physical driving license for verification during vehicle handover.</span>
            </div>
          </div>
        </div>

        {/* Right Col: Price Breakdown & Checkout Action */}
        <div className="space-y-6">
          {/* Coupon Code Input */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-accent-500" />
              <span>Apply Promotional Coupon</span>
            </h4>

            {appliedCoupon ? (
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <Check className="w-4 h-4" /> {appliedCoupon.code} Applied
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-xs font-bold text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. WELCOME100"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-extrabold uppercase focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-brand-600 text-white dark:bg-brand-600 dark:hover:bg-brand-500 rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  Apply
                </button>
              </form>
            )}
          </div>

          {/* Price Breakdown Component */}
          <PriceBreakdownCard
            priceBreakdown={priceData}
            rentalPlan={rentalPlan}
            durationHours={hours}
            appliedCoupon={appliedCoupon}
          />

          {/* Submit Action */}
          <button
            type="button"
            disabled={!isAvailable || isBooking || isCheckingPrice}
            onClick={handleCreateBooking}
            className="w-full py-4 px-6 rounded-2xl bg-slate-900 hover:bg-brand-600 text-white dark:bg-brand-600 dark:hover:bg-brand-500 font-extrabold text-sm shadow-md hover:shadow-hover transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isBooking ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Locking Inventory Slot...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Confirm & Proceed to Pay</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-slate-400">
            🔒 10-minute temporary inventory lock holds your slot during payment checkout.
          </p>
        </div>
      </div>
    </div>
  );
};
