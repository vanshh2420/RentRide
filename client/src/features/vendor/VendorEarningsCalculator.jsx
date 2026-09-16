import React, { useState } from 'react';
import { IndianRupee, TrendingUp, Calculator, ShieldCheck, Zap, Info } from 'lucide-react';

export const VendorEarningsCalculator = ({ defaultRate = 80, defaultExtraKmRate = 10 }) => {
  const [hours, setHours] = useState(24);
  const [hourlyRate, setHourlyRate] = useState(defaultRate);
  const [extraKm, setExtraKm] = useState(20);
  const [extraKmRate, setExtraKmRate] = useState(defaultExtraKmRate);

  // Calculations
  const rentalRevenue = Math.max(0, hours * hourlyRate);
  const extraKmRevenue = Math.max(0, extraKm * extraKmRate);
  const grossRevenue = rentalRevenue + extraKmRevenue;

  const commissionRate = 0.12; // 12% standard platform commission
  const platformCommission = Math.round(grossRevenue * commissionRate);
  const netEarnings = grossRevenue - platformCommission;

  return (
    <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-glass space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-600 text-white shadow-md">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              Vendor Rental Economics Calculator
            </h3>
            <p className="text-xs text-slate-500">
              Project net payouts across rental durations and extra-kilometer revenue.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
          88% Payout
        </span>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
            Trip Duration (Hours)
          </label>
          <input
            type="number"
            min={1}
            max={720}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value) || 1)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
            Hourly Rate (₹)
          </label>
          <input
            type="number"
            min={10}
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value) || 10)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
            Extra KM Driven
          </label>
          <input
            type="number"
            min={0}
            value={extraKm}
            onChange={(e) => setExtraKm(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
            Extra Rate (₹/KM)
          </label>
          <input
            type="number"
            min={5}
            value={extraKmRate}
            onChange={(e) => setExtraKmRate(Number(e.target.value) || 5)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
          />
        </div>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Rental Revenue</span>
          <div className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
            ₹{rentalRevenue}
          </div>
          <span className="text-[10px] text-slate-400 block">{hours}h × ₹{hourlyRate}/h</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Extra KM Revenue</span>
          <div className="font-heading font-extrabold text-lg text-indigo-600 dark:text-indigo-400">
            ₹{extraKmRevenue}
          </div>
          <span className="text-[10px] text-slate-400 block">{extraKm} km × ₹{extraKmRate}/km</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300">
            Net Vendor Earnings
          </span>
          <div className="font-heading font-extrabold text-xl text-emerald-700 dark:text-emerald-300">
            ₹{netEarnings}
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">
            After 12% commission (-₹{platformCommission})
          </span>
        </div>
      </div>

      {/* Visual Formula */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-2">
        <Info className="w-4 h-4 text-brand-600 flex-shrink-0" />
        <span>
          <strong>Payout Formula: </strong>
          (Rental Revenue ₹{rentalRevenue} + Extra KM ₹{extraKmRevenue}) − Platform Commission (12% = ₹{platformCommission}) = <strong>Net ₹{netEarnings}</strong>
        </span>
      </div>
    </div>
  );
};
