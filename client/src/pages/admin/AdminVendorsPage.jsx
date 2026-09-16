import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';
import { 
  Building2, 
  Search, 
  CheckCircle, 
  XCircle, 
  Ban, 
  Eye, 
  RefreshCw, 
  X, 
  Car, 
  IndianRupee, 
  Calendar,
  AlertCircle,
  MapPin,
  FileText
} from 'lucide-react';

export const AdminVendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [approvalFilter, setApprovalFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  // Detail Modal & Actions
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [actionTarget, setActionTarget] = useState(null); // { vendor, type: 'APPROVE'|'REJECT'|'SUSPEND'|'ACTIVATE' }
  const [actionReason, setActionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, [approvalFilter, statusFilter, page]);

  const fetchVendors = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminApi.getAllVendors({
        isApproved: approvalFilter,
        status: statusFilter,
        search: search.trim() || undefined,
        page,
        limit: 15
      });
      setVendors(res.data.vendors || []);
      setPagination(res.data.pagination || { total: 0, totalPages: 1 });
    } catch (err) {
      console.error('Failed to load vendors:', err);
      setError(err.message || 'Unable to retrieve vendors.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchVendors();
  };

  const handleViewVendor = async (vendorId) => {
    try {
      const res = await adminApi.getVendorById(vendorId);
      setSelectedVendor(res.data);
    } catch (err) {
      alert(err.message || 'Failed to fetch vendor details');
    }
  };

  const handleConfirmAction = async () => {
    if (!actionTarget) return;
    setIsProcessing(true);
    const { vendor, type } = actionTarget;

    try {
      if (type === 'APPROVE') {
        await adminApi.approveVendor(vendor._id, { reason: actionReason });
      } else if (type === 'REJECT') {
        await adminApi.rejectVendor(vendor._id, { reason: actionReason || 'Requirements not met' });
      } else if (type === 'SUSPEND') {
        await adminApi.suspendVendor(vendor._id, { reason: actionReason || 'Compliance review' });
      } else if (type === 'ACTIVATE') {
        await adminApi.activateVendor(vendor._id, { reason: actionReason });
      }

      setActionTarget(null);
      setActionReason('');
      fetchVendors();
    } catch (err) {
      alert(err.message || 'Action failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Fleet Partners
            </span>
            <span className="text-xs text-slate-400 font-medium">Vendor Verification & Governance</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Vendor Partners Directory
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchVendors}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Vendors</span>
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
              placeholder="Search business, owner, GST, city..."
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

          {/* Approval Tabs */}
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {[
              { id: 'all', label: 'All Partners' },
              { id: 'false', label: 'Pending Approval' },
              { id: 'true', label: 'Approved' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setApprovalFilter(tab.id);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  approvalFilter === tab.id
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-filter: Status */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80 text-xs">
          <span className="text-slate-500 font-semibold uppercase text-[10px]">Operation Status:</span>
          {['ALL', 'ACTIVE', 'SUSPENDED'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-500">
            Total Vendors: <strong className="text-white">{pagination.total}</strong>
          </span>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 text-amber-500 animate-spin" />
            <span>Loading vendor partners...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-red-400">{error}</div>
        ) : vendors.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-xs">No vendors matching this filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Business / Owner</th>
                  <th className="py-3.5 px-3">Location & GST</th>
                  <th className="py-3.5 px-3">Fleet Size</th>
                  <th className="py-3.5 px-3">Revenue Earned</th>
                  <th className="py-3.5 px-3">Approval</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {vendors.map((v) => (
                  <tr key={v._id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{v.vendorProfile?.businessName || v.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Owner: {v.name} • {v.email}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="text-slate-300 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{v.vendorProfile?.address?.city || 'Madhya Pradesh'}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        GST: {v.vendorProfile?.gstNumber || 'N/A'}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{v.fleetMetrics?.totalVehicles || 0} Vehicles</span>
                      </div>
                      <span className="text-[10px] text-emerald-400">
                        {v.fleetMetrics?.activeVehicles || 0} live available
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-bold text-emerald-400 flex items-center gap-1">
                        <span>₹{(v.revenueMetrics?.totalRevenue || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {v.revenueMetrics?.totalBookings || 0} orders
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      {v.vendorProfile?.isApproved ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800">
                          <CheckCircle className="w-3 h-3" /> Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-400 text-[10px] font-bold border border-amber-800">
                          <AlertCircle className="w-3 h-3" /> Pending Review
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      {v.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/70 text-emerald-400 text-[10px] font-bold border border-emerald-800/60">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-950/70 text-rose-400 text-[10px] font-bold border border-rose-800/60">
                          Suspended
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleViewVendor(v._id)}
                          title="View Partner Details"
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {!v.vendorProfile?.isApproved ? (
                          <>
                            <button
                              onClick={() => setActionTarget({ vendor: v, type: 'APPROVE' })}
                              title="Approve Vendor"
                              className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => setActionTarget({ vendor: v, type: 'REJECT' })}
                              title="Reject Vendor"
                              className="px-2 py-1 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-400 text-[11px] font-bold border border-rose-800/60"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setActionTarget({ vendor: v, type: v.isActive ? 'SUSPEND' : 'ACTIVATE' })}
                            title={v.isActive ? 'Suspend Vendor' : 'Reactivate Vendor'}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                              v.isActive
                                ? 'bg-rose-950/50 hover:bg-rose-900 text-rose-400 border border-rose-800/60'
                                : 'bg-emerald-950/50 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/60'
                            }`}
                          >
                            {v.isActive ? <Ban className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
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

      {/* Vendor Details Drawer / Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedVendor(null)}
              className="absolute top-5 right-5 p-1 rounded-xl text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 font-bold flex items-center justify-center text-lg border border-amber-500/30">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white">
                  {selectedVendor.vendor.vendorProfile?.businessName || selectedVendor.vendor.name}
                </h3>
                <span className="text-xs text-slate-400">Owner: {selectedVendor.vendor.name} • {selectedVendor.vendor.email}</span>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Total Fleet</span>
                <div className="text-xl font-bold text-white">{selectedVendor.vehicles?.length || 0} Vehicles</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Orders Fulfilled</span>
                <div className="text-xl font-bold text-indigo-400">{selectedVendor.revenueSummary?.totalBookings || 0}</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Total Payouts</span>
                <div className="text-xl font-bold text-emerald-400">₹{(selectedVendor.revenueSummary?.totalEarnings || 0).toLocaleString('en-IN')}</div>
              </div>
            </div>

            {/* Fleet Listing Snapshot */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Registered Fleet Vehicles</h4>
              <div className="divide-y divide-slate-800/80 max-h-48 overflow-y-auto pr-1">
                {(selectedVendor.vehicles || []).length === 0 ? (
                  <p className="text-xs text-slate-500 py-3">No vehicles added yet by this partner.</p>
                ) : (
                  selectedVendor.vehicles.map((v) => (
                    <div key={v._id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white">{v.brand} {v.model} ({v.year})</span>
                        <span className="text-[10px] text-slate-500 uppercase font-mono block">Plate: {v.registrationNumber}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-white block">₹{v.pricing?.rate24Hour}/day</span>
                        <span className={`text-[10px] font-bold ${v.isApproved ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {v.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="text-right pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedVendor(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Confirmation Modal */}
      {actionTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <span>Confirm Vendor {actionTarget.type}</span>
            </h3>

            <p className="text-xs text-slate-400">
              Are you sure you want to perform <strong>{actionTarget.type}</strong> on{' '}
              <strong className="text-white">{actionTarget.vendor.vendorProfile?.businessName || actionTarget.vendor.name}</strong>?
            </p>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400 uppercase">Reason / Notification Message:</label>
              <textarea
                rows={2}
                placeholder="Message will be sent to the vendor via in-app notifications..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setActionTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={isProcessing}
                onClick={handleConfirmAction}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
              >
                {isProcessing ? 'Processing...' : 'Confirm Action'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
