import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ShieldCheck, Clock, Award, Phone, Mail, MapPin, Sparkles, CheckCircle2, Store, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Col 1: Brand & Guarantee */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-sky-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
                <Car className="w-5 h-5 stroke-[2.4]" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-2xl font-black tracking-tight text-white flex items-center gap-1">
                  RentRide
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500 -mt-1">
                  Smart Mobility Marketplace
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              Central India's leading multi-vendor vehicle rental marketplace. Book verified scooters, motorcycles, hatchbacks, and SUVs with guaranteed zero overlap and transparent pricing.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] font-semibold text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Hosts
              </span>
              <span className="inline-flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] font-semibold text-slate-300">
                <Clock className="w-3.5 h-3.5 text-sky-400" /> Zero Double-Booking
              </span>
              <span className="inline-flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] font-semibold text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Pricing
              </span>
            </div>
          </div>

          {/* Col 2: Fleet & Categories */}
          <div>
            <h4 className="font-heading font-extrabold text-white text-xs uppercase tracking-wider mb-4">
              Explore Fleet
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/explore?category=scooters" className="hover:text-white transition-colors">
                  Electric & City Scooters
                </Link>
              </li>
              <li>
                <Link to="/explore?category=bikes" className="hover:text-white transition-colors">
                  Cruiser & Sports Motorcycles
                </Link>
              </li>
              <li>
                <Link to="/explore?category=hatchbacks" className="hover:text-white transition-colors">
                  City Hatchbacks & Sedans
                </Link>
              </li>
              <li>
                <Link to="/explore?category=suvs" className="hover:text-white transition-colors">
                  Prime SUVs & 7-Seaters
                </Link>
              </li>
              <li className="pt-1">
                <Link to="/categories" className="text-brand-400 hover:text-brand-300 font-bold transition-colors inline-flex items-center gap-1">
                  <span>View All Categories</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Rental Plans & Partners */}
          <div>
            <h4 className="font-heading font-extrabold text-white text-xs uppercase tracking-wider mb-4">
              Rental Plans
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/rental-plans?plan=HOURLY" className="hover:text-white transition-colors">
                  Hourly Flexi-Pass
                </Link>
              </li>
              <li>
                <Link to="/rental-plans?plan=TWELVE_HOUR" className="hover:text-white transition-colors">
                  12-Hour Day Pack
                </Link>
              </li>
              <li>
                <Link to="/rental-plans?plan=TWENTY_FOUR_HOUR" className="hover:text-white transition-colors">
                  24-Hour Weekend Escape
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  to="/vendor/register"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-white font-bold text-xs transition-all"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Become a Host</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Operational Hubs */}
          <div>
            <h4 className="font-heading font-extrabold text-white text-xs uppercase tracking-wider mb-4">
              Operational Hubs
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/explore?city=Indore" className="hover:text-white transition-colors flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                  <span>Indore Hub (120+ rides)</span>
                </Link>
              </li>
              <li>
                <Link to="/explore?city=Bhopal" className="hover:text-white transition-colors flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                  <span>Bhopal Hub (80+ rides)</span>
                </Link>
              </li>
              <li>
                <Link to="/explore?city=Gwalior" className="hover:text-white transition-colors flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                  <span>Gwalior Hub (60+ rides)</span>
                </Link>
              </li>
              <li className="pt-2 text-slate-500 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>support@rentride.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} RentRide Technologies Inc. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/rental-plans" className="hover:text-slate-300 transition-colors">Rental Policies</Link>
            <Link to="/categories" className="hover:text-slate-300 transition-colors">Fleet Categories</Link>
            <Link to="/vendor/register" className="hover:text-slate-300 transition-colors">Vendor Terms</Link>
            <Link to="/explore" className="hover:text-slate-300 transition-colors">Search Hubs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
