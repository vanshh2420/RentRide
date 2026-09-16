import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryApi } from '../../services/categoryApi';
import { 
  Bike, 
  Car, 
  Zap, 
  ArrowRight, 
  Sparkles, 
  SlidersHorizontal,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await categoryApi.getAllCategories();
      setCategories(response.data?.categories || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError(err.message || 'Unable to load vehicle categories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCategories = categories.filter((cat) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'two_wheeler') return cat.type === 'two_wheeler';
    if (filterType === 'four_wheeler') return cat.type === 'four_wheeler';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="relative glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-glass overflow-hidden text-center space-y-4">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/80 text-brand-700 dark:text-brand-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-accent-500" />
          Vehicle Categories
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Explore by Category
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Find the perfect ride tailored for your journey. From fuel-efficient city scooters to luxury multi-terrain SUVs with zero overlap booking guarantee.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              filterType === 'ALL'
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Categories ({categories.length})
          </button>
          <button
            onClick={() => setFilterType('two_wheeler')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterType === 'two_wheeler'
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Bike className="w-3.5 h-3.5" /> Two-Wheelers
          </button>
          <button
            onClick={() => setFilterType('four_wheeler')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterType === 'four_wheeler'
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Car className="w-3.5 h-3.5" /> Four-Wheelers
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-80 rounded-3xl bg-slate-100 dark:bg-slate-800/60 animate-pulse border border-slate-200/80 dark:border-slate-800"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="p-8 rounded-3xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-center space-y-4 max-w-md mx-auto">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
            Failed to Load Categories
          </h3>
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={fetchCategories}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold inline-flex items-center gap-2 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredCategories.length === 0 && (
        <div className="p-12 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center space-y-3 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto text-slate-400">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
            No Vehicle Categories Available
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {filterType !== 'ALL'
              ? `No categories match the "${filterType === 'two_wheeler' ? 'Two-Wheelers' : 'Four-Wheelers'}" filter.`
              : 'No vehicle categories are currently available in the database.'}
          </p>
          {filterType !== 'ALL' && (
            <button
              onClick={() => setFilterType('ALL')}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-colors"
            >
              Show All Categories
            </button>
          )}
        </div>
      )}

      {/* Categories Grid */}
      {!isLoading && !error && filteredCategories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => {
            const isTwoWheeler = category.type === 'two_wheeler';

            return (
              <div
                key={category._id}
                className="glass-panel rounded-3xl border border-slate-200 dark:border-slate-800/90 overflow-hidden shadow-glass hover:shadow-hover transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Category Image / Banner */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={
                        category.iconUrl ||
                        (isTwoWheeler
                          ? 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80'
                          : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80')
                      }
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Type Badge */}
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-mono text-[10px] font-extrabold flex items-center gap-1.5 border border-white/20 shadow-md">
                      {isTwoWheeler ? <Bike className="w-3 h-3 text-sky-400" /> : <Car className="w-3 h-3 text-amber-400" />}
                      <span>{isTwoWheeler ? 'TWO-WHEELER' : 'FOUR-WHEELER'}</span>
                    </div>

                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white font-bold text-[10px] shadow-sm">
                      Active
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-2.5">
                    <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
                      {category.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {category.description || `Browse verified ${category.name.toLowerCase()} available for hourly and daily rental.`}
                    </p>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="p-6 pt-0">
                  <Link
                    to={`/explore?category=${category.slug || category._id}`}
                    className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-brand-600 dark:bg-slate-800 dark:hover:bg-brand-600 text-slate-800 hover:text-white dark:text-slate-200 dark:hover:text-white font-bold text-xs flex items-center justify-between transition-all duration-200 group-hover:bg-brand-600 group-hover:text-white shadow-xs"
                  >
                    <span>Browse {category.name}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

