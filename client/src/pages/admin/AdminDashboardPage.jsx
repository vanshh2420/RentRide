import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/adminApi';
import { 
  ShieldCheck, 
  Car, 
  Users, 
  IndianRupee, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Building2,
  Calendar,
  ArrowUpRight,
  Check,
  X,
  Sparkles,
  BarChart3,
  PieChart as PieIcon,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessingId, setIsProcessingId] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminApi.getPlatformStats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
      setError(err.message || 'Unable to load administrative metrics.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveVehicle = async (vehicleId, isApproved) => {
    setIsProcessingId(vehicleId);
    try {
      await adminApi.approveOrRejectVehicle(vehicleId, {
        isApproved,
        status: isApproved ? 'AVAILABLE' : 'INACTIVE',
        rejectionReason: isApproved ? '' : 'Did not meet marketplace quality checks'
      });
      await fetchStats();
    } catch (err) {
      alert(err.message || 'Failed to update vehicle approval status');
    } finally {
      setIsProcessingId(null);
    }
  };

  const COLORS = ['#8B5CF6', '#6366F1', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#14B8A6'];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="w-8 h-8 text-purple-500 animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Aggregating live platform metrics from MongoDB...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 rounded-3xl bg-red-950/40 border border-red-800/60 text-center space-y-4 max-w-xl mx-auto">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Dashboard Metric Error</h3>
        <p className="text-xs text-red-300">{error}</p>
        <button
          onClick={fetchStats}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
        >
          Retry
        </button>
      </div>
    );
  }

  const { overview, financials, charts, recentBookings } = stats || {};

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Welcome & Quick Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Live Governance
            </span>
            <span className="text-xs text-slate-400 font-medium">Real-time Platform Activity</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Executive Analytics & Operations
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Data</span>
          </button>
          <Link
            to="/admin/vehicles"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all"
          >
            <Car className="w-3.5 h-3.5" />
            <span>Review Fleet ({overview?.pendingApprovals || 0})</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Gross GMV</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="font-heading text-xl lg:text-2xl font-black text-white">
            ₹{(financials?.totalGMV || 0).toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-slate-500">Completed & active sales</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Commission</span>
            <IndianRupee className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-heading text-xl lg:text-2xl font-black text-emerald-400">
            ₹{(financials?.totalPlatformCommission || 0).toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-slate-500">12% Net platform revenue</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Bookings</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <div className="font-heading text-xl lg:text-2xl font-black text-white">
            {overview?.totalBookings || 0}
          </div>
          <p className="text-[10px] text-blue-400 font-semibold">{overview?.activeRentals || 0} currently active</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Total Fleet</span>
            <Car className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="font-heading text-xl lg:text-2xl font-black text-white">
            {overview?.totalVehicles || 0}
          </div>
          <p className="text-[10px] text-emerald-400 font-semibold">{overview?.approvedVehicles || 0} live approved</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Vendors</span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-heading text-xl lg:text-2xl font-black text-white">
            {overview?.totalVendors || 0}
          </div>
          <p className="text-[10px] text-slate-500">Verified rental partners</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Approvals</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className={`font-heading text-xl lg:text-2xl font-black ${overview?.pendingApprovals > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
            {overview?.pendingApprovals || 0}
          </div>
          <p className="text-[10px] text-slate-500">Awaiting moderator check</p>
        </div>
      </div>

      {/* Interactive Charts Section (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 30-Day Revenue & GMV Trend */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                Revenue & Sales Timeline (Last 30 Days)
              </h3>
              <p className="text-xs text-slate-400">Daily gross booking value vs platform commission</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-purple-400">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> GMV (₹)
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Commission (₹)
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.bookingTrends || []} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="gmvGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="commGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="date" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, '']}
                />
                <Area type="monotone" dataKey="revenue" name="GMV" stroke="#8B5CF6" strokeWidth={2.5} fillOpacity={1} fill="url(#gmvGradient)" />
                <Area type="monotone" dataKey="commission" name="Commission" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#commGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fleet Category Distribution */}
        <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-indigo-400" />
              Fleet Category Distribution
            </h3>
            <p className="text-xs text-slate-400">Live breakdown by vehicle segment</p>
          </div>

          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts?.categoryDistribution || []}
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {(charts?.categoryDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-slate-400 font-semibold">Total Fleet</span>
              <span className="font-heading text-xl font-bold text-white">{overview?.totalVehicles || 0}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
            {(charts?.categoryDistribution || []).slice(0, 4).map((c, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span className="text-slate-400 truncate">{c.name}:</span>
                <span className="font-bold text-white">{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row: Top Vehicles & Top Vendors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Vehicles */}
        <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Car className="w-4 h-4 text-purple-400" />
              Top Performing Fleet Vehicles
            </h3>
            <Link to="/admin/vehicles" className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-800">
            {(charts?.topVehicles || []).length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No vehicle booking activity logged yet.</p>
            ) : (
              (charts?.topVehicles || []).map((v, i) => (
                <div key={v.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-[11px]">
                      #{i + 1}
                    </span>
                    <div>
                      <div className="font-bold text-white">{v.name}</div>
                      <div className="text-slate-400 uppercase font-mono text-[10px]">{v.plate}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-400 block">₹{v.revenue.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-slate-400">{v.bookingsCount} rentals</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Vendors */}
        <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-400" />
              Leading Fleet Partners
            </h3>
            <Link to="/admin/vendors" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-800">
            {(charts?.topVendors || []).length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No vendor sales recorded yet.</p>
            ) : (
              (charts?.topVendors || []).map((vend, i) => (
                <div key={vend.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-[11px]">
                      #{i + 1}
                    </span>
                    <div>
                      <div className="font-bold text-white">{vend.name}</div>
                      <div className="text-slate-400 text-[10px]">{vend.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-400 block">₹{vend.revenue.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-slate-400">{vend.bookingsCount} orders</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Platform Bookings Audit Trail */}
      <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              Recent Marketplace Bookings
            </h3>
            <p className="text-xs text-slate-400">Latest reservations across all Indian hubs</p>
          </div>
          <Link to="/admin/bookings" className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
            All Bookings <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Booking ID</th>
                <th className="py-3 px-3">Vehicle</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Vendor</th>
                <th className="py-3 px-3">Total Amount</th>
                <th className="py-3 px-3">Commission</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {(recentBookings || []).length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500">No bookings recorded yet.</td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-purple-400">{b.bookingNumber}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{b.vehicleId?.brand} {b.vehicleId?.model}</div>
                      <div className="text-[10px] text-slate-400">{b.vehicleId?.registrationNumber}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-white font-medium">{b.customerId?.name || 'Walk-in Guest'}</div>
                      <div className="text-[10px] text-slate-400">{b.customerId?.phone || 'N/A'}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {b.vendorId?.vendorProfile?.businessName || b.vendorId?.name}
                    </td>
                    <td className="py-3 px-3 font-bold text-white">
                      ₹{(b.priceBreakdown?.totalAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-400">
                      ₹{(b.priceBreakdown?.platformCommission || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
