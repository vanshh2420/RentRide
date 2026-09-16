import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { aiApi } from '../../services/aiApi';
import { Sparkles, Star, Zap, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export const AiRecommendationsCarousel = ({ categoryId, city, title = "Smart AI Recommendations" }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, [categoryId, city]);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const res = await aiApi.getRecommendations({ categoryId, city, limit: 4 });
      setRecommendations(res.data.recommendations || []);
    } catch (err) {
      console.error('Failed to load AI recommendations', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-6 space-y-3">
        <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-500 text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              {title}
            </h3>
            <p className="text-xs text-slate-500">
              Personalized matching engine tailored to your travel needs.
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-950/40 px-3 py-1 rounded-full border border-accent-200/60">
          <Zap className="w-3 h-3" /> AI Scored
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {recommendations.map((item) => {
          const v = item.vehicle;
          if (!v) return null;

          return (
            <div
              key={item.vehicleId}
              className="glass-panel rounded-3xl border border-slate-200/90 dark:border-slate-800/90 overflow-hidden shadow-glass hover:shadow-hover transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Image & Match Badge */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={v.images?.[0]?.url || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80'}
                    alt={v.model}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-emerald-400 font-mono text-[10px] font-extrabold flex items-center gap-1 border border-emerald-500/30 shadow-md">
                    <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                    <span>{item.matchPercentage}% MATCH</span>
                  </div>
                </div>

                {/* Content */}
                <div className="px-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold uppercase tracking-wider text-[10px] text-brand-600 dark:text-brand-400">
                      {v.categoryId?.name || 'Vehicle'}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{v.ratingAverage || 4.8}</span>
                    </div>
                  </div>

                  <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white truncate">
                    {v.brand} {v.model}
                  </h4>

                  {/* Highlights Tags */}
                  <div className="flex flex-wrap gap-1">
                    {item.highlights?.map((h, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {item.recommendationReason}
                  </p>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="p-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between mt-2">
                <div>
                  <span className="text-[10px] text-slate-400 block">Starting from</span>
                  <span className="font-heading font-extrabold text-base text-slate-900 dark:text-white">
                    ₹{v.pricing?.hourlyRate}
                    <span className="text-[10px] font-normal text-slate-400">/hr</span>
                  </span>
                </div>

                <Link
                  to={`/vehicles/${v._id || item.vehicleId}`}
                  className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm flex items-center gap-1 group-hover:gap-1.5 transition-all"
                >
                  <span>Book</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
