import React from 'react';
import { LoginForm } from '../../features/auth/LoginForm';
import { Car, ShieldCheck, Zap, Star, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LoginPage = () => {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900">
        
        {/* LEFT PANE: Premium Mobility Showcase (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 relative p-10 flex-col justify-between overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80')" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />

          {/* Top Brand Tag */}
          <div className="relative z-10 space-y-4">
            <Link to="/" className="inline-flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/30">
                <Car className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-heading text-2xl font-black tracking-tight text-white">
                RentRide
              </span>
            </Link>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold uppercase tracking-wide border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Verified Mobility Network</span>
            </div>
          </div>

          {/* Center Copy */}
          <div className="relative z-10 space-y-3 py-6">
            <h3 className="font-heading text-2xl font-extrabold text-white leading-snug">
              Rent Any Ride. <br />
              <span className="text-brand-400">Anytime & Anywhere.</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Sign in to manage your active rentals, access offline walk-in logs, and track verified vehicle fleet earnings.
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Double-Booking Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant Security Deposit Refunds</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verified Commercial Hosts</span>
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
              "Booking a Royal Enfield for our Pachmarhi weekend took under 2 minutes. Transparent pricing with zero hidden fees!"
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              — Rahul S., Verified Customer
            </p>
          </div>
        </div>

        {/* RIGHT PANE: Clean Form Container */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-6">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Welcome Back
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Sign in to your RentRide account to continue.
            </p>
          </div>

          {/* Form */}
          <LoginForm />
        </div>

      </div>
    </div>
  );
};
