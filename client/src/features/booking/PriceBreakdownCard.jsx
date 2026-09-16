import React from 'react';
import { IndianRupee, ShieldCheck, Zap, Sparkles, Tag, Lock } from 'lucide-react';

export const PriceBreakdownCard = ({ priceBreakdown, rentalPlan, durationHours, appliedCoupon }) => {
  if (!priceBreakdown) return null;

  const {
    basePrice,
    surgeMultiplier,
    couponDiscount,
    subtotal,
    platformFee,
    taxAmount,
    securityDeposit,
    totalAmount
  } = priceBreakdown;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
        <h3 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <IndianRupee className="w-4 h-4 text-brand-600" />
          <span>Fare Breakdown</span>
        </h3>
        <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200/60">
          {rentalPlan} • {durationHours}h
        </span>
      </div>

      {/* Itemized Lines */}
      <div className="space-y-2.5 text-xs">
        <div className="flex justify-between text-slate-600 dark:text-slate-300">
          <span>Base Rental Price ({durationHours} hours)</span>
          <span className="font-bold text-slate-900 dark:text-white">₹{basePrice}</span>
        </div>

        {surgeMultiplier > 1.0 && (
          <div className="flex justify-between text-amber-600 dark:text-amber-400 font-semibold">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3" /> Weekend Dynamic Surge ({Math.round((surgeMultiplier - 1) * 100)}%)
            </span>
            <span>+₹{Math.round(basePrice * (surgeMultiplier - 1))}</span>
          </div>
        )}

        {couponDiscount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800/40">
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> Coupon Discount {appliedCoupon?.code ? `(${appliedCoupon.code})` : ''}
            </span>
            <span>-₹{couponDiscount}</span>
          </div>
        )}

        <div className="flex justify-between text-slate-600 dark:text-slate-300 pt-1 border-t border-dashed border-slate-200 dark:border-slate-800 font-medium">
          <span>Net Rental Subtotal</span>
          <span className="font-bold text-slate-900 dark:text-white">₹{subtotal}</span>
        </div>

        <div className="flex justify-between text-slate-500">
          <span>Platform Convenience Fee (5%)</span>
          <span>₹{platformFee}</span>
        </div>

        <div className="flex justify-between text-slate-500">
          <span>GST / Government Taxes (18%)</span>
          <span>₹{taxAmount}</span>
        </div>

        {/* Highlighted Security Deposit */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
          <div>
            <span className="flex items-center gap-1.5 font-extrabold text-emerald-800 dark:text-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Refundable Security Deposit</span>
            </span>
            <p className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80 mt-0.5">
              Returned instantly to source upon vehicle return
            </p>
          </div>
          <span className="font-heading font-extrabold text-sm text-emerald-800 dark:text-emerald-200">
            ₹{securityDeposit}
          </span>
        </div>
      </div>

      {/* Final Total Amount */}
      <div className="pt-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[11px] uppercase font-extrabold text-slate-400 block tracking-wider">
            Total Payable Now
          </span>
          <span className="text-[10px] text-slate-500">Inclusive of deposit & taxes</span>
        </div>
        <div className="font-heading text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          ₹{totalAmount}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="pt-2 flex items-center justify-center gap-3 text-[11px] text-slate-400 font-medium border-t border-slate-100 dark:border-slate-800/80">
        <span className="flex items-center gap-1">
          <Lock className="w-3 h-3 text-emerald-500" /> 256-Bit SSL Encrypted
        </span>
        <span>•</span>
        <span>Razorpay Verified</span>
      </div>
    </div>
  );
};
