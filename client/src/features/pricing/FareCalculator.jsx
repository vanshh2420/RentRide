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
  Check
} from 'lucide-react';

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

  if (!vehicle) return null;

  const allowedDailyKm = vehicle.mileageLimitPerDayKm || 250;
  const extraKmRate = vehicle.extraKmCharge || 10;

  return (
    <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-glass space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 block">
            Transparent Server-Side Fare Engine
          </span>
          <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            Automatic Fare Calculator
          </h3>
        </div>
        <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
          Zero Hidden Fees
        </span>
      </div>

      {/* Plan Selection Tabs */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase text-slate-500 block">
          Choose Rental Plan
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'HOURLY', label: 'Hourly', sub: `₹${vehicle.pricing?.hourlyRate}/h` },
            { id: '12_HOURS', label: '12-Hour Pass', sub: `₹${vehicle.pricing?.rate12Hour}` },
            { id: '24_HOURS', label: '24-Hour Day', sub: `₹${vehicle.pricing?.rate24Hour}` }
          ].map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => {
                setRentalPlan(plan.id);
                if (plan.id === '12_HOURS') setDurationHours(12);
                else if (plan.id === '24_HOURS') setDurationHours(24);
                else setDurationHours(3);
              }}
              className={`p-3 rounded-2xl text-center border transition-all ${
                rentalPlan === plan.id
                  ? 'bg-brand-600 text-white border-brand-600 shadow-md scale-[1.02]'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <div className="font-bold text-xs">{plan.label}</div>
              <div className="text-[11px] opacity-85 font-semibold mt-0.5">{plan.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Duration Adjuster (for Hourly) & Start Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
            Pickup Date & Time
          </label>
          <input
            type="datetime-local"
            value={startDateTime}
            onChange={(e) => setStartDateTime(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-medium"
          />
        </div>

        <div>
          <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
            Rental Duration ({durationHours} hours)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={rentalPlan === '12_HOURS' ? 12 : rentalPlan === '24_HOURS' ? 24 : 1}
              max={rentalPlan === '24_HOURS' ? 168 : rentalPlan === '12_HOURS' ? 72 : 24}
              step={rentalPlan === '24_HOURS' ? 24 : rentalPlan === '12_HOURS' ? 12 : 1}
              value={durationHours}
              onChange={(e) => setDurationHours(Number(e.target.value))}
              className="flex-1 accent-brand-600 cursor-pointer"
            />
            <span className="font-mono font-bold text-slate-900 dark:text-white min-w-[3rem] text-right">
              {durationHours} hrs
            </span>
          </div>
        </div>
      </div>

      {/* Itemized Fare Output (From Authoritative Pricing Engine) */}
      {priceData && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Base Rental ({durationHours} hours)</span>
            <span className="font-semibold text-slate-900 dark:text-white">₹{priceData.basePrice}</span>
          </div>

          {priceData.surgeMultiplier > 1.0 && (
            <div className="flex justify-between text-amber-600 dark:text-amber-400 font-medium">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3" /> Weekend Dynamic Surge ({Math.round((priceData.surgeMultiplier - 1) * 100)}%)
              </span>
              <span>+₹{Math.round(priceData.basePrice * (priceData.surgeMultiplier - 1))}</span>
            </div>
          )}

          {priceData.couponDiscount > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
              <span>Coupon Discount</span>
              <span>-₹{priceData.couponDiscount}</span>
            </div>
          )}

          <div className="flex justify-between text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-700">
            <span>Platform Fee (5%) + GST (18%)</span>
            <span>₹{priceData.platformFee + priceData.taxAmount}</span>
          </div>

          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Refundable Security Deposit
            </span>
            <span className="font-bold text-slate-900 dark:text-white">₹{priceData.securityDeposit}</span>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase text-slate-400 block">Total Payable</span>
              <span className="text-[10px] text-slate-400">Includes refundable security deposit</span>
            </div>
            <div className="font-heading text-xl font-extrabold text-brand-600 dark:text-brand-400">
              ₹{priceData.totalAmount}
            </div>
          </div>
        </div>
      )}

      {/* Mileage Allowance Info */}
      <div className="p-3 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-[11px] text-sky-900 dark:text-sky-200 flex items-start gap-2.5">
        <Gauge className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold">Kilometer Allowance: </strong>
          Includes <strong>{allowedDailyKm} km/day</strong>. Additional distance is charged at ₹{extraKmRate}/extra km calculated from final odometer readings at return.
        </div>
      </div>

      {/* Estimated Trip Fuel / Energy Cost Calculator */}
      <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 dark:text-amber-200">
            <Fuel className="w-4 h-4 text-amber-600" />
            <span>Estimated Trip Fuel Cost</span>
          </div>
          <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">
            Estimate Only
          </span>
        </div>

        <div className="space-y-1 text-xs">
          <div className="flex justify-between text-slate-600 dark:text-slate-300 text-[11px]">
            <span>Planned Travel Distance</span>
            <span className="font-bold text-slate-900 dark:text-white">{projectedDistanceKm} km</span>
          </div>
          <input
            type="range"
            min={10}
            max={500}
            step={10}
            value={projectedDistanceKm}
            onChange={(e) => setProjectedDistanceKm(Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer h-1.5"
          />
        </div>

        {fuelEstimate && fuelEstimate.isAvailable ? (
          <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
            <div className="p-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-100 dark:border-amber-900/50">
              <span className="text-[10px] text-slate-400 block">Est. Consumption</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {fuelEstimate.estimatedConsumption} {fuelEstimate.consumptionUnit}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-100 dark:border-amber-900/50">
              <span className="text-[10px] text-slate-400 block">Est. Fuel Cost</span>
              <span className="font-bold text-amber-700 dark:text-amber-300">
                ₹{fuelEstimate.estimatedCost}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-[11px] text-slate-500 italic">
            Fuel economy for this vehicle: {vehicle.fuelEconomy ? `${vehicle.fuelEconomy} ${vehicle.fuelEconomyUnit}` : 'Not specified'}
          </p>
        )}
      </div>

      {/* CTA Button */}
      <button
        type="button"
        onClick={handleBookNow}
        disabled={isLoading}
        className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 text-white font-heading font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
      >
        <span>Proceed to Reserve ({rentalPlan})</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
