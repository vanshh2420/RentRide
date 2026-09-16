import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';
import { 
  Wrench, 
  Search, 
  RefreshCw, 
  Car, 
  Calendar, 
  IndianRupee, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  Building2,
  Phone
} from 'lucide-react';

export const AdminMaintenancePage = () => {
  const [maintenance, setMaintenance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  useEffect(() => {
    fetchMaintenance();
  }, [statusFilter, typeFilter, page]);

  const fetchMaintenance = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminApi.getAllMaintenance({
        status: statusFilter,
        maintenanceType: typeFilter,
        search: search.trim() || undefined,
        page,
        limit: 15
      });
      setMaintenance(res.data.maintenance || []);
      setPagination(res.data.pagination || { total: 0, totalPages: 1 });
    } catch (err) {
      console.error('Failed to load maintenance records:', err);
      setError(err.message || 'Unable to retrieve fleet maintenance records.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchMaintenance();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Fleet Health
            </span>
            <span className="text-xs text-slate-400 font-medium">Service Schedules & Roadworthiness Audit</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Fleet Maintenance Records
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchMaintenance}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Maintenance</span>
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
              placeholder="Search maintenance description or issue..."
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

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {['ALL', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED'].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
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
            <span className="text-slate-500 text-[10px] uppercase font-bold">Service Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-2.5 py-1"
            >
              <option value="ALL">All Maintenance Types</option>
              <option value="routine">Routine Service</option>
              <option value="repair">Mechanical Repair</option>
              <option value="inspection">Safety Inspection</option>
              <option value="accident">Accident Restoration</option>
              <option value="cleaning">Deep Cleaning</option>
            </select>
          </div>

          <span className="text-xs text-slate-500">
            Total Records: <strong className="text-white">{pagination.total}</strong>
          </span>
        </div>
      </div>

      {/* Maintenance Table */}
      <div className="rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 text-amber-500 animate-spin" />
            <span>Loading maintenance logs...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-red-400">{error}</div>
        ) : maintenance.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-xs">No maintenance records logged for these filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Vehicle</th>
                  <th className="py-3.5 px-3">Type & Details</th>
                  <th className="py-3.5 px-3">Vendor</th>
                  <th className="py-3.5 px-3">Cost</th>
                  <th className="py-3.5 px-3">Service Center</th>
                  <th className="py-3.5 px-3">Timeline</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {maintenance.map((m) => (
                  <tr key={m._id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">
                        {m.vehicleId?.brand} {m.vehicleId?.model}
                      </div>
                      <div className="text-[10px] text-purple-400 font-mono font-bold">
                        Plate: {m.vehicleId?.registrationNumber}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900 text-amber-400 text-[10px] font-bold uppercase border border-slate-800 inline-block mb-1">
                        {m.maintenanceType}
                      </span>
                      <p className="text-slate-300 text-[11px] max-w-xs truncate">{m.description}</p>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-medium text-white truncate max-w-[130px]">
                        {m.vendorId?.vendorProfile?.businessName || m.vendorId?.name}
                      </div>
                      <div className="text-[10px] text-slate-500">{m.vendorId?.phone}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-bold text-emerald-400">
                        ₹{m.cost?.toLocaleString('en-IN') || 0}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-[11px]">
                      <div className="text-slate-200 font-medium">
                        {m.serviceCenterDetails?.name || 'Authorized Service'}
                      </div>
                      <div className="text-[10px] text-slate-500">{m.serviceCenterDetails?.contact || 'N/A'}</div>
                    </td>

                    <td className="py-3.5 px-3 text-[11px] text-slate-400">
                      <div>Start: {new Date(m.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                      <div className="text-[10px] text-slate-500">
                        Target: {new Date(m.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        m.status === 'COMPLETED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : m.status === 'IN_PROGRESS'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                      }`}>
                        {m.status}
                      </span>
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
