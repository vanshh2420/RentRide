import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { vehicleApi } from '../../services/vehicleApi';
import { bookingApi } from '../../services/bookingApi';
import { toLocalISOString, toApiISOString } from '../../utils/dateUtils';
import { PriceBreakdownCard } from '../../features/booking/PriceBreakdownCard';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
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
  Info,
  CheckCircle2,
  Zap,
  Sparkles
} from 'lucide-react';
import { getVehiclePrimaryImage } from '../../features/vehicles/utils/vehicleImageResolver';
import { cn } from '../../utils/cn';

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
  const [vehicleLoading, setVehicleLoading] = useState(true);
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
    setVehicleLoading(true);
    try {
      const res = await vehicleApi.getVehicleById(id);
      setVehicle(res.data.vehicle);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to load vehicle');
    } finally {
      setVehicleLoading(false);
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

  if (vehicleLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
          <Car className="w-7 h-7" />
        </div>
        <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">Vehicle Not Available</h2>
        <p className="text-sm text-slate-500">{errorMessage || 'Unable to load vehicle details for checkout.'}</p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={fetchVehicle}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            Try Again
          </button>
          <Link to="/explore" className="inline-flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-sm">
            <span>Back to Fleet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Header */}
      <Breadcrumb
        items={[
          { label: 'Explore Fleet', href: '/explore' },
          { label: `${vehicle.brand} ${vehicle.model}`, href: `/vehicles/${vehicle._id}` },
          { label: 'Checkout & Reserve' }
        ]}
      />

      {/* Progress Flow Steps Header (Guideline 18) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle">
        <div className="flex items-center justify-between max-w-2xl mx-auto text-xs">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
            <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-xs font-bold">
              ✓
            </div>
            <span>1. Vehicle</span>
          </div>
          <div className="h-0.5 w-8 sm:w-16 bg-emerald-500 rounded-full" />
          
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold">
            <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-950 flex items-center justify-center text-xs font-bold">
              2
            </div>
            <span>2. Schedule & Plan</span>
          </div>
          <div className="h-0.5 w-8 sm:w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />

          <div className="flex items-center gap-2 text-slate-400 font-medium">
            <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold">
              3
            </div>
            <span>3. Payment</span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 2-Column Desktop Layout (Guideline 19) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (7 cols): Vehicle, Schedule, Driver Details, Coupon */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          
          {/* Vehicle Showcase Card */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle flex flex-col sm:flex-row items-center gap-5">
            <div className="relative w-full sm:w-48 aspect-[16/10] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 flex-shrink-0 flex items-center justify-center p-2 border border-slate-100 dark:border-slate-800">
              <img
                src={getVehiclePrimaryImage(vehicle) || vehicle.images?.[0]?.url}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-full object-contain filter drop-shadow-sm"
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
              <span>Rental Schedule & Duration Plan</span>
            </h3>

            {/* Plan selector buttons */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'HOURLY', label: 'Hourly Flexi', rate: `₹${vehicle.pricing?.hourlyRate}/hr` },
                { id: '12_HOURS', label: '12-Hour Day Pack', rate: `₹${vehicle.pricing?.rate12Hour}` },
                { id: '24_HOURS', label: '24-Hour Escape', rate: `₹${vehicle.pricing?.rate24Hour}` }
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setRentalPlan(p.id)}
                  className={cn(
                    "p-3.5 rounded-2xl border text-center transition-all",
                    rentalPlan === p.id
                      ? "border-brand-600 bg-brand-50/60 dark:bg-brand-950/40 ring-2 ring-brand-500/20 text-brand-600 dark:text-brand-400 font-extrabold shadow-xs"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400 font-medium"
                  )}
                >
                  <div className="text-xs">{p.label}</div>
                  <div className="font-heading font-black text-sm text-slate-900 dark:text-white mt-1">
                    {p.rate}
                  </div>
                </button>
              ))}
            </div>

            {/* Dates & Hours Config */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Pickup Date & Time
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="datetime-local"
                    value={startDateTime}
                    onChange={(e) => setStartDateTime(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              {rentalPlan === 'HOURLY' ? (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Rental Duration (Hours)
                  </label>
                  <select
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h) => (
                      <option key={h} value={h}>
                        {h} {h === 1 ? 'Hour' : 'Hours'}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Estimated Return Time
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      disabled
                      value={endDateTime ? new Date(endDateTime).toLocaleString() : ''}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400 cursor-not-allowed"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Live slot lock availability pill */}
            <div className="pt-2">
              {isCheckingPrice ? (
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                  <span>Checking interval availability...</span>
                </div>
              ) : isAvailable ? (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Selected Slot is 100% Available & Ready for Instant Lock</span>
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white uppercase tracking-wider">
                    Conflict-Free
                  </span>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{availabilityReason}</span>
                </div>
              )}
            </div>
          </div>

          {/* Driver & KYC Credentials Card */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-4">
            <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-brand-600" />
              <span>2. Driver & KYC Verification</span>
            </h3>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Registered Renter</span>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{user?.name}</h4>
                <p className="text-slate-500">{user?.email} • {user?.phone || 'Contact verified'}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>KYC Pre-Approved</span>
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Please bring your original physical Driving Licence & Aadhaar/Passport at the pickup hub for rapid 60-second handover.
            </p>
          </div>

          {/* Coupon Code Section */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-4">
            <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-brand-600" />
              <span>3. Apply Coupon & Promo Code</span>
            </h3>

            {appliedCoupon ? (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 font-bold">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  <span>Coupon <strong>{appliedCoupon.code}</strong> Applied Successfully!</span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code (e.g. WELCOME100)..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white uppercase placeholder:normal-case placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs shadow-sm transition-all"
                >
                  Apply
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Right Column (5 cols): Authoritative Breakdown & Lock Confirmation */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <div className="sticky top-24 space-y-6">
            <PriceBreakdownCard
              priceBreakdown={priceData}
              rentalPlan={rentalPlan}
              durationHours={hours}
              appliedCoupon={appliedCoupon}
            />

            {/* Lock & Reserve Action */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleCreateBooking}
                disabled={!isAvailable || isBooking || isCheckingPrice}
                className="w-full py-4 px-6 rounded-2xl bg-brand-600 hover:bg-brand-500 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm shadow-md hover:shadow-hover transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isBooking ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Locking Slot & Securing Vehicle...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Secure Slot & Proceed to Pay</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-400">
                🔒 You will have 10 minutes to complete payment via Razorpay.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
