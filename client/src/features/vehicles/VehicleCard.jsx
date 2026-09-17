import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Fuel, 
  Users, 
  Zap, 
  ArrowRight, 
  ShieldCheck,
  Heart,
  Gauge,
  Sparkles
} from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/imageUtils';
import { cn } from '../../utils/cn';

export const VehicleCard = ({ vehicle, className }) => {
  const [isLiked, setIsLiked] = useState(false);

  if (!vehicle) return null;

  const rawImage =
    vehicle.images?.find((img) => img.isPrimary)?.url ||
    vehicle.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80';
  const primaryImage = getOptimizedImageUrl(rawImage, 'card');

  const isElectric = vehicle.fuelType === 'electric';
  const isAvailable = vehicle.status === 'AVAILABLE';
  const categoryName = vehicle.categoryId?.name || 'Ride';

  return (
    <div className={cn(
      "group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle hover:shadow-card hover:border-brand-500/40 dark:hover:border-brand-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden",
      className
    )}>
      {/* Media & Badges Showcase */}
      <Link 
        to={`/vehicles/${vehicle._id}`}
        className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 block cursor-pointer"
        aria-label={`View details for ${vehicle.brand} ${vehicle.model}`}
      >
        <img
          src={primaryImage}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Ambient bottom shade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25 pointer-events-none" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {isElectric ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-black shadow-xs">
                <Zap className="w-3 h-3 fill-white" />
                <span>EV</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10 shadow-xs">
                <Fuel className="w-3 h-3 text-sky-400" />
                <span className="capitalize">{vehicle.fuelType}</span>
                <span className="text-slate-400">•</span>
                <span className="capitalize">{vehicle.transmission === 'automatic' ? 'Auto' : 'Manual'}</span>
              </span>
            )}

            {vehicle.catalogId && (
              <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-600 text-white text-[10px] font-bold shadow-xs">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {/* Rating pill */}
            <div className="px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-900 dark:text-white text-xs font-bold flex items-center gap-1 shadow-sm">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{vehicle.ratingAverage ? vehicle.ratingAverage.toFixed(1) : '4.9'}</span>
            </div>

            {/* Favorite button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
              className="p-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md hover:bg-white text-slate-600 dark:text-slate-300 hover:text-rose-500 shadow-sm transition-colors"
              aria-label="Save vehicle to favorites"
            >
              <Heart className={cn("w-3.5 h-3.5 transition-colors", isLiked ? "fill-rose-500 text-rose-500" : "")} />
            </button>
          </div>
        </div>

        {/* Bottom image location & instant booking pill */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 font-medium bg-black/45 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-white/10">
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span>{vehicle.location?.city || 'Indore Hub'}</span>
          </span>
          {isAvailable && (
            <span className="inline-flex items-center gap-1 font-bold text-[10px] bg-emerald-500/95 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-lg uppercase tracking-wider shadow-xs">
              Instant Book
            </span>
          )}
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Category & Model Year */}
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            <span className="text-brand-600 dark:text-brand-400">{categoryName}</span>
            <span>{vehicle.year} MODEL</span>
          </div>

          {/* Vehicle Name */}
          <Link to={`/vehicles/${vehicle._id}`} className="block group/title">
            <h3 className="font-heading font-extrabold text-base sm:text-lg text-slate-900 dark:text-white group-hover/title:text-brand-600 dark:group-hover/title:text-brand-400 transition-colors line-clamp-1">
              {vehicle.brand} {vehicle.model}
            </h3>
          </Link>

          {/* Technical Specs Strip */}
          <div className="flex items-center flex-wrap gap-1.5 pt-0.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100/90 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg">
              <Users className="w-3 h-3 text-slate-400" />
              <span>{vehicle.seatingCapacity || 2} Seats</span>
            </span>

            {vehicle.fuelEconomy && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200/50 dark:border-emerald-800/40">
                <Gauge className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>{vehicle.fuelEconomy} {vehicle.fuelEconomyUnit || 'km/l'}</span>
              </span>
            )}

            {vehicle.engineCapacity && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100/90 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg">
                <span>{vehicle.engineCapacity} {isElectric ? 'kWh' : 'cc'}</span>
              </span>
            )}
          </div>
        </div>

        {/* Pricing & CTA Section */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Starting at</span>
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  ₹{vehicle.pricing?.hourlyRate}
                </span>
                <span className="text-xs text-slate-500 font-medium">/hr</span>
              </div>
            </div>

            {/* 12h & 24h Packs */}
            <div className="text-right text-[11px] text-slate-500 space-y-0.5">
              <div className="text-slate-600 dark:text-slate-400">
                12h: <span className="font-bold text-slate-900 dark:text-white">₹{vehicle.pricing?.rate12Hour}</span>
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                24h: <span className="font-bold text-slate-900 dark:text-white">₹{vehicle.pricing?.rate24Hour}</span>
              </div>
            </div>
          </div>

          <Link
            to={`/vehicles/${vehicle._id}`}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-brand-600 text-white dark:bg-brand-600 dark:hover:bg-brand-500 font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-xs group-hover:shadow-md active:scale-[0.99]"
          >
            <span>Book Ride</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
