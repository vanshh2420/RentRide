import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { vendorApi } from '../../services/vendorApi';
import { vehicleApi } from '../../services/vehicleApi';
import { maintenanceApi } from '../../services/maintenanceApi';
import { EarningsCard } from '../../features/vendor/EarningsCard';
import { CreateOfflineBookingModal } from '../../features/vendor/CreateOfflineBookingModal';
import { AddVehicleModal } from '../../features/vendor/AddVehicleModal';
import { VehicleHandoverModal } from '../../features/vendor/VehicleHandoverModal';
import { ScheduleMaintenanceModal } from '../../features/maintenance/ScheduleMaintenanceModal';
import { CompleteMaintenanceModal } from '../../features/maintenance/CompleteMaintenanceModal';
import { DemandForecastWidget } from '../../features/ai/DemandForecastWidget';
import { VendorEarningsCalculator } from '../../features/vendor/VendorEarningsCalculator';
import { ActiveRentalDashboard } from '../../features/trips/ActiveRentalDashboard';
import { 
  LayoutDashboard,
  Layers, 
  Car, 
  CheckCircle, 
  Clock, 
  Calendar, 
  User, 
  Phone, 
  CalendarCheck, 
  Plus, 
  Gauge, 
  IndianRupee, 
  AlertCircle,
  TrendingUp,
  Tag,
  ArrowRight,
  Wrench,
  Navigation,
  ShieldCheck,
  Filter
} from 'lucide-react';

