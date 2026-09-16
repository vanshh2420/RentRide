import React, { useState, useEffect } from 'react';
import { reviewApi } from '../../services/reviewApi';
import { Star, MessageSquare, ShieldCheck, User } from 'lucide-react';

export const VehicleReviewsList = ({ vehicleId, ratingAverage = 5.0, ratingCount = 0 }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (vehicleId) fetchReviews();
  }, [vehicleId]);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await reviewApi.getVehicleReviews(vehicleId);
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error('Failed to load reviews', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Reviews Summary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <div className="text-center p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
            <span className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white block">
              {ratingAverage}
            </span>
            <div className="flex items-center justify-center text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3 h-3 fill-amber-400" />
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              Verified Customer Ratings
            </h4>
            <p className="text-xs text-slate-500">
              Based on {ratingCount} verified trips booked on RentRide.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
          <ShieldCheck className="w-4 h-4" /> 100% Genuine Verified Riders
        </div>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div className="py-8 text-center text-xs text-slate-400">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400">
          No reviews submitted for this vehicle yet. Be the first to rent and leave feedback!
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-sm"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <div className="w-7 h-7 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span>{r.customerId?.name || 'Verified Rider'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: r.rating }, (_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {r.comment && (
                <p className="text-xs text-slate-600 dark:text-slate-300 pl-9 leading-relaxed">
                  "{r.comment}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
