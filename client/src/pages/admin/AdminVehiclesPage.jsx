import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';
import { 
  Car, 
  Search, 
  CheckCircle, 
  XCircle, 
  Check, 
  X, 
  Eye, 
  RefreshCw, 
  AlertCircle, 
  MapPin, 
  IndianRupee, 
  Fuel, 
  Gauge, 
  Users as UsersIcon,
  PowerOff,
  Power
} from 'lucide-react';

export const AdminVehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [approvalFilter, setApprovalFilter] = useState('false'); // default to pending
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  // Detail Modal & Actions
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [rejectModalTarget, setRejectModalTarget] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessingId, setIsProcessingId] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, [approvalFilter, statusFilter, cityFilter, page]);

  const fetchVehicles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminApi.getAllVehicles({
        isApproved: approvalFilter,
        status: statusFilter,
        city: cityFilter !== 'ALL' ? cityFilter : undefined,
        search: search.trim() || undefined,
        page,
        limit: 15
      });
      setVehicles(res.data.vehicles || []);
      setPagination(res.data.pagination || { total: 0, totalPages: 1 });
    } catch (err) {
      console.error('Failed to load vehicles:', err);
      setError(err.message || 'Unable to retrieve vehicles fleet.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchVehicles();
  };

  const handleApprove = async (vehicleId) => {
    setIsProcessingId(vehicleId);
    try {
      await adminApi.approveVehicle(vehicleId);
      fetchVehicles();
    } catch (err) {
      alert(err.message || 'Failed to approve vehicle');
    } finally {
      setIsProcessingId(null);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectModalTarget) return;
    setIsProcessingId(rejectModalTarget._id);
    try {
      await adminApi.rejectVehicle(rejectModalTarget._id, {
        rejectionReason: rejectionReason || 'Listing did not meet marketplace vehicle standards'
      });
      setRejectModalTarget(null);
      setRejectionReason('');
      fetchVehicles();
    } catch (err) {
      alert(err.message || 'Failed to reject vehicle');
    } finally {
      setIsProcessingId(null);
    }
  };

  const handleToggleActive = async (vehicle) => {
    setIsProcessingId(vehicle._id);
    try {
      if (vehicle.status === 'AVAILABLE') {
        await adminApi.deactivateVehicle(vehicle._id);
      } else {
        await adminApi.activateVehicle(vehicle._id);
      }
      fetchVehicles();
    } catch (err) {
      alert(err.message || 'Failed to toggle status');
    } finally {
      setIsProcessingId(null);
    }
  };

  const handleViewVehicle = async (vehicleId) => {
    try {
      const res = await adminApi.getVehicleById(vehicleId);
      setSelectedVehicle(res.data);
    } catch (err) {
      alert(err.message || 'Failed to load vehicle details');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Fleet Governance
            </span>
            <span className="text-xs text-slate-400 font-medium">Marketplace Quality Assurance & Visibility</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Fleet Listings & Approvals
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchVehicles}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Fleet</span>
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
              placeholder="Search brand, model, license plate..."
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

          {/* Queue Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {[
              { id: 'false', label: 'Pending Approvals Queue' },
              { id: 'true', label: 'Approved Fleet' },
              { id: 'all', label: 'All Fleet' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setApprovalFilter(tab.id);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  approvalFilter === tab.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* City and Status Sub-filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 text-[10px] uppercase font-bold">City:</span>
              <select
                value={cityFilter}
                onChange={(e) => {
                  setCityFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-2.5 py-1"
              >
                <option value="ALL">All Hubs</option>
                <option value="Indore">Indore</option>
                <option value="Bhopal">Bhopal</option>
                <option value="Gwalior">Gwalior</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-2.5 py-1"
              >
                <option value="ALL">All Statuses</option>
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="BOOKED">BOOKED</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="PENDING_APPROVAL">PENDING_APPROVAL</option>
              </select>
            </div>
          </div>

          <span className="text-xs text-slate-500">
            Total in Queue: <strong className="text-white">{pagination.total}</strong>
          </span>
        </div>
      </div>

      {/* Vehicle Grid Display */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-6 h-6 text-purple-500 animate-spin" />
          <span>Querying marketplace fleet from MongoDB...</span>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-xs text-red-400">{error}</div>
      ) : vehicles.length === 0 ? (
        <div className="p-16 text-center text-slate-500 text-xs rounded-3xl bg-slate-950/80 border border-slate-800">
          No vehicles found matching the selected filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <div
              key={v._id}
              className="rounded-3xl bg-slate-950/80 border border-slate-800 p-5 space-y-4 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all group"
            >
              <div className="space-y-3">
                {/* Image & Badges */}
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900">
                  <img
                    src={v.images?.[0]?.url || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80'}
                    alt={v.model}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-black/60 text-white backdrop-blur-md border border-white/20">
                      {v.categoryId?.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-950/80 text-purple-300 border border-purple-800/80">
                      {v.location?.city}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    {v.isApproved ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-950/90 text-emerald-400 border border-emerald-800 backdrop-blur-md flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Live
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-950/90 text-amber-400 border border-amber-800 backdrop-blur-md flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Pending Review
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Registration */}
                <div>
                  <h3 className="font-heading text-lg font-bold text-white tracking-tight">
                    {v.brand} {v.model} <span className="text-slate-500 font-normal">({v.year})</span>
                  </h3>
                  <div className="font-mono text-xs text-purple-400 font-bold uppercase mt-0.5">
                    Plate: {v.registrationNumber}
                  </div>
                </div>

                {/* Specs Pill Summary */}
                <div className="flex items-center gap-3 text-[11px] text-slate-400 py-1">
                  <span className="flex items-center gap-1 capitalize"><Fuel className="w-3.5 h-3.5 text-slate-500" /> {v.fuelType}</span>
                  <span className="flex items-center gap-1 capitalize"><Gauge className="w-3.5 h-3.5 text-slate-500" /> {v.transmission}</span>
                  <span className="flex items-center gap-1"><UsersIcon className="w-3.5 h-3.5 text-slate-500" /> {v.seatingCapacity} seats</span>
                </div>

                {/* Rates & Vendor Card */}
                <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Vendor Partner:</span>
                    <span className="font-semibold text-slate-200 truncate max-w-[150px]">
                      {v.vendorId?.vendorProfile?.businessName || v.vendorId?.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Tariff:</span>
                    <span className="font-bold text-emerald-400">
                      ₹{v.pricing?.hourlyRate}/hr • ₹{v.pricing?.rate24Hour}/day
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => handleViewVehicle(v._id)}
                  title="View Specs & History"
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>

                {!v.isApproved ? (
                  <>
                    <button
                      disabled={isProcessingId === v._id}
                      onClick={() => handleApprove(v._id)}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Check className="w-4 h-4" /> Approve Listing
                    </button>
                    <button
                      disabled={isProcessingId === v._id}
                      onClick={() => setRejectModalTarget(v)}
                      className="px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-400 text-xs font-bold border border-rose-800/60 transition-colors"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-between">
                    <button
                      disabled={isProcessingId === v._id}
                      onClick={() => handleToggleActive(v)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                        v.status === 'AVAILABLE'
                          ? 'bg-rose-950/60 hover:bg-rose-900 text-rose-400 border border-rose-800/60'
                          : 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/60'
                      }`}
                    >
                      {v.status === 'AVAILABLE' ? (
                        <>
                          <PowerOff className="w-3.5 h-3.5" /> Deactivate
                        </>
                      ) : (
                        <>
                          <Power className="w-3.5 h-3.5" /> Activate
                        </>
                      )}
                    </button>

                    <button
                      disabled={isProcessingId === v._id}
                      onClick={() => setRejectModalTarget(v)}
                      className="text-xs text-rose-400 hover:text-rose-300 hover:underline font-semibold"
                    >
                      Revoke Approval
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vehicle Specs & History Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedVehicle(null)}
              className="absolute top-5 right-5 p-1 rounded-xl text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 flex-shrink-0">
                <img
                  src={selectedVehicle.vehicle.images?.[0]?.url || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80'}
                  alt={selectedVehicle.vehicle.model}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white">
                  {selectedVehicle.vehicle.brand} {selectedVehicle.vehicle.model} ({selectedVehicle.vehicle.year})
                </h3>
                <span className="text-xs text-purple-400 font-mono font-bold block">
                  Plate: {selectedVehicle.vehicle.registrationNumber} • {selectedVehicle.vehicle.location?.city}
                </span>
              </div>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Fuel</span>
                <div className="font-bold text-white capitalize">{selectedVehicle.vehicle.fuelType}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Transmission</span>
                <div className="font-bold text-white capitalize">{selectedVehicle.vehicle.transmission}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Hourly Rate</span>
                <div className="font-bold text-emerald-400">₹{selectedVehicle.vehicle.pricing?.hourlyRate}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Deposit</span>
                <div className="font-bold text-white">₹{selectedVehicle.vehicle.pricing?.securityDeposit}</div>
              </div>
            </div>

            {/* Recent Orders on this vehicle */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Vehicle Bookings</h4>
              <div className="divide-y divide-slate-800 max-h-36 overflow-y-auto">
                {(selectedVehicle.recentBookings || []).length === 0 ? (
                  <p className="text-xs text-slate-500 py-3">No bookings yet recorded for this vehicle.</p>
                ) : (
                  selectedVehicle.recentBookings.map((b) => (
                    <div key={b._id} className="py-2 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-purple-400">{b.bookingNumber}</span>
                        <span className="text-slate-400 text-[11px] block">{b.customerId?.name || 'Walk-in Guest'}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-white block">₹{b.priceBreakdown?.totalAmount}</span>
                        <span className="text-[10px] text-slate-400">{b.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="text-right pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedVehicle(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection / Revocation Modal with Reason */}
      {rejectModalTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-500" />
              <span>Reject / Revoke Vehicle Listing</span>
            </h3>

            <p className="text-xs text-slate-400">
              Please provide a reason for rejecting{' '}
              <strong className="text-white">{rejectModalTarget.brand} {rejectModalTarget.model}</strong> ({rejectModalTarget.registrationNumber}). This will be sent directly to the vendor partner.
            </p>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400 uppercase">Reason for Rejection:</label>
              <textarea
                rows={3}
                placeholder="e.g. Incomplete RC document, low image quality, or pricing irregularities..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModalTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={isProcessingId === rejectModalTarget._id}
                onClick={handleRejectConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                {isProcessingId === rejectModalTarget._id ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
