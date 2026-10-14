import React, { useState, useEffect, useMemo } from 'react';
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
  const [projectedDistanceKm, setProjectedDistanceKm] = useState(150);

  // Server response states
  const [priceData, setPriceData] = useState(null);
  const [fuelEstimate, setFuelEstimate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Start date (default 2 hours from now in local timezone)
  const [startDateTime, setStartDateTime] = useState(() =>
    toLocalISOString(new Date(Date.now() + 2 * 60 * 60 * 1000))
  );

  const getHourlyDurationError = (val) => {
    if (val === '' || val === null || val === undefined) {
      return 'Please enter the number of hours';
    }
    const num = Number(val);
    if (isNaN(num)) {
      return 'Please enter a valid numeric value';
    }
    if (!Number.isInteger(num)) {
      return 'Please enter whole hours (no decimals)';
    }
    if (num < 1) {
      return 'Duration must be at least 1 hour';
    }
    if (num > 24) {
      return 'Maximum hourly rental duration is 24 hours';
    }
    return '';
  };

  const hourlyError = rentalPlan === 'HOURLY' ? getHourlyDurationError(durationHours) : '';

  useEffect(() => {
    if (vehicle) {
      calculateAuthoritativeFare();
    }
  }, [vehicle, rentalPlan, durationHours, couponCode, startDateTime]);

  useEffect(() => {
    if (!vehicle) return;
    const num = Number(projectedDistanceKm);
    const validDist = !isNaN(num) && num >= 0 ? num : 0;
    const timer = setTimeout(() => {
      fetchFuelEstimate(validDist);
    }, 250);
    return () => clearTimeout(timer);
  }, [vehicle, projectedDistanceKm]);

  const handlePlanChange = (planId) => {
    setRentalPlan(planId);
    if (planId === '12_HOURS') {
      setDurationHours(12);
    } else if (planId === '24_HOURS') {
      setDurationHours(24);
    } else if (planId === 'HOURLY') {
      setDurationHours((prev) => (prev === 12 || prev === 24 ? 3 : (prev || 3)));
    }
  };

  const handleHourlyInputChange = (rawVal) => {
    if (rawVal === '') {
      setDurationHours('');
      return;
    }
    const parsed = Number(rawVal);
    if (isNaN(parsed)) {
      setDurationHours(rawVal);
    } else if (!Number.isInteger(parsed)) {
      setDurationHours(parsed);
    } else {
      setDurationHours(parseInt(rawVal, 10));
    }
  };

  const calculateAuthoritativeFare = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const start = new Date(startDateTime);
      let hoursToAdd = Number(durationHours);
      if (rentalPlan === '12_HOURS') hoursToAdd = 12;
      if (rentalPlan === '24_HOURS') hoursToAdd = 24;

      if (rentalPlan === 'HOURLY') {
        const error = getHourlyDurationError(durationHours);
        if (error) {
          setPriceData(null);
          setIsLoading(false);
          return;
        }
      }

      const end = new Date(start.getTime() + hoursToAdd * 60 * 60 * 1000);

      // Single authoritative server-side calculation
      const res = await bookingApi.checkAvailability({
        vehicleId: vehicle._id,
        rentalPlan,
        duration: hoursToAdd,
        durationHours: hoursToAdd,
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

  const handleDistanceChange = (rawVal) => {
    if (rawVal === '') {
      setProjectedDistanceKm('');
      return;
    }
    if (rawVal.includes('-')) {
      return;
    }
    const num = Number(rawVal);
    if (isNaN(num) || num < 0) {
      return;
    }
    setProjectedDistanceKm(rawVal);
  };

  const activeFuelPrice = fuelEstimate?.fuelPricePerUnit || (
    vehicle?.fuelType === 'diesel' ? 93.92 :
    vehicle?.fuelType === 'cng' ? 86.50 :
    vehicle?.fuelType === 'electric' ? 8.50 :
    108.66
  );

  const fuelCalculation = useMemo(() => {
    if (!vehicle) return { status: 'NO_VEHICLE' };

    const validEconomy = Number(vehicle.fuelEconomy);
    if (!validEconomy || validEconomy <= 0) {
      return { status: 'NO_ECONOMY' };
    }

    if (projectedDistanceKm === '' || projectedDistanceKm === null || projectedDistanceKm === undefined) {
      return { status: 'EMPTY' };
    }

    const distNum = Number(projectedDistanceKm);
    if (isNaN(distNum) || distNum < 0) {
      return { status: 'INVALID' };
    }

    const normalizedFuel = (vehicle.fuelType || 'petrol').toLowerCase();
    const isElectric = normalizedFuel === 'electric';
    const isCng = normalizedFuel === 'cng';

    let consumptionUnit = isElectric ? 'kWh' : isCng ? 'kg' : 'L';
    let consumption = 0;

    if (isElectric) {
      if (vehicle.fuelEconomyUnit === 'km/kWh') {
        consumption = distNum / validEconomy;
      } else {
        const avgKwhPerCharge = validEconomy > 100 ? 30 : 2.5;
        const kwhPerKm = avgKwhPerCharge / validEconomy;
        consumption = distNum * kwhPerKm;
      }
    } else {
      consumption = distNum / validEconomy;
    }

    const cost = Math.round(consumption * activeFuelPrice);
    const formattedConsumption = distNum === 0 ? '0' : (Math.round(consumption * 100) / 100).toFixed(2);

    return {
      status: 'READY',
      distanceKm: distNum,
      estimatedConsumption: formattedConsumption,
      consumptionUnit,
      estimatedCost: cost,
      fuelPricePerUnit: activeFuelPrice,
      isElectric,
      fuelType: normalizedFuel
    };
  }, [vehicle, projectedDistanceKm, activeFuelPrice]);

  const fetchFuelEstimate = async (distanceToEstimate = projectedDistanceKm) => {
    if (!vehicle) return;
    try {
      const numDist = Number(distanceToEstimate);
      const res = await fuelPriceApi.estimateFuelCost({
        distanceKm: !isNaN(numDist) && numDist >= 0 ? numDist : 0,
        fuelType: vehicle.fuelType,
        fuelEconomy: vehicle.fuelEconomy,
        fuelEconomyUnit: vehicle.fuelEconomyUnit,
        city: vehicle.location?.city || 'Indore'
      });
      if (res.data?.estimate) {
        setFuelEstimate(res.data.estimate);
      }
    } catch (err) {
      console.warn('Fuel estimate query failed:', err.message);
    }
  };

  const handleBookNow = () => {
    const effectiveHours = rentalPlan === '12_HOURS' ? 12 : rentalPlan === '24_HOURS' ? 24 : Number(durationHours);
    if (rentalPlan === 'HOURLY' && getHourlyDurationError(durationHours)) {
      return;
    }
    if (onProceed) {
      onProceed(rentalPlan, effectiveHours, startDateTime);
    } else {
      navigate(
        `/checkout/${vehicle._id}?plan=${rentalPlan}&hours=${effectiveHours}&pickup=${encodeURIComponent(startDateTime)}`
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
                onClick={() => handlePlanChange(p.id)}
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

      {/* 3. Duration Selector */}
      {rentalPlan === 'HOURLY' && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <label htmlFor="fc-duration-hours" className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Number of hours
            </label>
            {hourlyError ? (
              <span className="text-[11px] font-bold text-rose-500">{hourlyError}</span>
            ) : (
              <span className="font-extrabold text-brand-600 dark:text-brand-400">
                {durationHours} {Number(durationHours) === 1 ? 'Hour' : 'Hours'}
              </span>
            )}
          </div>
          <div className="relative">
            <input
              id="fc-duration-hours"
              type="number"
              min="1"
              max="24"
              step="1"
              value={durationHours}
              onChange={(e) => handleHourlyInputChange(e.target.value)}
              placeholder="Enter hours (e.g. 6)"
              className={cn(
                "w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all",
                hourlyError
                  ? "border-rose-500 ring-1 ring-rose-500/20"
                  : "border-slate-200 dark:border-slate-700"
              )}
            />
            <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400 pointer-events-none">
              hours
            </span>
          </div>

          {/* Quick select options */}
          <div className="space-y-1 pt-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Quick select:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {[1, 2, 4, 6, 8, 12].map((quickHr) => {
                const isSelected = Number(durationHours) === quickHr;
                return (
                  <button
                    key={quickHr}
                    type="button"
                    onClick={() => handleHourlyInputChange(quickHr)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                      isSelected
                        ? "bg-brand-600 text-white shadow-xs ring-2 ring-brand-500/30"
                        : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300"
                    )}
                  >
                    {quickHr} {quickHr === 1 ? 'hr' : 'hrs'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {rentalPlan === '12_HOURS' && (
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Duration
            </span>
            <span className="font-extrabold text-amber-600 dark:text-amber-400">
              Fixed Plan
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" /> 12-Hour Day Pack
            </span>
            <span className="font-heading font-black text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-200/60 dark:border-amber-800/50">
              12 hours
            </span>
          </div>
        </div>
      )}

      {rentalPlan === '24_HOURS' && (
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Duration
            </span>
            <span className="font-extrabold text-purple-600 dark:text-purple-400">
              Fixed Plan
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-purple-500" /> 24-Hour Escape
            </span>
            <span className="font-heading font-black text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-200/60 dark:border-purple-800/50">
              24 hours
            </span>
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
          (() => {
            const effectiveMultiplier = priceData.dynamicMultiplier || priceData.surgeMultiplier || 1.0;
            const effectiveAdjustment = priceData.dynamicAdjustment !== undefined
              ? priceData.dynamicAdjustment
              : Math.round(priceData.basePrice * (effectiveMultiplier - 1));
            const discount = priceData.couponDiscount !== undefined ? priceData.couponDiscount : (priceData.discountAmount || 0);
            const tax = priceData.taxAmount !== undefined ? priceData.taxAmount : (priceData.gstAmount || 0);
            const total = priceData.totalAmount !== undefined ? priceData.totalAmount : (priceData.totalPayable || 0);
            const factors = priceData.appliedFactors || [];

            return (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Base Rental ({priceData.billableHours || durationHours} hrs)</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹{priceData.basePrice}</span>
                </div>

                {/* Dynamic Value Saver Discount (0.90x - 0.99x) */}
                {effectiveMultiplier < 1.0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50/60 dark:bg-emerald-950/30 p-2 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{factors.length > 0 ? factors.join(' • ') : `Value Saver Discount (${Math.round((1 - effectiveMultiplier) * 100)}% off)`}</span>
                    </span>
                    <span className="font-bold">-₹{Math.abs(effectiveAdjustment)}</span>
                  </div>
                )}

                {/* Dynamic Surge (1.01x - 1.35x) */}
                {effectiveMultiplier > 1.0 && (
                  <div className="flex justify-between text-amber-600 dark:text-amber-400 font-semibold bg-amber-50/50 dark:bg-amber-950/30 p-2 rounded-xl border border-amber-200/50 dark:border-amber-800/30">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>{factors.length > 0 ? factors.join(' • ') : `Demand Surge (+${Math.round((effectiveMultiplier - 1) * 100)}%)`}</span>
                    </span>
                    <span className="font-bold">+₹{Math.abs(effectiveAdjustment)}</span>
                  </div>
                )}

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800/40">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Coupon Applied</span>
                    </span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Platform Service Fee</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹{priceData.platformFee}</span>
                </div>

                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Taxes (GST 18%)</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹{tax}</span>
                </div>

                <div className="flex justify-between text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-800">
                  <span>Refundable Security Deposit</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹{priceData.securityDeposit}</span>
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 dark:border-slate-700 text-sm">
                  <span className="font-extrabold text-slate-900 dark:text-white">Total Estimated Payable</span>
                  <span className="font-heading font-black text-xl text-slate-900 dark:text-white">
                    ₹{total}
                  </span>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="text-center py-2 text-xs text-slate-400">
            {errorMessage || 'Select schedule to view authoritative total'}
          </div>
        )}
      </div>

      {/* 5. Estimated Fuel Cost Section */}
      <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-xs space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5 text-xs">
            <Fuel className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Estimated {fuelCalculation.isElectric ? 'Energy' : 'Fuel'} Cost</span>
          </span>
          {activeFuelPrice > 0 && (
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-900/60 px-2 py-0.5 rounded-lg border border-emerald-200/80 dark:border-emerald-700/60">
              ₹{activeFuelPrice}/{fuelCalculation.consumptionUnit || 'L'}
            </span>
          )}
        </div>

        {/* Enter estimated distance */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[11px]">
            <label htmlFor="fc-fuel-distance" className="font-bold uppercase tracking-wider text-emerald-800/90 dark:text-emerald-300/90">
              Enter estimated distance
            </label>
            {projectedDistanceKm !== '' && !isNaN(Number(projectedDistanceKm)) && Number(projectedDistanceKm) >= 0 && (
              <span className="font-extrabold text-emerald-700 dark:text-emerald-300">
                {Number(projectedDistanceKm)} km
              </span>
            )}
          </div>
          <div className="relative">
            <input
              id="fc-fuel-distance"
              type="number"
              min="0"
              step="any"
              value={projectedDistanceKm}
              onChange={(e) => handleDistanceChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                  e.preventDefault();
                }
              }}
              placeholder="Enter distance (e.g. 150)"
              className="w-full pl-3.5 pr-12 py-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/70 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all shadow-2xs"
            />
            <span className="absolute right-3.5 top-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 pointer-events-none">
              km
            </span>
          </div>

          {/* Quick Select Shortcut Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[10px] font-bold text-emerald-700/70 dark:text-emerald-400/70">
              Quick:
            </span>
            {[50, 100, 150, 200].map((quickKm) => {
              const isSelected = Number(projectedDistanceKm) === quickKm && projectedDistanceKm !== '';
              return (
                <button
                  key={quickKm}
                  type="button"
                  onClick={() => handleDistanceChange(quickKm.toString())}
                  className={cn(
                    "px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-all",
                    isSelected
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-emerald-100/70 hover:bg-emerald-200/70 dark:bg-emerald-900/40 dark:hover:bg-emerald-800/40 text-emerald-800 dark:text-emerald-300"
                  )}
                >
                  {quickKm} km
                </button>
              );
            })}
          </div>
        </div>

        {/* Calculation Output States */}
        {fuelCalculation.status === 'EMPTY' && (
          <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/50 text-[11px] text-emerald-700/90 dark:text-emerald-400/90 italic">
            Enter a distance to calculate estimated fuel cost.
          </div>
        )}

        {fuelCalculation.status === 'NO_ECONOMY' && (
          <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/50 text-[11px] text-amber-700 dark:text-amber-400">
            Mileage data not available for this vehicle.
          </div>
        )}

        {fuelCalculation.status === 'READY' && (
          <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/50 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
              <span>Estimated {fuelCalculation.isElectric ? 'energy' : 'fuel'} required:</span>
              <span className="font-bold text-emerald-950 dark:text-emerald-100">
                {fuelCalculation.estimatedConsumption} {fuelCalculation.consumptionUnit}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-800 dark:text-emerald-300">
                {fuelCalculation.isElectric ? 'Energy' : 'Fuel'} cost:
              </span>
              <span className="font-heading font-black text-sm text-emerald-950 dark:text-emerald-100">
                ₹{fuelCalculation.estimatedCost}
              </span>
            </div>
            {vehicle?.fuelEconomy && (
              <p className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80 pt-0.5">
                Based on {vehicle.fuelEconomy} {vehicle.fuelEconomyUnit || 'km/l'} • ₹{activeFuelPrice}/{fuelCalculation.consumptionUnit} in {vehicle.location?.city || 'Indore'}
              </p>
            )}
          </div>
        )}
      </div>

      {/* CTA Button */}
      <button
        type="button"
        onClick={handleBookNow}
        disabled={isLoading || Boolean(hourlyError)}
        className="w-full py-4 px-6 rounded-2xl bg-brand-600 hover:bg-brand-500 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-600 disabled:active:scale-100 text-white font-extrabold text-sm shadow-md hover:shadow-hover transition-all duration-200 flex items-center justify-center gap-2"
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
