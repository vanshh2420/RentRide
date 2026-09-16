import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { authApi } from '../services/authApi';
import { NotificationDropdown } from '../features/notifications/NotificationDropdown';
import { 
  LayoutDashboard, 
  Car, 
  Layers, 
  Wrench, 
  IndianRupee, 
  TrendingUp, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Compass, 
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Store
} from 'lucide-react';

export const VendorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // Ignore network errors
    }
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    {
      group: 'Operations',
      items: [
        { name: 'Dashboard', path: '/vendor/dashboard', icon: LayoutDashboard },
        { name: 'My Vehicles', path: '/vendor/vehicles', icon: Car },
        { name: 'Fleet Bookings', path: '/vendor/bookings', icon: Layers },
        { name: 'Maintenance Hub', path: '/vendor/maintenance', icon: Wrench },
      ]
    },
    {
      group: 'Analytics & Financials',
      items: [
        { name: 'Earnings & Payouts', path: '/vendor/earnings', icon: IndianRupee },
        { name: 'AI Demand Forecast', path: '/vendor/forecast', icon: TrendingUp },
      ]
    },
    {
      group: 'General',
      items: [
        { name: 'Vendor Profile', path: '/profile', icon: User },
        { name: 'View Storefront', path: '/', icon: Compass },
      ]
    }
  ];

  const isNavActive = (path) => {
    if (path === '/vendor/dashboard') {
      return location.pathname === '/vendor/dashboard' || location.pathname === '/vendor';
    }
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-950/95 border-r border-slate-800 z-50 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link to="/vendor/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <Store className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-heading text-lg font-extrabold text-white block">
                RentRide
              </span>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block -mt-1">
                Vendor Hub
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navItems.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                {group.group}
              </span>
              {group.items.map((item, idx) => {
                const Icon = item.icon;
                const active = isNavActive(item.path);

                return (
                  <Link
                    key={idx}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/10'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {active && <ChevronRight className="w-3.5 h-3.5" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer User Info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80">
          <div className="flex items-center justify-between">
            <Link to="/profile" className="flex items-center gap-2.5 min-w-0 group">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs flex-shrink-0">
                {user?.avatar?.url ? (
                  <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name ? user.name[0].toUpperCase() : 'V'
                )}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-white block truncate group-hover:text-amber-400">
                  {user?.name || 'Vendor'}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {user?.vendorProfile?.businessName || 'Fleet Operator'}
                </span>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-slate-950/90 border-b border-slate-800 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Vendor Portal
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {user?.vendorProfile?.businessName || 'Vehicle Dispatch Network'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NotificationDropdown />
            <Link
              to="/profile"
              className="w-8 h-8 rounded-full overflow-hidden bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs"
            >
              {user?.avatar?.url ? (
                <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name ? user.name[0].toUpperCase() : 'V'
              )}
            </Link>
          </div>
        </header>

        {/* Dynamic Nested Content */}
        <main className="flex-1 p-4 sm:p-8 bg-slate-900/60">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
