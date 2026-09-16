import React from 'react';
import { VehicleCard } from './VehicleCard';
import { Car, RotateCcw } from 'lucide-react';

export const VehicleGrid = ({ vehicles, isLoading, onResetFilters }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-pulse flex flex-col justify-between"
          >
            <div className="aspect-[16/10] bg-slate-200 dark:bg-slate-800"></div>
            <div className="p-5 space-y-3">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="glass-panel p-12 sm:p-16 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-subtle">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 flex items-center justify-center mx-auto">
          <Car className="w-8 h-8" />
        </div>
        <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
          No Vehicles Match Your Search
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          We couldn't find any available vehicles matching your selected criteria. Try adjusting your filters, location, or rental plan.
        </p>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle._id} vehicle={vehicle} />
      ))}
    </div>
  );
};
