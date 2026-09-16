import React, { useState, useEffect } from 'react';
import { couponApi } from '../../services/couponApi';
import { 
  Tag, 
  Plus, 
  Trash2, 
  PowerOff, 
  CheckCircle, 
  Calendar, 
  IndianRupee, 
  X, 
  AlertCircle,
  Percent,
  TrendingUp
} from 'lucide-react';

export const CouponManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState(15);
  const [minBookingAmount, setMinBookingAmount] = useState(500);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState(250);
  const [validUntil, setValidUntil] = useState('');
  const [totalUsageLimit, setTotalUsageLimit] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const res = await couponApi.getAllCoupons();
      setCoupons(res.data.coupons || []);
    } catch (err) {
      console.error('Failed to fetch coupons', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        code: code.trim().toUpperCase(),
        description,
        discountType,
        discountValue: Number(discountValue),
        minBookingAmount: Number(minBookingAmount),
        maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
        validUntil: validUntil ? new Date(validUntil).toISOString() : undefined,
        totalUsageLimit: Number(totalUsageLimit)
      };

      const res = await couponApi.createCoupon(payload);
      setCoupons([res.data.coupon, ...coupons]);
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create coupon');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await couponApi.toggleCouponStatus(id);
      setCoupons(coupons.map((c) => (c._id === id ? res.data.coupon : c)));
    } catch (err) {
      alert('Failed to update coupon status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await couponApi.deleteCoupon(id);
      setCoupons(coupons.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete coupon');
    }
  };

  const resetForm = () => {
    setCode('');
    setDescription('');
    setDiscountType('PERCENTAGE');
    setDiscountValue(15);
    setMinBookingAmount(500);
    setMaxDiscountAmount(250);
    setValidUntil('');
    setTotalUsageLimit(100);
    setErrorMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-accent-500" /> Platform Discount & Promo Coupons
          </h2>
          <p className="text-xs text-slate-500">
            Create promotional coupon codes with usage caps and minimum booking thresholds.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      {/* Coupons Table / Grid */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading promo coupons...</div>
      ) : coupons.length === 0 ? (
        <div className="p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
          No promotional coupons created yet. Click "Create Coupon" to launch your first promotion.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((c) => (
            <div
              key={c._id}
              className={`p-5 rounded-2xl border transition-all ${
                c.isActive
                  ? 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-subtle'
                  : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-sm font-extrabold text-brand-600 dark:text-brand-400 px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-950/80 border border-brand-200">
                    {c.code}
                  </span>
                  <p className="text-xs text-slate-500 mt-2 font-medium">{c.description || 'General promo discount'}</p>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleToggleStatus(c._id)}
                    className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                      c.isActive
                        ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                        : 'text-slate-400 hover:bg-slate-100'
                    }`}
                    title={c.isActive ? 'Active (Click to disable)' : 'Inactive (Click to enable)'}
                  >
                    <PowerOff className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(c._id)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    title="Delete coupon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Benefit:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT OFF`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Min Booking / Cap:</span>
                  <span>₹{c.minBookingAmount} {c.maxDiscountAmount ? `/ Max ₹${c.maxDiscountAmount}` : ''}</span>
                </div>

                <div className="flex justify-between">
                  <span>Usage Count:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {c.usageCount} / {c.totalUsageLimit} redeemed
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Expires:</span>
                  <span>{new Date(c.validUntil).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                Create New Platform Coupon
              </h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Coupon Code</label>
                  <input
                    type="text"
                    placeholder="e.g. MONSOON30"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono uppercase font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. 15% discount on all weekend bookings"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    {discountType === 'PERCENTAGE' ? 'Discount %' : 'Discount ₹'}
                  </label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Min Booking (₹)</label>
                  <input
                    type="number"
                    value={minBookingAmount}
                    onChange={(e) => setMinBookingAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    placeholder="Optional"
                    value={maxDiscountAmount}
                    onChange={(e) => setMaxDiscountAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Total Usage Limit</label>
                  <input
                    type="number"
                    value={totalUsageLimit}
                    onChange={(e) => setTotalUsageLimit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Expiration Date</label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
