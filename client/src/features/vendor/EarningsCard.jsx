import React from 'react';
import { IndianRupee, TrendingUp, ShieldCheck, ArrowUpRight, DollarSign } from 'lucide-react';

export const EarningsCard = ({ grossRevenue = 0, platformCommissionRate = 0.12, settledAmount = 0 }) => {
  const platformFee = Math.round(grossRevenue * platformCommissionRate);
  const netEarnings = grossRevenue - platformFee;
  const pendingPayout = Math.max(0, netEarnings - settledAmount);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Gross Revenue Card */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
          <span>Gross Fleet Revenue</span>
          <TrendingUp className="w-4 h-4 text-brand-600" />
        </div>
        <div className="font-heading text-2xl font-extrabold text-slate-900 dark:text-white">
          ₹{grossRevenue.toLocaleString()}
        </div>
        <p className="text-[11px] text-slate-500">
          Total earnings before platform commission deduction.
        </p>
      </div>

      {/* Net Vendor Payout (88%) */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
          <span>Net Fleet Earnings (88%)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            12% Comm.
          </span>
        </div>
        <div className="font-heading text-2xl font-extrabold text-emerald-600">
          ₹{netEarnings.toLocaleString()}
        </div>
        <p className="text-[11px] text-slate-500">
          Platform commission deducted: ₹{platformFee.toLocaleString()}
        </p>
      </div>

      {/* Pending Settlement */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
          <span>Pending Bank Transfer</span>
          <ArrowUpRight className="w-4 h-4 text-accent-500" />
        </div>
        <div className="font-heading text-2xl font-extrabold text-slate-900 dark:text-white">
          ₹{pendingPayout.toLocaleString()}
        </div>
        <p className="text-[11px] text-slate-500">
          Settled so far: ₹{settledAmount.toLocaleString()}
        </p>
      </div>
    </div>
  );
};
