import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Clock, 
  Sun, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  HelpCircle,
  Car,
  Bike,
  Info,
  ChevronDown,
  ChevronUp,
  Percent,
  Compass
} from 'lucide-react';

export const RentalPlansPage = () => {
  const [searchParams] = useSearchParams();
  const targetedPlan = searchParams.get('plan')?.toUpperCase();
  const [selectedCategoryType, setSelectedCategoryType] = useState('two_wheeler');
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const sampleVehicleRates = {
    two_wheeler: [
      { name: 'Electric Scooter (e.g. Ather 450X)', hourly: 60, twelveHour: 450, twentyFourHour: 750, deposit: 1000 },
      { name: 'City Scooter (e.g. Honda Activa 6G)', hourly: 70, twelveHour: 500, twentyFourHour: 850, deposit: 1000 },
      { name: 'Cruiser Motorcycle (e.g. Royal Enfield Hunter 350)', hourly: 90, twelveHour: 750, twentyFourHour: 1100, deposit: 1500 }
    ],
    four_wheeler: [
      { name: 'City Hatchback (e.g. Maruti Swift)', hourly: 180, twelveHour: 1400, twentyFourHour: 2200, deposit: 3000 },
      { name: 'Premium Sedan (e.g. Honda City)', hourly: 240, twelveHour: 1900, twentyFourHour: 3000, deposit: 4000 },
      { name: 'Prime SUV (e.g. Hyundai Creta / Mahindra Thar)', hourly: 350, twelveHour: 2800, twentyFourHour: 4200, deposit: 5000 }
    ]
  };

  const plans = [
    {
      id: 'HOURLY',
      queryParam: 'HOURLY',
      name: 'Hourly Flexi-Pass',
      badge: 'Maximum Flexibility',
      tagline: 'Pay-as-you-drive for short errands, meetings, and quick city rides.',
      duration: '1 – 11 Hours',
      icon: Clock,
      theme: 'from-sky-500 to-brand-600',
      borderTheme: 'border-sky-500/30',
      badgeBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
      features: [
        'Billing calculated strictly per elapsed hour',
        'Minimum 1-hour booking duration',
        'Complimentary ISI helmet (Two-wheelers)',
        'Zero fuel surcharge (Return at same level)',
        'Free cancellation up to 1 hour before pickup',
        '10-minute instant inventory hold lock'
      ],
      idealFor: 'Quick city commutes, grocery runs, cafe hops & short meetings'
    },
    {
      id: 'TWELVE_HOUR',
      queryParam: 'TWELVE_HOUR',
      name: '12-Hour Day Pass',
      badge: 'Best Value for Day Trips',
      tagline: 'Full working day or half-day outstation getaway with packaged savings.',
      duration: 'Fixed 12 Hours',
      icon: Sun,
      isPopular: true,
      theme: 'from-amber-500 to-orange-600',
      borderTheme: 'border-amber-500/40 ring-2 ring-amber-500/20',
      badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      features: [
        'Up to 25% savings compared to hourly rates',
        '150 km complimentary mileage included',
        'Priority vehicle pickup check-in',
        '24/7 Roadside Assistance & Breakdown Cover',
        'Free rescheduling up to 2 hours before trip',
        'Standard zero-dep insurance package included'
      ],
      idealFor: 'Office day shifts, city sightseeing tours & nearby day trips'
    },
    {
      id: 'TWENTY_FOUR_HOUR',
      queryParam: 'TWENTY_FOUR_HOUR',
      name: '24-Hour Weekend Escape',
      badge: 'Full Day & Highway Touring',
      tagline: 'Complete 24-hour cycle for weekend road trips and multi-day vacations.',
      duration: '24 Hours (Multi-Day ready)',
      icon: Calendar,
      theme: 'from-purple-600 to-accent-600',
      borderTheme: 'border-purple-500/30',
      badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      features: [
        'Up to 40% bulk discount for 24h+ bookings',
        '300 km daily allowance included',
        'Multi-day booking extension options',
        'Comprehensive damage protection waiver',
        'Dedicated 24/7 travel concierge support',
        'Interstate permit assistance & fast-tag support'
      ],
      idealFor: 'Weekend vacations, hill station road trips & intercity travel'
    }
  ];

  const faqs = [
    {
      q: 'How does the Zero Overlap booking guarantee work?',
      a: 'RentRide utilizes a unified single-source inventory algorithm. When you initiate a reservation, the vehicle slot is locked for 10 minutes. Both online bookings and offline walk-ins verify the exact interval condition (ExistingStart < RequestedEnd && ExistingEnd > RequestedStart), preventing double-bookings.'
    },
    {
      q: 'What taxes and fees are added to the rental price?',
      a: 'RentRide enforces transparent server-side pricing: Base Plan Rate + Weekend Surge (+15% for Fri-Sun bookings if applicable) - Coupon Discount + 5% Convenience Fee + 18% GST. A refundable security deposit is held and refunded upon safe return.'
    },
    {
      q: 'Can I extend my rental while on the road?',
      a: 'Yes! As long as the vehicle does not have an upcoming overlapping booking or scheduled maintenance blackout, you can request an extension directly through your dashboard.'
    },
    {
      q: 'When is the security deposit refunded?',
      a: 'The security deposit is released immediately after the vendor completes the digital return inspection at drop-off.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* 1. HERO SECTION */}
      <div className="relative glass-panel p-8 sm:p-14 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-glass text-center space-y-5 overflow-hidden">
        <div className="absolute -top-16 -right-16 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/80 text-brand-700 dark:text-brand-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-accent-500" />
          Transparent & Flexible Pricing
        </div>

        <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Flexible Rental Plans, <br />
          <span className="bg-gradient-to-r from-brand-600 via-sky-500 to-accent-500 bg-clip-text text-transparent">
            Built Around Your Schedule
          </span>
        </h1>

        <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Choose from hourly micro-rentals, 12-hour day passes, or 24-hour multi-day packages. Every plan comes with verified local vendor dispatch and zero overlap guarantee.
        </p>
      </div>

      {/* 2. THREE RENTAL PLANS CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isTargeted = targetedPlan === plan.id;

          return (
            <div
              key={plan.id}
              className={`glass-panel rounded-3xl border ${
                isTargeted ? 'border-brand-500 ring-4 ring-brand-500/20 shadow-2xl scale-[1.02]' : plan.borderTheme
              } p-8 flex flex-col justify-between shadow-glass hover:shadow-hover transition-all duration-300 relative group`}
            >
              {isTargeted ? (
                <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand-600 to-accent-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                  Selected Plan
                </div>
              ) : plan.isPopular ? (
                <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                  Most Popular Choice
                </div>
              ) : null}

              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl bg-gradient-to-tr ${plan.theme} text-white shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${plan.badgeBg}`}>
                      {plan.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 block pt-0.5">
                      Duration: {plan.duration}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {plan.tagline}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-3 pt-4 border-t border-slate-200/80 dark:border-slate-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    What's Included:
                  </span>
                  <ul className="space-y-2.5">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8 mt-6 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-white">Best for: </strong>
                  {plan.idealFor}
                </div>

                <Link
                  to={`/explore?plan=${plan.queryParam}`}
                  className="w-full py-3.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md hover:shadow-hover flex items-center justify-center gap-2 transition-all group-hover:gap-2.5"
                >
                  <span>Explore Rides for {plan.name.split(' ')[0]}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. SAMPLE RATES ESTIMATOR BY VEHICLE CATEGORY */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-glass space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-6 h-6 text-brand-600" />
              Live Plan Rates by Vehicle
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Representative baseline rates across typical vehicles in the RentRide fleet.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl self-start sm:self-auto">
            <button
              onClick={() => setSelectedCategoryType('two_wheeler')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedCategoryType === 'two_wheeler'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Bike className="w-3.5 h-3.5" /> Two-Wheelers
            </button>
            <button
              onClick={() => setSelectedCategoryType('four_wheeler')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedCategoryType === 'four_wheeler'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Car className="w-3.5 h-3.5" /> Four-Wheelers
            </button>
          </div>
        </div>

        {/* Rates Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-extrabold tracking-wider">
                <th className="py-3 px-4">Vehicle Model</th>
                <th className="py-3 px-4">Hourly Plan</th>
                <th className="py-3 px-4">12-Hour Day Pass</th>
                <th className="py-3 px-4">24-Hour Escape</th>
                <th className="py-3 px-4">Refundable Deposit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {sampleVehicleRates[selectedCategoryType].map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                    {item.name}
                  </td>
                  <td className="py-4 px-4 text-slate-700 dark:text-slate-300">
                    <span className="font-heading font-extrabold text-base text-brand-600 dark:text-brand-400">
                      ₹{item.hourly}
                    </span>
                    <span className="text-[10px] text-slate-400"> /hr</span>
                  </td>
                  <td className="py-4 px-4 text-slate-700 dark:text-slate-300">
                    <span className="font-heading font-extrabold text-base text-amber-600 dark:text-amber-400">
                      ₹{item.twelveHour}
                    </span>
                    <span className="text-[10px] text-slate-400"> /12h</span>
                  </td>
                  <td className="py-4 px-4 text-slate-700 dark:text-slate-300">
                    <span className="font-heading font-extrabold text-base text-purple-600 dark:text-purple-400">
                      ₹{item.twentyFourHour}
                    </span>
                    <span className="text-[10px] text-slate-400"> /24h</span>
                  </td>
                  <td className="py-4 px-4 text-slate-500 dark:text-slate-400 font-mono text-xs">
                    ₹{item.deposit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. PLAN COMPARISON MATRIX */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-glass space-y-6">
        <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
          Plan Feature Comparison Matrix
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-extrabold tracking-wider">
                <th className="py-3 px-4">Feature</th>
                <th className="py-3 px-4">Hourly Plan</th>
                <th className="py-3 px-4">12-Hour Day Pass</th>
                <th className="py-3 px-4">24-Hour Escape</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">Minimum Duration</td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">1 Hour</td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">12 Hours</td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">24 Hours</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">Included Mileage</td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">Unlimited City Range</td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">150 km Package</td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">300 km / day Package</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">Free Cancellation</td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">Up to 1 hr before</td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">Up to 2 hrs before</td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">Up to 6 hrs before</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">Roadside Assistance</td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">City Limit Support</td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">24/7 Metro RSA</td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">Pan-India Highway RSA</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">Insurance Coverage</td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">Comprehensive Third-Party</td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">Zero-Depreciation Standard</td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">Full Collision Damage Waiver</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. FREQUENTLY ASKED QUESTIONS ACCORDION */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-glass space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-500 text-white">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Everything you need to know about pricing, security deposits, and booking policies.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 text-left font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-brand-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {openFaq === idx && (
                <div className="p-4 pt-0 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/30">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
