import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ShieldCheck, Clock, Award, Phone, Mail, MapPin, Sparkles, CheckCircle2, Store } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-sky-600 to-accent-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <Car className="w-5 h-5 stroke-[2.4]" />
              </div>
              <span className="font-heading text-2xl font-extrabold tracking-tight text-white">
                RentRide
              </span>
            </Link>
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              India's premier multi-vendor vehicle marketplace. Book verified scooters, motorcycles, hatchbacks, and SUVs with guaranteed zero overlap and transparent pricing.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Vendors
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                <Clock className="w-3.5 h-3.5 text-sky-400" /> Zero Double-Booking
              </span>
            </div>
          </div>

          {/* Col 2: Fleet & Categories */}
          <div>
            <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider mb-4">
              Explore Fleet
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/explore?type=two_wheeler" className="hover:text-white transition-colors">
                  Electric & City Scooters
                </Link>
              </li>
              <li>
                <Link to="/explore?type=two_wheeler" className="hover:text-white transition-colors">
                  Cruiser & Sports Motorcycles
                </Link>
              </li>
              <li>
                <Link to="/explore?type=four_wheeler" className="hover:text-white transition-colors">
                  City Hatchbacks & Sedans
                </Link>
              </li>
              <li>
                <Link to="/explore?type=four_wheeler" className="hover:text-white transition-colors">
                  Prime SUVs & 7-Seaters
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-brand-400 hover:text-brand-300 font-bold transition-colors">
                  View All Categories →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Rental Plans & Partners */}
          <div>
            <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider mb-4">
              Rental Plans
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/rental-plans" className="hover:text-white transition-colors">
                  Hourly Flexi-Pass
                </Link>
              </li>
              <li>
                <Link to="/rental-plans" className="hover:text-white transition-colors">
                  12-Hour Day Pack
                </Link>
              </li>
              <li>
                <Link to="/rental-plans" className="hover:text-white transition-colors">
                  24-Hour Weekend Escape
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  to="/vendor/register"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent-500/10 text-accent-400 border border-accent-500/30 hover:bg-accent-500 hover:text-white font-bold transition-all"
                >
                  <Store className="w-3.5 h-3.5" /> Become a Vendor
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Support & Hubs */}
          <div>
            <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider mb-4">
              Operational Hubs
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-400" /> Indore, Madhya Pradesh
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-400" /> Bhopal, Madhya Pradesh
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-400" /> Gwalior, Madhya Pradesh
              </li>
              <li className="pt-2 flex items-center gap-2 text-slate-500">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> support@rentride.in
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} RentRide Marketplace Inc. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/rental-plans" className="hover:text-slate-400">Rental Policies</Link>
            <Link to="/categories" className="hover:text-slate-400">Fleet Categories</Link>
            <Link to="/vendor/register" className="hover:text-slate-400">Vendor Terms</Link>
            <Link to="/explore" className="hover:text-slate-400">Search Hubs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
