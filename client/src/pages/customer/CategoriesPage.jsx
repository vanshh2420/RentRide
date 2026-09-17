import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryApi } from '../../services/categoryApi';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
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
  ShieldCheck,
  Layers
} from 'lucide-react';
import { cn } from '../../utils/cn';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      {/* Top Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Explore Fleet', href: '/explore' },
          { label: 'Vehicle Categories' }
        ]}
      />

      {/* Header Banner */}
      <div className="relative bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden text-center space-y-4">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/80 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5 text-brand-600" />
          <span>Vehicle Categories</span>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Explore by Category
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Find the perfect ride tailored for your journey. From fuel-efficient city scooters to luxury multi-terrain SUVs with zero overlap booking guarantee.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          <button
            type="button"
            onClick={() => setFilterType('ALL')}
            className={cn(
              "px-4 py-2 rounded-2xl text-xs font-bold transition-all",
              filterType === 'ALL'
                ? "bg-brand-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            )}
          >
            All Categories ({categories.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('two_wheeler')}
            className={cn(
              "px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5",
              filterType === 'two_wheeler'
                ? "bg-brand-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            )}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>Two-Wheelers</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterType('four_wheeler')}
            className={cn(
              "px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5",
              filterType === 'four_wheeler'
                ? "bg-brand-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            )}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Four-Wheelers</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400">Loading verified categories...</p>
        </div>
      ) : error ? (
        <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-center space-y-3 max-w-md mx-auto">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
          <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base">Error Loading Categories</h3>
          <p className="text-xs text-slate-500">{error}</p>
          <button
            type="button"
            onClick={fetchCategories}
            className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => {
            const isTwoWheeler = cat.type === 'two_wheeler';

            return (
              <Link
                key={cat._id || cat.slug}
                to={`/explore?category=${cat.slug || cat._id}`}
                className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={cat.iconUrl || (isTwoWheeler
                        ? 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80'
                        : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80')}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Type pill */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-mono text-[10px] font-extrabold flex items-center gap-1 border border-white/10">
                      {isTwoWheeler ? <Bike className="w-3 h-3 text-sky-400" /> : <Car className="w-3 h-3 text-amber-400" />}
                      <span>{isTwoWheeler ? 'TWO-WHEELER' : 'FOUR-WHEELER'}</span>
                    </div>

                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-200 text-[10px] font-bold">
                      Verified Fleet
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {cat.description || 'Verified vehicles available for flexible rental across Central India.'}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between text-xs font-bold border-t border-slate-100 dark:border-slate-800/80 pt-3 mt-1">
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                    {cat.startingRate || 'Transparent Rates'}
                  </span>
                  <span className="text-brand-600 dark:text-brand-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Explore Fleet</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
