import React, { useState, useEffect } from 'react';
import { vehicleApi } from '../../services/vehicleApi';
import { AddVehicleModal } from '../../features/vendor/AddVehicleModal';
import { CreateOfflineBookingModal } from '../../features/vendor/CreateOfflineBookingModal';
import { 
  Car, 
  Bike, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Wrench, 
  PowerOff,
  Star,
  MapPin,
  IndianRupee,
  Layers,
  CalendarCheck
} from 'lucide-react';

export const MyVehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [selectedVehicleForBooking, setSelectedVehicleForBooking] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, [statusFilter, searchTerm]);

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const res = await vehicleApi.getVendorVehicles({
        status: statusFilter,
        search: searchTerm
      });
      setVehicles(res.data.vehicles || []);
    } catch (err) {
      console.error('Failed to fetch vendor vehicles', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (vehicleId, newStatus) => {
    try {
      await vehicleApi.updateVehicleStatus(vehicleId, newStatus);
      setVehicles((prev) =>
        prev.map((v) => (v._id === vehicleId ? { ...v, status: newStatus } : v))
      );
    } catch (err) {
      alert('Failed to update vehicle status');
    }
  };

  const handleDelete = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle listing?')) return;
    try {
      await vehicleApi.deleteVehicle(vehicleId);
      setVehicles((prev) => prev.filter((v) => v._id !== vehicleId));
    } catch (err) {
      alert(err.message || 'Failed to delete vehicle');
    }
  };

  const availableCount = vehicles.filter((v) => v.status === 'AVAILABLE').length;
  const maintenanceCount = vehicles.filter((v) => v.status === 'MAINTENANCE').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900 dark:text-white">
            Fleet Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your vehicles, pricing plans, and synchronized online/offline availability.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => {
              setSelectedVehicleForBooking(vehicles[0]?._id || '');
              setIsOfflineModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all"
          >
            <CalendarCheck className="w-4 h-4" /> Walk-in Booking
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-accent-600 hover:bg-accent-700 text-white font-bold text-xs shadow-md hover:shadow-accent-500/25 transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Vehicle
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Fleet</span>
            <div className="font-heading text-2xl font-extrabold text-slate-900 dark:text-white">
              {vehicles.length}
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Ready to Rent</span>
            <div className="font-heading text-2xl font-extrabold text-emerald-600">
              {availableCount}
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Under Maintenance</span>
            <div className="font-heading text-2xl font-extrabold text-amber-600">
              {maintenanceCount}
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by brand, model, plate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          {['ALL', 'AVAILABLE', 'BOOKED', 'MAINTENANCE', 'INACTIVE'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicles Fleet List */}
      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-slate-500">Loading your fleet...</p>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <Car className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-heading text-lg font-bold text-slate-700 dark:text-slate-200">
            No Vehicles Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't listed any vehicles matching this filter yet. Add your first vehicle to start receiving bookings.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold text-xs shadow-md"
          >
            Add Vehicle Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <div
              key={v._id}
              className="glass-panel rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-subtle flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-800">
                <img
                  src={v.images?.[0]?.url || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80'}
                  alt={v.model}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold">
                  {v.registrationNumber}
                </div>
                <div className="absolute top-3 right-3">
                  <select
                    value={v.status}
                    onChange={(e) => handleStatusChange(v._id, e.target.value)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm focus:outline-none cursor-pointer ${
                      v.status === 'AVAILABLE'
                        ? 'bg-emerald-500 text-white'
                        : v.status === 'MAINTENANCE'
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-700 text-white'
                    }`}
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold text-brand-600 uppercase">
                      {v.categoryId?.name}
                    </span>
                    <span>{v.location?.city}</span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                    {v.brand} {v.model}
                  </h3>
                  <div className="text-xs text-slate-400">
                    {v.year} • {v.fuelType} • {v.transmission} • {v.seatingCapacity} Seater
                  </div>
                </div>

                {/* Pricing Plans Breakdown */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Hourly</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹{v.pricing?.hourlyRate}</span>
                  </div>
                  <div className="border-x border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block">12-Hour</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹{v.pricing?.rate12Hour}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">24-Hour</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹{v.pricing?.rate24Hour}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setSelectedVehicleForBooking(v._id);
                      setIsOfflineModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-700 dark:text-amber-300 text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" /> Walk-in
                  </button>

                  <button
                    onClick={() => handleDelete(v._id)}
                    className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    title="Delete vehicle"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Vehicle Modal */}
      <AddVehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onVehicleAdded={(newVehicle) => setVehicles([newVehicle, ...vehicles])}
      />

      {/* Offline Walk-in Booking Modal */}
      <CreateOfflineBookingModal
        isOpen={isOfflineModalOpen}
        onClose={() => setIsOfflineModalOpen(false)}
        vehicles={vehicles.filter((v) => v.status === 'AVAILABLE')}
        defaultVehicleId={selectedVehicleForBooking}
        onSuccess={() => {
          alert('Offline walk-in booking created! Slot has been locked out for online customers.');
        }}
      />
    </div>
  );
};
