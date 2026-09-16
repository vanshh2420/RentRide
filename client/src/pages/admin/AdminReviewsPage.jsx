import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';
import { 
  Star, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  EyeOff, 
  Eye, 
  AlertCircle, 
  Car, 
  User, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

export const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [ratingFilter, setRatingFilter] = useState('');
  const [moderatedFilter, setModeratedFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [isProcessingId, setIsProcessingId] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [ratingFilter, moderatedFilter, page]);

  const fetchReviews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminApi.getAllReviews({
        rating: ratingFilter || undefined,
        isModerated: moderatedFilter,
        search: search.trim() || undefined,
        page,
        limit: 15
      });
      setReviews(res.data.reviews || []);
      setPagination(res.data.pagination || { total: 0, totalPages: 1 });
    } catch (err) {
      console.error('Failed to load reviews:', err);
      setError(err.message || 'Unable to retrieve reviews.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchReviews();
  };

  const handleToggleModeration = async (review) => {
    setIsProcessingId(review._id);
    try {
      const newStatus = !review.isModerated;
      await adminApi.moderateReview(review._id, { isModerated: newStatus });
      fetchReviews();
    } catch (err) {
      alert(err.message || 'Failed to update review moderation status');
    } finally {
      setIsProcessingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Reputation & Trust
            </span>
            <span className="text-xs text-slate-400 font-medium">Customer Feedback Moderation</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Customer Reviews & Ratings Audit
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchReviews}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Reviews</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearch} className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search feedback comment text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-20 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all"
            >
              Search
            </button>
          </form>

          {/* Rating Tabs */}
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {[
              { id: '', label: 'All Ratings' },
              { id: '5', label: '5 ★' },
              { id: '4', label: '4 ★' },
              { id: '3', label: '3 ★' },
              { id: '2', label: '2 ★' },
              { id: '1', label: '1 ★' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setRatingFilter(tab.id);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  ratingFilter === tab.id
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Moderation State:</span>
            <select
              value={moderatedFilter}
              onChange={(e) => {
                setModeratedFilter(e.target.value);
                setPage(1);
              }}
              className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-2.5 py-1"
            >
              <option value="all">All Reviews</option>
              <option value="true">Published on Marketplace</option>
              <option value="false">Hidden / Unmoderated</option>
            </select>
          </div>

          <span className="text-xs text-slate-500">
            Total Reviews: <strong className="text-white">{pagination.total}</strong>
          </span>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 text-amber-500 animate-spin" />
            <span>Loading reviews from database...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-red-400">{error}</div>
        ) : reviews.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-xs">No customer reviews found matching these filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Vehicle</th>
                  <th className="py-3.5 px-3">Rating</th>
                  <th className="py-3.5 px-3">Customer Feedback</th>
                  <th className="py-3.5 px-3">Customer</th>
                  <th className="py-3.5 px-3">Vendor</th>
                  <th className="py-3.5 px-3">Date</th>
                  <th className="py-3.5 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {reviews.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">
                        {r.vehicleId?.brand} {r.vehicleId?.model}
                      </div>
                      <div className="text-[10px] text-purple-400 font-mono">
                        Plate: {r.vehicleId?.registrationNumber}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>{r.rating}.0</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 max-w-sm">
                      <p className="text-slate-200 text-xs italic line-clamp-2">
                        "{r.comment || 'No comment text provided'}"
                      </p>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-medium text-white">{r.customerId?.name || 'Customer'}</div>
                      <div className="text-[10px] text-slate-500">{r.customerId?.email}</div>
                    </td>

                    <td className="py-3.5 px-3 text-slate-400">
                      <span className="truncate max-w-[120px] block">
                        {r.vendorId?.vendorProfile?.businessName || r.vendorId?.name}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-[11px] text-slate-500">
                      {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        disabled={isProcessingId === r._id}
                        onClick={() => handleToggleModeration(r)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          r.isModerated
                            ? 'bg-emerald-950/70 hover:bg-rose-950 text-emerald-400 hover:text-rose-400 border border-emerald-800/80 hover:border-rose-800'
                            : 'bg-rose-950/70 hover:bg-emerald-950 text-rose-400 hover:text-emerald-400 border border-rose-800/80 hover:border-emerald-800'
                        }`}
                        title={r.isModerated ? 'Click to Unpublish / Hide Review' : 'Click to Publish / Approve Review'}
                      >
                        {r.isModerated ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" /> Hidden
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Page {pagination.page} of {pagination.totalPages}</span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 font-semibold"
              >
                Previous
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 font-semibold"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
