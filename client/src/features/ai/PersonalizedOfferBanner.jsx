import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { aiApi } from '../../services/aiApi';
import { Gift, Sparkles, Copy, Check, ArrowRight, Tag } from 'lucide-react';

export const PersonalizedOfferBanner = ({ city = 'Indore', className = '' }) => {
  const [offer, setOffer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchOffer();
  }, [city]);

  const fetchOffer = async () => {
    setIsLoading(true);
    try {
      const res = await aiApi.getPersonalizedOffers({ city });
      if (res.data?.offer) {
        setOffer(res.data.offer);
      }
    } catch (err) {
      console.warn('Personalized offer fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!offer?.couponCode) return;
    navigator.clipboard.writeText(offer.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading || !offer) return null;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 text-white p-6 sm:p-7 shadow-xl border border-white/10 ${className}`}
    >
      {/* Decorative background glow circles */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent-400/20 rounded-full blur-xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white border border-white/20 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {offer.badge || 'Recommended For You'}
            </span>
            <span className="text-xs text-white/80 font-medium">
              Verified Coupon
            </span>
          </div>

          <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {offer.title}
          </h3>

          <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
            {offer.reason}
          </p>

          <p className="text-[11px] text-white/70">
            Min trip amount: ₹{offer.minBookingAmount} • Max savings: ₹{offer.maxDiscountAmount} • Valid for {offer.validityDays} days
          </p>
        </div>

        {/* Promo Code Pill & Action Button */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 self-start md:self-auto flex-shrink-0">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 shadow-inner">
            <Tag className="w-4 h-4 text-amber-300" />
            <span className="font-mono font-extrabold text-base tracking-widest text-white">
              {offer.couponCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all ml-1"
              title="Copy coupon code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <Link
            to={`/explore?category=${offer.category || 'all'}`}
            className="px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-brand-700 text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 flex-shrink-0"
          >
            <span>Claim Ride</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
