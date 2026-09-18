import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bike, 
  Car, 
  ArrowRight, 
  Layers,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { CATEGORY_VEHICLES } from '../../data/categoryVehicles';

// Re-export for backward compatibility with any other modules
export const CATEGORY_SHOWCASE = CATEGORY_VEHICLES.map(v => ({
  ...v,
  icon: v.slug === 'bikes' || v.slug === 'scooters' ? Bike : Car,
  typeLabel: v.categoryTag
}));

export const CategorySection = ({ className = '' }) => {
  return (
    <section 
      aria-labelledby="category-section-title"
      className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)}
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/80 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Fleet Categories</span>
          </div>
          <h2 
            id="category-section-title"
            className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight"
          >
            Explore by Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Choose the perfect ride for your next journey from our verified fleet.
          </p>
        </div>

        <Link
          to="/categories"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors whitespace-nowrap self-start sm:self-auto py-1 px-3 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-950/50"
        >
          <span>All Categories</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 5-Card Automotive Showcase Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 sm:gap-6">
        {CATEGORY_VEHICLES.map((item) => {
          const Icon = item.slug === 'bikes' || item.slug === 'scooters' ? Bike : Car;

          return (
            <Link
              key={item.id}
              to={item.route}
              aria-label={`${item.categoryName}: ${item.vehicleName}, ${item.variantColor}. ${item.ctaText}`}
              className="group relative flex flex-col justify-between rounded-3xl bg-slate-900 dark:bg-slate-950 border border-slate-800/90 hover:border-brand-500/60 shadow-lg hover:shadow-2xl hover:shadow-brand-950/40 hover:-translate-y-1.5 transition-all duration-300 ease-out overflow-hidden focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              {/* Subtle top ambient rim light */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent group-hover:via-brand-400 transition-all duration-300 z-20" />

              <div>
                {/* 1. VISUAL FOCUS: Exact Vehicle Studio Presentation */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                  {/* Studio floor gradient overlay to seamlessly integrate */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/10 opacity-30 group-hover:opacity-10 transition-opacity duration-300 z-10 pointer-events-none" />

                  {/* Vehicle Image */}
                  <img
                    src={item.imageUrl}
                    alt={item.altText}
                    className="w-full h-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Category Type Badge Floating in Top-Right */}
                  <div className="absolute top-3 right-3 z-20">
                    <span className="text-[10px] font-bold text-slate-300 px-2 py-0.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-slate-700/60 shadow-xs">
                      {item.categoryTag}
                    </span>
                  </div>
                </div>

                {/* Card Information Body */}
                <div className="p-4 pt-3.5 space-y-2">
                  {/* 2. CATEGORY NAME */}
                  <div className="flex items-center gap-1.5 text-brand-400 dark:text-brand-400">
                    <span className="w-5 h-5 rounded-md bg-brand-500/10 text-brand-400 flex items-center justify-center">
                      <Icon className="w-3 h-3" />
                    </span>
                    <span className="text-xs font-black uppercase tracking-wider">
                      {item.categoryName}
                    </span>
                  </div>

                  {/* 3. EXACT VEHICLE NAME */}
                  <h3 className="font-heading font-extrabold text-base text-white group-hover:text-brand-300 transition-colors tracking-tight leading-snug">
                    {item.vehicleName}
                  </h3>

                  {/* 4. REQUESTED COLOR / VARIANT */}
                  <div className="flex items-center gap-2 pt-0.5">
                    <span 
                      className="inline-block w-2.5 h-2.5 rounded-full border border-slate-600 shadow-xs flex-shrink-0"
                      style={{ backgroundColor: item.colorHex }}
                      aria-hidden="true"
                    />
                    <p className="text-xs font-medium text-slate-400">
                      {item.variantColor}
                    </p>
                  </div>
                </div>
              </div>

              {/* 5. EXISTING CATEGORY CTA */}
              <div className="p-4 pt-0">
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-300 group-hover:text-brand-300 transition-colors">
                  <span>{item.ctaText}</span>
                  <span className="w-7 h-7 rounded-full bg-slate-800/90 group-hover:bg-brand-600 text-slate-300 group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 shadow-sm">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CategorySection;
