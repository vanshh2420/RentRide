import React, { useState, useEffect } from 'react';
import { categoryApi } from '../../services/categoryApi';
import { 
  Filter, 
  RotateCcw, 
  Car, 
  Bike, 
  Zap, 
  Fuel, 
  Users, 
  IndianRupee,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export const FilterPanel = ({ filters, onFilterChange, onResetFilters }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await categoryApi.getAllCategories();
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const handleFieldChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value, page: 1 });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-6">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 flex items-center justify-center">
            <Filter className="w-4 h-4" />
          </div>
          <h2 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
            Filter Fleets
          </h2>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs font-bold text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Rental Plan Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
          Rental Plan
        </label>
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl">
          {[
            { id: 'HOURLY', label: 'Hourly' },
            { id: '12_HOURS', label: '12-Hour' },
            { id: '24_HOURS', label: '24-Hour' }
          ].map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => handleFieldChange('plan', plan.id)}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                filters.plan === plan.id
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {plan.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Vehicle Category Filter */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
          Vehicle Category
        </label>
        <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => handleFieldChange('category', 'all')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
              !filters.category || filters.category === 'all'
                ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map((cat) => {
            const isCatActive = filters.category === cat.slug || filters.category === cat._id || filters.category === cat.name;
            return (
              <button
                key={cat._id}
                type="button"
                onClick={() => handleFieldChange('category', cat.slug || cat._id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  isCatActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                  {cat.type === 'two_wheeler' ? '2-W' : '4-W'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Fuel & Propulsion */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
          Fuel & Propulsion
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: 'all', label: 'All' },
            { id: 'electric', label: '⚡ Electric' },
            { id: 'petrol', label: 'Petrol' },
            { id: 'diesel', label: 'Diesel' },
            { id: 'hybrid', label: 'Hybrid' }
          ].map((fuel) => (
            <button
              key={fuel.id}
              type="button"
              onClick={() => handleFieldChange('fuelType', fuel.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                (filters.fuelType || 'all') === fuel.id
                  ? 'bg-brand-600 border-brand-600 text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              {fuel.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Transmission */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
          Transmission
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: 'all', label: 'All' },
            { id: 'automatic', label: 'Auto' },
            { id: 'manual', label: 'Manual' }
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleFieldChange('transmission', t.id)}
              className={`px-2 py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                (filters.transmission || 'all') === t.id
                  ? 'bg-brand-600 border-brand-600 text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Max Price Slider */}
      <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span>Max Price</span>
          <span className="text-slate-900 dark:text-white font-extrabold text-sm">
            ₹{filters.maxPrice || (filters.plan === 'HOURLY' ? 500 : 5000)}
          </span>
        </div>
        <input
          type="range"
          min={filters.plan === 'HOURLY' ? 50 : 500}
          max={filters.plan === 'HOURLY' ? 500 : 5000}
          step={filters.plan === 'HOURLY' ? 10 : 100}
          value={filters.maxPrice || (filters.plan === 'HOURLY' ? 500 : 5000)}
          onChange={(e) => handleFieldChange('maxPrice', e.target.value)}
          className="w-full accent-brand-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
          <span>₹{filters.plan === 'HOURLY' ? 50 : 500}</span>
          <span>₹{filters.plan === 'HOURLY' ? 500 : 5000}</span>
        </div>
      </div>
    </div>
  );
};
