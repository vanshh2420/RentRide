import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { authApi } from '../services/authApi';
import { NotificationDropdown } from '../features/notifications/NotificationDropdown';
import { 
  Car, 
  Calendar, 
  Menu, 
  X, 
  LogOut, 
  User, 
  Compass, 
  Sparkles,
  LayoutDashboard,
  ShieldCheck,
  Tag,
  Grid,
  Store,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

export const CustomerNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // Ignore network errors on logout
    }
    dispatch(logout());
    setProfileDropdownOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      {/* Role Switcher Top Banner for Vendor/Admin browsing Customer Storefront */}
      {isAuthenticated && user && user.role !== 'customer' && (
        <div className="bg-slate-950 text-white text-xs px-4 py-1.5 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300">
              Signed in as <strong className="capitalize text-white font-bold">{user.role}</strong> ({user.name})
            </span>
          </div>
          <Link
            to={user.role === 'admin' ? '/admin/dashboard' : '/vendor/dashboard'}
            className="inline-flex items-center gap-1.5 text-accent-400 hover:text-accent-300 font-bold hover:underline"
          >
            {user.role === 'admin' ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5" /> Return to Admin Panel
              </>
            ) : (
              <>
                <LayoutDashboard className="w-3.5 h-3.5" /> Return to Vendor Hub
              </>
            )}
          </Link>
        </div>
      )}

      {/* Main Navbar */}
      <nav className="glass-panel border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* LEFT: Brand Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-sky-600 to-accent-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
                <Car className="w-5 h-5 stroke-[2.4]" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-xl font-extrabold tracking-tight bg-gradient-to-r from-brand-600 via-sky-600 to-accent-500 bg-clip-text text-transparent">
                  RentRide
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 -mt-1">
                  Vehicle Marketplace
                </span>
              </div>
            </Link>

            {/* CENTER: Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <Link
                to="/explore"
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive('/explore')
                    ? 'text-brand-600 dark:text-brand-400 bg-brand-50/90 dark:bg-brand-950/60 shadow-xs'
                    : 'text-slate-700 hover:text-brand-600 hover:bg-slate-100/70 dark:text-slate-200 dark:hover:text-brand-400 dark:hover:bg-slate-800/60'
                }`}
              >
                Explore Rides
              </Link>
              <Link
                to="/categories"
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive('/categories')
                    ? 'text-brand-600 dark:text-brand-400 bg-brand-50/90 dark:bg-brand-950/60 shadow-xs'
                    : 'text-slate-700 hover:text-brand-600 hover:bg-slate-100/70 dark:text-slate-200 dark:hover:text-brand-400 dark:hover:bg-slate-800/60'
                }`}
              >
                Categories
              </Link>
              <Link
                to="/rental-plans"
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive('/rental-plans') || isActive('/pricing')
                    ? 'text-brand-600 dark:text-brand-400 bg-brand-50/90 dark:bg-brand-950/60 shadow-xs'
                    : 'text-slate-700 hover:text-brand-600 hover:bg-slate-100/70 dark:text-slate-200 dark:hover:text-brand-400 dark:hover:bg-slate-800/60'
                }`}
              >
                Rental Plans
              </Link>
              <Link
                to="/vendor/register"
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-accent-600 dark:text-accent-400 hover:bg-accent-50/80 dark:hover:bg-accent-950/40 transition-all flex items-center gap-1"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Become a Vendor</span>
              </Link>

              {/* Customer Bookings Shortcut */}
              {isAuthenticated && user && user.role === 'customer' && (
                <Link
                  to="/my-bookings"
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive('/my-bookings')
                      ? 'text-brand-600 dark:text-brand-400 bg-brand-50/90 dark:bg-brand-950/60 shadow-xs'
                      : 'text-slate-700 hover:text-brand-600 hover:bg-slate-100/70 dark:text-slate-200 dark:hover:text-brand-400 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>My Bookings</span>
                </Link>
              )}
            </div>

            {/* RIGHT: Auth & Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-3">
                  {/* Notifications */}
                  <NotificationDropdown />

                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/80 transition-all text-left"
                    >
                      <div className="w-8 h-8 rounded-xl overflow-hidden bg-gradient-to-tr from-brand-600 to-sky-600 flex items-center justify-center text-white font-extrabold text-xs shadow-xs">
                        {user.avatar?.url ? (
                          <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user.name ? user.name[0].toUpperCase() : 'U'
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900 dark:text-white max-w-[100px] truncate leading-tight">
                          {user.name}
                        </span>
                        <span className="text-[10px] text-slate-400 capitalize font-medium">
                          {user.role}
                        </span>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                    </button>

                    {/* Popover Menu */}
                    {profileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-fadeIn">
                        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        </div>

                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>My Profile & KYC</span>
                        </Link>

                        {user.role === 'customer' && (
                          <Link
                            to="/my-bookings"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span>My Bookings</span>
                          </Link>
                        )}

                        {user.role === 'vendor' && (
                          <Link
                            to="/vendor/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Vendor Hub Dashboard</span>
                          </Link>
                        )}

                        {user.role === 'admin' && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Admin Control Center</span>
                          </Link>
                        )}

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-brand-600 dark:text-slate-300 dark:hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md hover:shadow-hover transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex md:hidden items-center space-x-2">
              {isAuthenticated && <NotificationDropdown />}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Home
            </Link>
            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Explore Rides
            </Link>
            <Link
              to="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Categories
            </Link>
            <Link
              to="/rental-plans"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Rental Plans
            </Link>
            <Link
              to="/vendor/register"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-accent-600 dark:text-accent-400 hover:bg-accent-50 dark:hover:bg-accent-950/40"
            >
              Become a Vendor
            </Link>

            {isAuthenticated && user && user.role === 'customer' && (
              <Link
                to="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                My Bookings
              </Link>
            )}

            {isAuthenticated && (
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                My Profile & KYC
              </Link>
            )}

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 text-xs font-semibold text-slate-500">
                    Signed in as <span className="text-slate-900 dark:text-white font-bold">{user.name}</span> ({user.role})
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 dark:bg-slate-800 rounded-xl"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-4 py-2.5 text-xs font-bold text-white bg-brand-600 rounded-xl shadow-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
