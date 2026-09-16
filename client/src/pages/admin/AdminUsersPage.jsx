import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Ban, 
  Eye, 
  RefreshCw, 
  X,
  Phone,
  Mail,
  Calendar,
  Building2,
  FileCheck
} from 'lucide-react';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  // Detail Modal & Action State
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [statusActionTarget, setStatusActionTarget] = useState(null);
  const [actionReason, setActionReason] = useState('');
  const [isActionProcessing, setIsActionProcessing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter, page]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminApi.getAllUsers({
        role: roleFilter || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        search: search.trim() || undefined,
        page,
        limit: 15
      });
      setUsers(res.data.users || []);
      setPagination(res.data.pagination || { total: 0, totalPages: 1 });
    } catch (err) {
      console.error('Failed to load users:', err);
      setError(err.message || 'Unable to retrieve users directory.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleViewUser = async (userId) => {
    setIsDetailLoading(true);
    setSelectedUser(null);
    try {
      const res = await adminApi.getUserById(userId);
      setSelectedUser(res.data);
    } catch (err) {
      alert(err.message || 'Failed to fetch user details');
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!statusActionTarget) return;
    setIsActionProcessing(true);
    try {
      const newActive = !statusActionTarget.isActive;
      await adminApi.updateUserStatus(statusActionTarget._id, {
        isActive: newActive,
        reason: actionReason || (newActive ? 'Account restored by admin' : 'Administrative compliance suspension')
      });
      setStatusActionTarget(null);
      setActionReason('');
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to update account status');
    } finally {
      setIsActionProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Identity & Access
            </span>
            <span className="text-xs text-slate-400 font-medium">User Accounts Governance</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            User Accounts Directory
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-20 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-purple-500"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-all"
            >
              Search
            </button>
          </form>

          {/* Role Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {[
              { id: '', label: 'All Roles' },
              { id: 'customer', label: 'Customers' },
              { id: 'vendor', label: 'Vendors' },
              { id: 'admin', label: 'Admins' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setRoleFilter(tab.id);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  roleFilter === tab.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
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
          <span className="text-slate-500 font-semibold uppercase text-[10px]">Account Status:</span>
          {['ALL', 'ACTIVE', 'SUSPENDED'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-slate-800 text-purple-400 border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-500">
            Total Users: <strong className="text-white">{pagination.total}</strong>
          </span>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 text-purple-500 animate-spin" />
            <span>Loading user accounts from database...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-red-400">{error}</div>
        ) : users.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-xs">No users match the search criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-3">Role</th>
                  <th className="py-3.5 px-3">Contact</th>
                  <th className="py-3.5 px-3">KYC / Business</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3">Joined Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{u.name}</span>
                        {u.role === 'admin' && (
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" title="Administrator" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-500" />
                        <span>{u.email}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        u.role === 'admin'
                          ? 'bg-purple-950 text-purple-300 border border-purple-800'
                          : u.role === 'vendor'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="text-slate-300 flex items-center gap-1 font-mono text-[11px]">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>{u.phone || 'N/A'}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      {u.role === 'vendor' ? (
                        <div className="text-[11px]">
                          <span className="text-amber-400 font-semibold block truncate max-w-[140px]">
                            {u.vendorProfile?.businessName || 'Fleet Partner'}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            GST: {u.vendorProfile?.gstNumber || 'Unregistered'}
                          </span>
                        </div>
                      ) : u.customerProfile?.drivingLicenseNumber ? (
                        <div className="text-[11px] flex items-center gap-1 text-emerald-400 font-mono font-semibold">
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>{u.customerProfile.drivingLicenseNumber}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px]">No License</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      {u.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-400 text-[10px] font-bold border border-emerald-800/80">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-950/80 text-rose-400 text-[10px] font-bold border border-rose-800/80">
                          <Ban className="w-3 h-3" /> Suspended
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-slate-400 text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleViewUser(u._id)}
                          title="View Details"
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {u.role !== 'admin' && (
                          <button
                            onClick={() => setStatusActionTarget(u)}
                            title={u.isActive ? 'Suspend User' : 'Reactivate User'}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                              u.isActive
                                ? 'bg-rose-950/50 hover:bg-rose-900 text-rose-400 border border-rose-800/60'
                                : 'bg-emerald-950/50 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/60'
                            }`}
                          >
                            {u.isActive ? <Ban className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
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

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-5 right-5 p-1 rounded-xl text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 font-bold flex items-center justify-center text-lg border border-purple-500/30">
                {selectedUser.user.name[0].toUpperCase()}
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white">{selectedUser.user.name}</h3>
                <span className="text-xs text-slate-400 capitalize">{selectedUser.user.role} Account</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Email</span>
                <div className="font-medium text-slate-200 truncate">{selectedUser.user.email}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Phone</span>
                <div className="font-medium text-slate-200">{selectedUser.user.phone || 'Not provided'}</div>
              </div>
            </div>

            {selectedUser.user.role === 'customer' && (
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Customer Metrics</h4>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-950">
                    <span className="text-slate-500 text-[10px] block">Bookings</span>
                    <strong className="text-white text-base">{selectedUser.stats?.bookingsCount || 0}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950">
                    <span className="text-slate-500 text-[10px] block">Completed</span>
                    <strong className="text-emerald-400 text-base">{selectedUser.stats?.completedCount || 0}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950">
                    <span className="text-slate-500 text-[10px] block">Total Spent</span>
                    <strong className="text-purple-400 text-base">₹{(selectedUser.stats?.totalSpent || 0).toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>
            )}

            {selectedUser.user.role === 'vendor' && (
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Vendor Enterprise</h4>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-950">
                    <span className="text-slate-500 text-[10px] block">Fleet Size</span>
                    <strong className="text-white text-base">{selectedUser.stats?.fleetCount || 0}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950">
                    <span className="text-slate-500 text-[10px] block">Orders</span>
                    <strong className="text-indigo-400 text-base">{selectedUser.stats?.bookingsCount || 0}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950">
                    <span className="text-slate-500 text-[10px] block">Earnings</span>
                    <strong className="text-emerald-400 text-base">₹{(selectedUser.stats?.totalEarnings || 0).toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>
            )}

            <div className="text-right pt-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend / Reactivate Confirmation Dialog */}
      {statusActionTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              {statusActionTarget.isActive ? (
                <>
                  <Ban className="w-5 h-5 text-rose-500" />
                  <span>Suspend Account</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>Reactivate Account</span>
                </>
              )}
            </h3>

            <p className="text-xs text-slate-400">
              Are you sure you want to {statusActionTarget.isActive ? 'suspend' : 'reactivate'} the account for{' '}
              <strong className="text-white">{statusActionTarget.name}</strong> ({statusActionTarget.email})?
            </p>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400 uppercase">Reason / Moderation Note:</label>
              <textarea
                rows={2}
                placeholder="Optional notes for user notification..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setStatusActionTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={isActionProcessing}
                onClick={handleToggleStatus}
                className={`px-4 py-2 rounded-xl text-white text-xs font-bold ${
                  statusActionTarget.isActive
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isActionProcessing ? 'Updating...' : statusActionTarget.isActive ? 'Confirm Suspension' : 'Confirm Activation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
