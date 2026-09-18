import React from 'react';
import { RegisterForm } from '../../features/auth/RegisterForm';
import { Car, ShieldCheck, Zap, Star, CheckCircle2, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RentRideLogo } from '../../components/common/RentRideLogo';

export const RegisterPage = () => {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900">
        
        {/* LEFT PANE: Premium Mobility Showcase (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 relative p-10 flex-col justify-between overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80')" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />

          {/* Top Brand Tag */}
          <div className="relative z-10 space-y-4">
            <RentRideLogo size="lg" showTagline={false} inverted={true} />

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/20 text-accent-300 text-[11px] font-extrabold uppercase tracking-wide border border-accent-500/30">
              <Store className="w-3.5 h-3.5" />
              <span>Riders & Fleet Hosts</span>
            </div>
          </div>

          {/* Center Copy */}
          <div className="relative z-10 space-y-3 py-6">
            <h3 className="font-heading text-2xl font-extrabold text-white leading-snug">
              Join Central India's <br />
              <span className="text-accent-400">#1 Vehicle Marketplace.</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Whether you need a quick scooter sprint or want to monetize your commercial rental fleet, RentRide provides verified scheduling.
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Riders: 100% Conflict-Free Online Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Vendors: Unified Offline & Online Availability Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Automated Odometer Handovers & Direct Payouts</span>
              </div>
            </div>
          </div>

          {/* Bottom Review */}
          <div className="relative z-10 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-2">
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-200 italic">
              "Listing our fleet on RentRide increased our vehicle utilization by 35% within the first month."
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              — Malwa Auto Rentals, Verified Fleet Host
            </p>
          </div>
        </div>

        {/* RIGHT PANE: Clean Form Container */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-6">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Create Your Account
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Choose your profile type to register as a Customer or Fleet Vendor.
            </p>
          </div>

          {/* Form */}
          <RegisterForm />
        </div>

      </div>
    </div>
  );
};
