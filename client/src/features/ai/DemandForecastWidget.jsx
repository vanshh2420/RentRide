import React, { useState, useEffect } from 'react';
import { aiApi } from '../../services/aiApi';
import { TrendingUp, Sparkles, Lightbulb, ChevronRight, BarChart2 } from 'lucide-react';
import { SUPPORTED_CITIES } from '../../constants/cities';

export const DemandForecastWidget = ({ defaultCity = "Indore" }) => {
  const [city, setCity] = useState(defaultCity);
  const [category, setCategory] = useState("all");
  const [forecast, setForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchForecast();
  }, [city, category]);

  const fetchForecast = async () => {
    setIsLoading(true);
    try {
      const res = await aiApi.getDemandForecast({ city, category });
      setForecast(res.data.forecast);
    } catch (err) {
      console.error('Failed to load demand forecast', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getBadgeStyle = (level) => {
    switch (level) {
      case 'PEAK':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200';
      case 'VERY HIGH':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 border-orange-200';
      case 'MEDIUM':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border-sky-200';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200';
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-glass">
      {/* Header & Dimensional Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-accent-500 to-amber-500 text-white shadow-md">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              7-Day AI Fleet Demand Forecast
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent-50 text-accent-700 dark:bg-accent-950 dark:text-accent-300 border border-accent-200">
                Predictive Model
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Time-series projection combining weekend surge indexes, city mobility, and utilization pressure.
            </p>
          </div>
        </div>

        {/* Dimension Filters: City & Category */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            {SUPPORTED_CITIES.map((c) => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="all">Overall Fleet</option>
            <option value="two_wheeler">Two-Wheelers & Bikes</option>
            <option value="four_wheeler">Cars & SUVs</option>
            <option value="scooter">City Scooters</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse pt-2">
          <div className="h-28 bg-slate-100 dark:bg-slate-800/60 rounded-2xl"></div>
          <div className="h-16 bg-slate-100 dark:bg-slate-800/60 rounded-2xl"></div>
        </div>
      ) : forecast ? (
        <>
          {/* Daily 7-day Bar Visualization */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-1">
            {(forecast.dailyForecasts || forecast.forecast || []).map((day, idx) => {
              const isPeak = day.demandLevel === 'PEAK' || day.demandLevel === 'VERY HIGH' || day.demandLevel === 'HIGH';

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl text-center space-y-2 border transition-all ${
                    isPeak
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-200 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/80'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span className="uppercase">{day.dayName?.substring(0, 3)}</span>
                    <span className="text-[9px] font-mono">{day.date?.slice(5)}</span>
                  </div>

                  {/* Demand Meter Visual */}
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        day.demandLevel === 'PEAK'
                          ? 'bg-rose-500'
                          : isPeak
                          ? 'bg-amber-500'
                          : 'bg-brand-500'
                      }`}
                      style={{ width: `${Math.min(100, day.predictedUtilization || 50)}%` }}
                    ></div>
                  </div>

                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-heading font-extrabold text-sm text-slate-900 dark:text-white">
                      {day.demandIndex}x
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      ({day.predictedUtilization}%)
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-extrabold block px-2 py-0.5 rounded-full border ${getBadgeStyle(
                      day.demandLevel || day.surgeLevel
                    )}`}
                  >
                    {day.demandLevel || day.surgeLevel}
                  </span>

                  {day.recommendedMultiplier && day.recommendedMultiplier > 1 && (
                    <span className="text-[9px] text-emerald-600 font-bold block">
                      +{Math.round((day.recommendedMultiplier - 1) * 100)}% Surge
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* AI Operational Insight & Actionable Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {/* Projected Pattern */}
            <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 text-xs flex items-start gap-3 text-sky-900 dark:text-sky-200">
              <BarChart2 className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="font-bold text-sky-950 dark:text-white block">
                  AI Market Demand Insight ({city})
                </strong>
                <p className="leading-relaxed opacity-90">{forecast.insight}</p>
              </div>
            </div>

            {/* Actionable Revenue Strategy */}
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs flex items-start gap-3 text-amber-900 dark:text-amber-200">
              <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="font-bold text-amber-950 dark:text-white block">
                  Operational Recommendation
                </strong>
                <p className="leading-relaxed opacity-90">{forecast.recommendation}</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="p-8 text-center space-y-3 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
          <TrendingUp className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Demand forecast temporarily unavailable for {city}
          </p>
          <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
            Unable to fetch real-time demand modeling at this moment. Please check back shortly or retry.
          </p>
          <button
            type="button"
            onClick={fetchForecast}
            className="px-4 py-1.5 rounded-xl bg-accent-600 hover:bg-accent-700 text-white font-bold text-xs shadow-xs cursor-pointer"
          >
            Retry Forecast
          </button>
        </div>
      )}
    </div>
  );
};