export const VendorDashboardPage = ({ defaultWalkinOpen = false }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [bookingFilter, setBookingFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [maintenanceFilter, setMaintenanceFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(defaultWalkinOpen || location.pathname === '/vendor/walkin');
  const [isScheduleMaintenanceOpen, setIsScheduleMaintenanceOpen] = useState(false);
  const [completeMaintenanceRecord, setCompleteMaintenanceRecord] = useState(null);
  const [handoverModalBooking, setHandoverModalBooking] = useState(null);
  const [handoverMode, setHandoverMode] = useState('START_TRIP');
  const [activeTrackingBookingId, setActiveTrackingBookingId] = useState(null);

  // Determine active view tab based on route
  const getActiveTabFromPath = () => {
    const p = location.pathname;
    if (p.includes('/vendor/maintenance')) return 'maintenance';
    if (p.includes('/vendor/earnings')) return 'earnings';
    if (p.includes('/vendor/forecast')) return 'forecast';
    if (p.includes('/vendor/bookings')) return 'bookings';
    return 'overview';
  };

  const activeTab = getActiveTabFromPath();

  const handleCloseOfflineModal = () => {
    setIsOfflineModalOpen(false);
    if (location.pathname === '/vendor/walkin') {
      navigate('/vendor/dashboard');
    }
  };

  useEffect(() => {
    if (location.pathname === '/vendor/walkin' || defaultWalkinOpen) {
      setIsOfflineModalOpen(true);
    }
  }, [location.pathname, defaultWalkinOpen]);

  useEffect(() => {
    fetchDashboardData();
  }, [bookingFilter, typeFilter]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const results = await Promise.allSettled([
        vendorApi.getVendorStats(),
        vendorApi.getVendorBookings({ status: bookingFilter, bookingType: typeFilter }),
        vehicleApi.getVendorVehicles(),
        maintenanceApi.getVendorMaintenance()
      ]);

      const [statsRes, bookingsRes, vehiclesRes, maintenanceRes] = results;

      if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
        setStats(statsRes.value.data);
      } else {
        console.warn('Vendor stats load skipped/unavailable');
      }

      if (bookingsRes.status === 'fulfilled' && bookingsRes.value?.data) {
        setBookings(bookingsRes.value.data.bookings || []);
      }

      if (vehiclesRes.status === 'fulfilled' && vehiclesRes.value?.data) {
        setVehicles(vehiclesRes.value.data.vehicles || []);
      }

      if (maintenanceRes.status === 'fulfilled' && maintenanceRes.value?.data) {
        setMaintenanceRecords(maintenanceRes.value.data.maintenanceRecords || []);
      }
    } catch (err) {
      console.error('Failed to load vendor dashboard', err);
    } finally {
      setIsLoading(false);
    }
  };

  const openHandoverModal = (booking, mode) => {
    setHandoverModalBooking(booking);
    setHandoverMode(mode);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', path: '/vendor/dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'Fleet Bookings', path: '/vendor/bookings', icon: Layers },
    { id: 'maintenance', label: 'Maintenance Hub', path: '/vendor/maintenance', icon: Wrench },
    { id: 'earnings', label: 'Earnings & Payouts', path: '/vendor/earnings', icon: IndianRupee },
    { id: 'forecast', label: 'AI Demand Forecast', path: '/vendor/forecast', icon: TrendingUp },
  ];

  // Filtered maintenance records for the dedicated Maintenance Hub view
  const filteredMaintenance = maintenanceRecords.filter((m) => {
    if (maintenanceFilter === 'ALL') return true;
    return m.status === maintenanceFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200">
            Vendor Operations Hub
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Fleet Operations & Dispatch
          </h1>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => setIsScheduleMaintenanceOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Wrench className="w-4 h-4" /> Schedule Maintenance
          </button>

          <button
            onClick={() => setIsOfflineModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4" /> Walk-in Booking
          </button>

          <button
            onClick={() => setIsAddVehicleOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Vehicle
          </button>
        </div>
      </div>

      {/* Navigation Pill Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.id === 'maintenance' && maintenanceRecords.filter(m => m.status !== 'COMPLETED').length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {maintenanceRecords.filter(m => m.status !== 'COMPLETED').length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW                                                           */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Financial & Revenue Ledger Summary */}
          <EarningsCard
            grossRevenue={stats?.financialStats?.grossRevenue || 0}
            platformCommissionRate={0.12}
            settledAmount={stats?.financialStats?.settledAmount || 0}
          />

          {/* Operational KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                <span>Active Rides</span>
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping"></span>
              </div>
              <div className="font-heading text-2xl font-extrabold text-sky-600">
                {stats?.bookingStats?.activeRentals || 0}
              </div>
              <span className="text-[10px] text-slate-400">Currently on the road</span>
            </div>

            <div className="glass-panel p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                <span>Upcoming Pickups</span>
                <Clock className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="font-heading text-2xl font-extrabold text-emerald-600">
                {stats?.bookingStats?.upcomingRentals || 0}
              </div>
              <span className="text-[10px] text-slate-400">Confirmed for today/tomorrow</span>
            </div>

            <div className="glass-panel p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                <span>Available Fleet</span>
                <Car className="w-4 h-4 text-brand-600" />
              </div>
              <div className="font-heading text-2xl font-extrabold text-slate-900 dark:text-white">
                {stats?.fleetStats?.availableFleet || 0} / {stats?.fleetStats?.totalFleet || 0}
              </div>
              <span className="text-[10px] text-slate-400">Ready for instant booking</span>
            </div>

            <div className="glass-panel p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                <span>Completed Trips</span>
                <CheckCircle className="w-4 h-4 text-slate-400" />
              </div>
              <div className="font-heading text-2xl font-extrabold text-slate-900 dark:text-white">
                {stats?.bookingStats?.completedRentals || 0}
              </div>
              <span className="text-[10px] text-slate-400">Lifetime successfully returned</span>
            </div>
          </div>

          {/* Quick Peek: Active Fleet Bookings Preview */}
          <div className="glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-subtle">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                  Recent Dispatch Activity
                </h3>
                <p className="text-xs text-slate-500">Latest reservations across your registered fleet</p>
              </div>
              <button
                onClick={() => navigate('/vendor/bookings')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors cursor-pointer"
              >
                <span>View All Bookings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {bookings.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No recent fleet activity.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookings.slice(0, 3).map((b) => (
                  <div key={b._id} className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {b.vehicleId?.brand} {b.vehicleId?.model}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        b.status === 'CONFIRMED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : b.status === 'ACTIVE'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200 animate-pulse'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center justify-between">
                      <span>Customer: {b.customerId?.name || b.offlineCustomerDetails?.name || 'Walk-in'}</span>
                      <span className="font-bold text-emerald-600">₹{b.priceBreakdown?.vendorPayout}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(b.startDateTime).toLocaleDateString()} • {b.durationHours}h ({b.rentalPlan})
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Peek: AI Demand Forecast Overview */}
          <DemandForecastWidget defaultCity={vehicles[0]?.location?.city || 'Indore'} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FLEET BOOKINGS & DISPATCH                                          */}
      {/* ========================================================================= */}
      {activeTab === 'bookings' && (
        <div className="glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-subtle space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                Fleet Bookings & Vehicle Handover
              </h3>
              <p className="text-xs text-slate-500">
                Manage check-ins, record odometer readings, track active trips, and inspect returns.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={bookingFilter}
                onChange={(e) => setBookingFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
              >
                <option value="ALL">All Statuses</option>
                <option value="CONFIRMED">Confirmed / Upcoming</option>
                <option value="ACTIVE">Active (In Use)</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
              >
                <option value="ALL">All Channels</option>
                <option value="ONLINE">Online Platform</option>
                <option value="OFFLINE">Offline Walk-in</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-slate-500">Loading fleet bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No bookings matching the selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-3">Vehicle</th>
                    <th className="py-3 px-3">Customer / Channel</th>
                    <th className="py-3 px-3">Schedule</th>
                    <th className="py-3 px-3">Net Payout</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Handover Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {b.vehicleId?.brand} {b.vehicleId?.model}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400 uppercase">
                          {b.vehicleId?.registrationNumber} • #{b.bookingNumber}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {b.customerId?.name || b.offlineCustomerDetails?.name || 'Walk-in'}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                            b.bookingType === 'OFFLINE'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300'
                          }`}>
                            {b.bookingType}
                          </span>
                          <span>{b.customerId?.phone || b.offlineCustomerDetails?.phone}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-700 dark:text-slate-300">
                          {new Date(b.startDateTime).toLocaleDateString()} {new Date(b.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {b.durationHours}h ({b.rentalPlan})
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-heading font-extrabold text-emerald-600">
                          ₹{b.priceBreakdown?.vendorPayout}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <span>Gross: ₹{b.priceBreakdown?.subtotal}</span>
                          {(b.priceBreakdown?.dynamicMultiplier || b.priceBreakdown?.surgeMultiplier) && (b.priceBreakdown?.dynamicMultiplier || b.priceBreakdown?.surgeMultiplier) !== 1.0 && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {(b.priceBreakdown?.dynamicMultiplier || b.priceBreakdown?.surgeMultiplier)}x
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          b.status === 'CONFIRMED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : b.status === 'ACTIVE'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200 animate-pulse'
                            : b.status === 'COMPLETED'
                            ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        {b.status === 'CONFIRMED' && (
                          <button
                            onClick={() => openHandoverModal(b, 'START_TRIP')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                          >
                            Start Trip (Handover)
                          </button>
                        )}

                        {b.status === 'ACTIVE' && (
                          <div className="flex items-center gap-1.5 justify-end">
                            <button
                              onClick={() => setActiveTrackingBookingId(b._id)}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-600 dark:text-sky-400 font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                              title="View Live GPS Telemetry"
                            >
                              <Navigation className="w-3.5 h-3.5" /> Track Live
                            </button>
                            <button
                              onClick={() => openHandoverModal(b, 'COMPLETE_TRIP')}
                              className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                            >
                              End Trip (Inspect)
                            </button>
                          </div>
                        )}

                        {b.status === 'COMPLETED' && (
                          <span className="text-[10px] font-semibold text-slate-400">
                            {b.handoverDetails?.distanceDriven || 0} km driven
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: MAINTENANCE HUB                                                    */}
      {/* ========================================================================= */}
      {activeTab === 'maintenance' && (
        <div className="space-y-6">
          {/* Header & Status Summary */}
          <div className="glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white flex items-center gap-3">
                  <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <span>Fleet Maintenance & Service Blackouts</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Active service windows lock vehicle calendars and automatically prevent customer availability conflicts.
                </p>
              </div>

              <button
                onClick={() => setIsScheduleMaintenanceOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Schedule Service Window
              </button>
            </div>

            {/* Maintenance KPI summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Records</span>
                <span className="font-heading text-xl font-extrabold text-slate-900 dark:text-white mt-0.5 block">
                  {maintenanceRecords.length}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/40">
                <span className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400 block">Scheduled</span>
                <span className="font-heading text-xl font-extrabold text-amber-700 dark:text-amber-300 mt-0.5 block">
                  {maintenanceRecords.filter(m => m.status === 'SCHEDULED').length}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-900/40">
                <span className="text-[10px] font-bold uppercase text-sky-600 dark:text-sky-400 block">In Progress</span>
                <span className="font-heading text-xl font-extrabold text-sky-700 dark:text-sky-300 mt-0.5 block">
                  {maintenanceRecords.filter(m => m.status === 'IN_PROGRESS').length}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/40">
                <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block">Completed</span>
                <span className="font-heading text-xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-0.5 block">
                  {maintenanceRecords.filter(m => m.status === 'COMPLETED').length}
                </span>
              </div>
            </div>

            {/* Service Blackout Notice */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              <span>
                <strong>Automated Conflict Engine:</strong> Any scheduled or in-progress maintenance blackout dynamically marks the vehicle as unavailable in customer search and the Fare Calculator.
              </span>
            </div>
          </div>

          {/* Maintenance Records Table with Status Filters */}
          <div className="glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-subtle p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Filter Status:</span>
                {['ALL', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setMaintenanceFilter(st)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      maintenanceFilter === st
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {st === 'ALL' ? 'All Records' : st.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <span className="text-xs font-semibold text-slate-400">
                Showing {filteredMaintenance.length} records
              </span>
            </div>

            {filteredMaintenance.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No maintenance records found matching "{maintenanceFilter}".
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="py-3 px-3">Vehicle</th>
                      <th className="py-3 px-3">Service Details</th>
                      <th className="py-3 px-3">Blackout Window</th>
                      <th className="py-3 px-3">Estimated Cost</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredMaintenance.map((m) => (
                      <tr key={m._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {m.vehicleId?.brand} {m.vehicleId?.model}
                          </div>
                          <div className="font-mono text-[10px] text-slate-400 uppercase">
                            {m.vehicleId?.registrationNumber}
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{m.title}</div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold">{m.serviceType}</div>
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>
                              {new Date(m.startDate).toLocaleDateString()} – {new Date(m.endDate).toLocaleDateString()}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="font-heading font-extrabold text-slate-900 dark:text-white">
                            ₹{m.actualCost || m.estimatedCost}
                          </div>
                          {m.actualCost && <span className="text-[10px] text-emerald-600 font-semibold">Invoiced</span>}
                        </td>

                        <td className="py-3.5 px-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            m.status === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-700'
                              : m.status === 'IN_PROGRESS'
                              ? 'bg-amber-50 text-amber-700 animate-pulse'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            {m.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-right">
                          {m.status !== 'COMPLETED' && (
                            <button
                              onClick={() => setCompleteMaintenanceRecord(m)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                            >
                              Complete Service
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: EARNINGS & PAYOUTS                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'earnings' && (
        <div className="space-y-8">
          <div>
            <h2 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <IndianRupee className="w-6 h-6" />
              </div>
              <span>Vendor Earnings & Settlement Ledger</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Transparent 12% platform fee breakdown, automated ledger accounting, and payout schedules.
            </p>
          </div>

          {/* Financial & Revenue Ledger Summary */}
          <EarningsCard
            grossRevenue={stats?.financialStats?.grossRevenue || 0}
            platformCommissionRate={0.12}
            settledAmount={stats?.financialStats?.settledAmount || 0}
          />

          {/* Itemized Booking Payouts Table */}
          <div className="glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-subtle p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                  Itemized Booking Payouts & Commission
                </h3>
                <p className="text-xs text-slate-500">
                  Detailed ledger showing 12% platform commission and 88% net vendor payout per rental
                </p>
              </div>
              <span className="text-xs font-bold text-slate-400">{bookings.length} reservations</span>
            </div>

            {bookings.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No booking transactions recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="py-3 px-3">Booking ID</th>
                      <th className="py-3 px-3">Vehicle</th>
                      <th className="py-3 px-3">Rental Dates</th>
                      <th className="py-3 px-3">Channel</th>
                      <th className="py-3 px-3">Gross Total</th>
                      <th className="py-3 px-3">Platform Fee (12%)</th>
                      <th className="py-3 px-3">Net Payout (88%)</th>
                      <th className="py-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {bookings.map((b) => {
                      const gross = b.priceBreakdown?.subtotal || 0;
                      const platformFee = Math.round(gross * 0.12);
                      const netPayout = b.priceBreakdown?.vendorPayout || (gross - platformFee);

                      return (
                        <tr key={b._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                          <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                            #{b.bookingNumber}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {b.vehicleId?.brand} {b.vehicleId?.model}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                            {new Date(b.startDateTime).toLocaleDateString()} – {new Date(b.endDateTime).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                              b.bookingType === 'OFFLINE'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300'
                            }`}>
                              {b.bookingType}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                            ₹{gross.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-rose-600 dark:text-rose-400 font-medium">
                            -₹{platformFee.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 font-heading font-extrabold text-emerald-600">
                            ₹{netPayout.toLocaleString()}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              b.status === 'COMPLETED'
                                ? 'bg-emerald-50 text-emerald-700'
                                : b.status === 'ACTIVE'
                                ? 'bg-sky-50 text-sky-700'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Vendor Rental Economics Calculator */}
          <VendorEarningsCalculator defaultRate={80} defaultExtraKmRate={10} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: AI DEMAND FORECAST                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'forecast' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-accent-500/10 text-accent-600 dark:text-accent-400 border border-accent-500/20">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span>AI Fleet Demand Forecast & Dynamic Pricing</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Time-series predictive demand models, city utilization pressure indices, and dynamic surge recommendations.
            </p>
          </div>

          <DemandForecastWidget defaultCity={vehicles[0]?.location?.city || 'Indore'} />
        </div>
      )}

      {/* Modals */}
      <CreateOfflineBookingModal
        isOpen={isOfflineModalOpen}
        onClose={handleCloseOfflineModal}
        vehicles={vehicles.filter((v) => v.status === 'AVAILABLE')}
        onSuccess={() => {
          fetchDashboardData();
          handleCloseOfflineModal();
        }}
      />

      <AddVehicleModal
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
        onVehicleAdded={() => fetchDashboardData()}
      />

      <ScheduleMaintenanceModal
        isOpen={isScheduleMaintenanceOpen}
        onClose={() => setIsScheduleMaintenanceOpen(false)}
        vehicles={vehicles}
        onSuccess={() => fetchDashboardData()}
      />

      <CompleteMaintenanceModal
        isOpen={!!completeMaintenanceRecord}
        onClose={() => setCompleteMaintenanceRecord(null)}
        maintenance={completeMaintenanceRecord}
        onSuccess={() => fetchDashboardData()}
      />

      <VehicleHandoverModal
        isOpen={!!handoverModalBooking}
        onClose={() => setHandoverModalBooking(null)}
        booking={handoverModalBooking}
        mode={handoverMode}
        onSuccess={() => fetchDashboardData()}
      />

      {/* Live Fleet Trip Telemetry Modal */}
      {activeTrackingBookingId && (
        <ActiveRentalDashboard
          bookingId={activeTrackingBookingId}
          isOpen={!!activeTrackingBookingId}
          onClose={() => setActiveTrackingBookingId(null)}
          isVendor={true}
        />
      )}
    </div>
  );
};
