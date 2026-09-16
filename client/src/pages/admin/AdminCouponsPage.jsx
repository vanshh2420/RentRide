import React from 'react';
import { CouponManager } from '../../features/admin/CouponManager';

export const AdminCouponsPage = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex items-center gap-2 mb-1">
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
          Promotions & Campaigns
        </span>
        <span className="text-xs text-slate-400 font-medium">Platform Discount Coupons</span>
      </div>
      <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
        Discount Coupons Manager
      </h1>

      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl">
        <CouponManager />
      </div>
    </div>
  );
};
