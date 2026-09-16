import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';
import { 
  IndianRupee, 
  Search, 
  Eye, 
  RefreshCw, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  CreditCard,
  Hash,
  FileText,
  RotateCcw
} from 'lucide-react';

export const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  // Detail Modal
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, [statusFilter, methodFilter, page]);

  const fetchPayments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminApi.getAllPayments({
        status: statusFilter,
        paymentMethod: methodFilter,
        search: search.trim() || undefined,
        page,
        limit: 15
      });
      setPayments(res.data.payments || []);
      setPagination(res.data.pagination || { total: 0, totalPages: 1 });
    } catch (err) {
      console.error('Failed to load payments:', err);
      setError(err.message || 'Unable to retrieve payment transactions.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPayments();
  };

  const handleViewPayment = async (paymentId) => {
    try {
      const res = await adminApi.getPaymentById(paymentId);
      setSelectedPayment(res.data.payment);
    } catch (err) {
      alert(err.message || 'Failed to fetch payment details');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Financial Governance
            </span>
            <span className="text-xs text-slate-400 font-medium">Gateway Settlements & Collections Audit</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Payment Transactions Audit
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchPayments}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Payments</span>
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
              placeholder="Search Razorpay order or payment ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-20 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all"
            >
              Search
            </button>
          </form>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {['ALL', 'SUCCESS', 'PENDING', 'REFUNDED', 'FAILED'].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Payment Method:</span>
            <select
              value={methodFilter}
              onChange={(e) => {
                setMethodFilter(e.target.value);
                setPage(1);
              }}
              className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-2.5 py-1"
            >
              <option value="ALL">All Methods</option>
              <option value="RAZORPAY">Razorpay Gateway</option>
              <option value="OFFLINE_CASH">Offline Cash</option>
              <option value="OFFLINE_COUNTER_UPI">Counter UPI</option>
            </select>
          </div>

          <span className="text-xs text-slate-500">
            Total Transactions: <strong className="text-white">{pagination.total}</strong>
          </span>
        </div>
      </div>

      {/* Payments Table */}
      <div className="rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin" />
            <span>Loading payment records from database...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-red-400">{error}</div>
        ) : payments.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-xs">No transactions recorded for these filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Gateway Reference</th>
                  <th className="py-3.5 px-3">Booking #</th>
                  <th className="py-3.5 px-3">Customer</th>
                  <th className="py-3.5 px-3">Amount</th>
                  <th className="py-3.5 px-3">Method</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3">Timestamp</th>
                  <th className="py-3.5 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-white text-[11px]">
                        {p.razorpayPaymentId || 'N/A'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Order: {p.razorpayOrderId || 'Local'}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-mono font-bold text-purple-400">
                        {p.bookingId?.bookingNumber || 'N/A'}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-medium text-white">{p.userId?.name || 'Walk-in Guest'}</div>
                      <div className="text-[10px] text-slate-400">{p.userId?.email || 'N/A'}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-bold text-emerald-400 text-sm">
                        ₹{p.amount?.toLocaleString('en-IN')}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 text-[10px] font-semibold border border-slate-800">
                        {p.paymentMethod}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        p.status === 'SUCCESS'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : p.status === 'REFUNDED'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : p.status === 'PENDING'
                          ? 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-[11px] text-slate-400">
                      {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleViewPayment(p._id)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                        title="View Full Payment Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
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

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedPayment(null)}
              className="absolute top-5 right-5 p-1 rounded-xl text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 font-bold flex items-center justify-center text-lg border border-emerald-500/30">
                <IndianRupee className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white">Payment Transaction</h3>
                <span className="text-xs text-slate-400">Gateway Confirmation Audit</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Amount Charged:</span>
                <span className="font-bold text-white text-sm">₹{selectedPayment.amount} {selectedPayment.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-emerald-400">{selectedPayment.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Razorpay Payment ID:</span>
                <span className="font-mono text-purple-400 font-semibold">{selectedPayment.razorpayPaymentId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Razorpay Order ID:</span>
                <span className="font-mono text-slate-300">{selectedPayment.razorpayOrderId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Channel:</span>
                <span className="font-semibold text-white">{selectedPayment.paymentMethod}</span>
              </div>
            </div>

            {selectedPayment.bookingId && (
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Linked Booking</h4>
                <div className="flex justify-between">
                  <span className="text-slate-400">Booking Number:</span>
                  <span className="font-mono font-bold text-purple-400">{selectedPayment.bookingId?.bookingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vehicle:</span>
                  <span className="text-white font-medium">
                    {selectedPayment.bookingId?.vehicleId?.brand} {selectedPayment.bookingId?.vehicleId?.model}
                  </span>
                </div>
              </div>
            )}

            <div className="text-right pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
