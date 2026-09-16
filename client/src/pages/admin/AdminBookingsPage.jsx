import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';
import { 
  Calendar, 
  Search, 
  Eye, 
  RefreshCw, 
  X, 
  Car, 
  IndianRupee, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck,
  MapPin,
  FileText,
  CreditCard,
  User,
  ArrowRight
} from 'lucide-react';

export const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('ALL');
  const [bookingTypeFilter, setBookingTypeFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  // Detail Modal
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, paymentStatusFilter, bookingTypeFilter, page]);

  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminApi.getAllBookings({
        status: statusFilter,
        paymentStatus: paymentStatusFilter,
        bookingType: bookingTypeFilter,
        search: search.trim() || undefined,
        page,
        limit: 15
      });
      setBookings(res.data.bookings || []);
      setPagination(res.data.pagination || { total: 0, totalPages: 1 });
    } catch (err) {
      console.error('Failed to load bookings:', err);
      setError(err.message || 'Unable to retrieve global bookings audit trail.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBookings();
  };

  const handleViewBooking = async (bookingId) => {
    try {
      const res = await adminApi.getBookingById(bookingId);
      setSelectedBooking(res.data);
    } catch (err) {
      alert(err.message || 'Failed to fetch booking details');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Operations & Audit
            </span>
            <span className="text-xs text-slate-400 font-medium">Global Marketplace Reservations</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Bookings Audit Log
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchBookings}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Bookings</span>
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
              placeholder="Search booking #, customer name, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-20 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all"
            >
              Search
            </button>
          </form>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {['ALL', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Payment Status:</span>
              <select
                value={paymentStatusFilter}
                onChange={(e) => {
                  setPaymentStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-2.5 py-1"
              >
                <option value="ALL">All Payments</option>
                <option value="SUCCESS">SUCCESS</option>
                <option value="PENDING">PENDING</option>
                <option value="REFUNDED">REFUNDED</option>
                <option value="FAILED">FAILED</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Booking Channel:</span>
              <select
                value={bookingTypeFilter}
                onChange={(e) => {
                  setBookingTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-2.5 py-1"
              >
                <option value="ALL">All Channels</option>
                <option value="ONLINE">Online Platform</option>
                <option value="OFFLINE">Counter Walk-in</option>
              </select>
            </div>
          </div>

          <span className="text-xs text-slate-500">
            Total Audited: <strong className="text-white">{pagination.total}</strong>
          </span>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
            <span>Loading bookings audit trail...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-red-400">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-xs">No bookings found for these filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Booking #</th>
                  <th className="py-3.5 px-3">Vehicle</th>
                  <th className="py-3.5 px-3">Customer</th>
                  <th className="py-3.5 px-3">Vendor</th>
                  <th className="py-3.5 px-3">Schedule</th>
                  <th className="py-3.5 px-3">Fare / Commission</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-purple-400 text-xs block">
                        {b.bookingNumber}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">
                        {b.bookingType} • {b.rentalPlan}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white">
                        {b.vehicleId?.brand} {b.vehicleId?.model}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Plate: {b.vehicleId?.registrationNumber}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-medium text-white">
                        {b.customerId?.name || b.offlineCustomer?.name || 'Walk-in Guest'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {b.customerId?.phone || b.offlineCustomer?.phone || 'N/A'}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="text-slate-300 truncate max-w-[140px]">
                        {b.vendorId?.vendorProfile?.businessName || b.vendorId?.name}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-[11px] text-slate-400">
                      <div>{new Date(b.startDateTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                      <div className="text-[10px] text-slate-500">Duration: {b.durationHours} hrs</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white">
                        ₹{(b.priceBreakdown?.totalAmount || 0).toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-emerald-400 font-semibold">
                        Comm: ₹{(b.priceBreakdown?.platformCommission || 0).toLocaleString('en-IN')}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        b.status === 'COMPLETED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : b.status === 'ACTIVE'
                          ? 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                          : b.status === 'CONFIRMED'
                          ? 'bg-blue-950 text-blue-400 border border-blue-800'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {b.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleViewBooking(b._id)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                        title="View Full Booking Breakdown"
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

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-5 right-5 p-1 rounded-xl text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center text-lg border border-blue-500/30">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white">
                  Booking #{selectedBooking.booking.bookingNumber}
                </h3>
                <span className="text-xs text-slate-400">
                  Created on {new Date(selectedBooking.booking.createdAt).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Financial Ledger Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
              <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-2">
                Settlement Financial Breakdown
              </h4>
              <div className="flex justify-between text-slate-400">
                <span>Rental Base Subtotal:</span>
                <span className="font-bold text-white">₹{selectedBooking.booking.priceBreakdown?.subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Platform Convenience Fee:</span>
                <span className="font-bold text-white">₹{selectedBooking.booking.priceBreakdown?.platformFee}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST Tax (18%):</span>
                <span className="font-bold text-white">₹{selectedBooking.booking.priceBreakdown?.taxAmount}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Refundable Security Deposit:</span>
                <span className="font-bold text-emerald-400">₹{selectedBooking.booking.priceBreakdown?.securityDeposit}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm">
                <span className="text-white">Total Customer Paid:</span>
                <span className="text-purple-400">₹{selectedBooking.booking.priceBreakdown?.totalAmount}</span>
              </div>
              <div className="pt-2 border-t border-slate-800/60 flex justify-between text-xs">
                <span className="text-emerald-400 font-semibold">Net Platform Commission (12%):</span>
                <span className="font-bold text-emerald-400">₹{selectedBooking.booking.priceBreakdown?.platformCommission}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-semibold">Vendor Partner Payout:</span>
                <span className="font-bold text-slate-200">₹{selectedBooking.booking.priceBreakdown?.vendorPayout}</span>
              </div>
            </div>

            {/* Parties Summary */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Customer</span>
                <div className="font-bold text-white">
                  {selectedBooking.booking.customerId?.name || selectedBooking.booking.offlineCustomer?.name}
                </div>
                <div className="text-[11px] text-slate-400">
                  {selectedBooking.booking.customerId?.email || selectedBooking.booking.offlineCustomer?.phone}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Vendor Partner</span>
                <div className="font-bold text-white">
                  {selectedBooking.booking.vendorId?.vendorProfile?.businessName || selectedBooking.booking.vendorId?.name}
                </div>
                <div className="text-[11px] text-slate-400">{selectedBooking.booking.vendorId?.phone}</div>
              </div>
            </div>

            <div className="text-right pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedBooking(null)}
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
