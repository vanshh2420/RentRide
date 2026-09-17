import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingApi } from '../../services/bookingApi';
import { fuelPriceApi } from '../../services/fuelPriceApi';
import { toLocalISOString, toApiISOString } from '../../utils/dateUtils';
import { 
  IndianRupee, 
  Calendar, 
  Clock, 
  Tag, 
  ShieldCheck, 
  Zap, 
  Fuel, 
  Gauge, 
  ArrowRight,
  Info,
  Check,
  CheckCircle2,
  Sparkles,
  Lock
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const FareCalculator = ({ vehicle, onProceed }) => {
  const navigate = useNavigate();

  // Calculation parameters
  const [rentalPlan, setRentalPlan] = useState('HOURLY');
  const [durationHours, setDurationHours] = useState(3);
  const [couponCode, setCouponCode] = useState('');
  const [projectedDistanceKm, setProjectedDistanceKm] = useState(60);

  // Server response states
  const [priceData, setPriceData] = useState(null);
  const [fuelEstimate, setFuelEstimate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Start date (default 2 hours from now in local timezone)
  const [startDateTime, setStartDateTime] = useState(() =>
    toLocalISOString(new Date(Date.now() + 2 * 60 * 60 * 1000))
  );

  useEffect(() => {
    if (vehicle) {
      calculateAuthoritativeFare();
    }
  }, [vehicle, rentalPlan, durationHours, couponCode, startDateTime]);

  useEffect(() => {
    if (vehicle && projectedDistanceKm > 0) {
      fetchFuelEstimate();
    }
  }, [vehicle, projectedDistanceKm]);

  const calculateAuthoritativeFare = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const start = new Date(startDateTime);
      let hoursToAdd = durationHours;
      if (rentalPlan === '12_HOURS') hoursToAdd = Math.max(12, durationHours);
      if (rentalPlan === '24_HOURS') hoursToAdd = Math.max(24, durationHours);

      const end = new Date(start.getTime() + hoursToAdd * 60 * 60 * 1000);

      // Single authoritative server-side calculation
      const res = await bookingApi.checkAvailability({
        vehicleId: vehicle._id,
        rentalPlan,
        startDateTime: toApiISOString(startDateTime),
        endDateTime: end.toISOString(),
        couponCode: couponCode.trim() || undefined
      });

      setPriceData(res.data?.priceBreakdown);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to calculate fare');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFuelEstimate = async () => {
    try {
      const res = await fuelPriceApi.estimateFuelCost({
        distanceKm: projectedDistanceKm,
        fuelType: vehicle.fuelType,
        fuelEconomy: vehicle.fuelEconomy,
        fuelEconomyUnit: vehicle.fuelEconomyUnit,
        city: vehicle.location?.city || 'Indore'
      });
      setFuelEstimate(res.data?.estimate);
    } catch (err) {
      console.warn('Fuel estimate query failed:', err.message);
    }
  };

  const handleBookNow = () => {
    if (onProceed) {
      onProceed(rentalPlan, durationHours, startDateTime);
    } else {
      navigate(
        `/checkout/${vehicle._id}?plan=${rentalPlan}&hours=${durationHours}&pickup=${encodeURIComponent(startDateTime)}`
      );
    }
  };

  const planCards = [
    {
      id: 'HOURLY',
      name: 'Flexi Hourly',
      desc: 'Pay per hour',
      price: `₹${vehicle.pricing?.hourlyRate}/hr`,
      savings: null
    },
    {
      id: '12_HOURS',
      name: '12 Hours',
      desc: 'Day pass',
      price: `₹${vehicle.pricing?.rate12Hour}`,
      savings: 'Save ~10%'
    },
    {
      id: '24_HOURS',
      name: '24 Hours',
      desc: 'Full day + night',
      price: `₹${vehicle.pricing?.rate24Hour}`,
      savings: 'Save 15%'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Direct Booking</span>
          <h3 className="font-heading font-black text-xl text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>Rental Plan</span>
          </h3>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Starting At</span>
          <div className="flex items-baseline gap-0.5 justify-end">
            <span className="font-heading font-black text-2xl text-slate-900 dark:text-white">
              ₹{vehicle.pricing?.hourlyRate}
            </span>
            <span className="text-xs text-slate-500 font-medium">/hr</span>
          </div>
        </div>
      </div>

      {/* 1. Rental Plan Selector Cards (Guideline 17) */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Select Rental Duration Plan
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {planCards.map((p) => {
            const isSelected = rentalPlan === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setRentalPlan(p.id)}
                className={cn(
                  "p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between",
                  isSelected
                    ? "border-brand-600 bg-brand-50/60 dark:bg-brand-950/40 ring-2 ring-brand-500/20 shadow-xs"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-300"
                )}
              >
                {p.savings && (
                  <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider shadow-xs">
                    {p.savings}
                  </span>
                )}
                <div>
                  <h4 className={cn("text-xs font-extrabold", isSelected ? "text-brand-600 dark:text-brand-400" : "text-slate-800 dark:text-slate-200")}>
                    {p.name}
                  </h4>
                  <p className="text-[10px] text-slate-400">{p.desc}</p>
                </div>
                <p className="font-heading font-black text-sm text-slate-900 dark:text-white mt-2">
                  {p.price}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Pickup Date & Time */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Pickup Schedule
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

      {/* 3. Duration Selector (If Hourly) */}
      {rentalPlan === 'HOURLY' && (
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Hours Needed
            </span>
            <span className="font-extrabold text-brand-600 dark:text-brand-400">
              {durationHours} Hours
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[2, 3, 4, 6, 8, 10].map((hr) => (
              <button
                key={hr}
                type="button"
                onClick={() => setDurationHours(hr)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0",
                  durationHours === hr
                    ? "bg-brand-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                )}
              >
                {hr}h
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Live Fare Breakdown */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/80 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-200/60 dark:border-slate-800">
          <span>Fare Estimation</span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 lowercase">GST & Deposit itemized</span>
        </div>

        {isLoading ? (
          <div className="py-4 text-center space-y-2">
            <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <span className="text-xs text-slate-400">Verifying live rates...</span>
          </div>
        ) : priceData ? (
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Base Rental ({priceData.billableHours || durationHours} hrs)</span>
              <span className="font-semibold text-slate-900 dark:text-white">₹{priceData.basePrice}</span>
            </div>

            {priceData.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                <span>Coupon Applied</span>
                <span>-₹{priceData.discountAmount}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Platform Service Fee</span>
              <span className="font-semibold text-slate-900 dark:text-white">₹{priceData.platformFee}</span>
            </div>

            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Taxes (GST 18%)</span>
              <span className="font-semibold text-slate-900 dark:text-white">₹{priceData.gstAmount}</span>
            </div>

            <div className="flex justify-between text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-800">
              <span>Refundable Security Deposit</span>
              <span className="font-semibold text-slate-900 dark:text-white">₹{priceData.securityDeposit}</span>
            </div>

            <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 dark:border-slate-700 text-sm">
              <span className="font-extrabold text-slate-900 dark:text-white">Total Estimated Payable</span>
              <span className="font-heading font-black text-xl text-slate-900 dark:text-white">
                ₹{priceData.totalPayable}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-2 text-xs text-slate-400">
            {errorMessage || 'Select schedule to view authoritative total'}
          </div>
        )}
      </div>

      {/* 5. Fuel Cost Estimator Accordion */}
      {fuelEstimate && (
        <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 font-bold">
            <span className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5" />
              <span>Est. Fuel Cost ({projectedDistanceKm} km)</span>
            </span>
            <span>₹{fuelEstimate.estimatedCost}</span>
          </div>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
            Live fuel rate at ₹{fuelEstimate.fuelPricePerUnit}/L ({vehicle.fuelEconomy} km/l ARAI rating).
          </p>
        </div>
      )}

      {/* CTA Button */}
      <button
        type="button"
        onClick={handleBookNow}
        disabled={isLoading}
        className="w-full py-4 px-6 rounded-2xl bg-brand-600 hover:bg-brand-500 active:scale-[0.99] text-white font-extrabold text-sm shadow-md hover:shadow-hover transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Lock className="w-4 h-4" />
        <span>Reserve Vehicle</span>
        <ArrowRight className="w-4 h-4 ml-1" />
      </button>

      {/* Guarantees */}
      <div className="space-y-1.5 pt-1 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
          <span>10-Minute Instant Lock: No other customer can book this slot</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
          <span>Commercial Insurance & Verified Dispatch Hub</span>
        </div>
      </div>

    </div>
  );
};

export default FareCalculator;
