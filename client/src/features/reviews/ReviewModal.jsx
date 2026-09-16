import React, { useState } from 'react';
import { reviewApi } from '../../services/reviewApi';
import { Star, X, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';

export const ReviewModal = ({ isOpen, onClose, booking, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !booking) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await reviewApi.createReview({
        vehicleId: booking.vehicleId?._id || booking.vehicleId,
        bookingId: booking._id,
        rating,
        comment
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">Verified Rider Review</span>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              Rate Your Ride
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Star Rating Selector */}
          <div className="text-center space-y-2">
            <label className="block font-semibold uppercase text-slate-400 text-[10px]">
              How was your experience with {booking.vehicleId?.brand} {booking.vehicleId?.model}?
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="font-heading text-sm font-bold text-brand-600">
              {rating === 5 ? '⭐ Excellent Ride!' : rating === 4 ? 'Great Ride' : rating === 3 ? 'Good' : 'Needs Improvement'}
            </span>
          </div>

          {/* Feedback Comment */}
          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Your Review & Feedback (Optional)
            </label>
            <textarea
              rows="3"
              placeholder="Tell other riders about vehicle cleanliness, pickup experience, and vehicle condition..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
            ></textarea>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Verified Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
