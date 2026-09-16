import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { authApi } from '../services/authApi';
import { NotificationDropdown } from '../features/notifications/NotificationDropdown';
import { 
  Car, 
  Bike, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Calendar, 
  Menu, 
  X, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // Ignore network errors
    }
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 dark:border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <Car className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl font-extrabold tracking-tight bg-gradient-to-r from-brand-600 via-sky-600 to-accent-500 bg-clip-text text-transparent">
                RentRide
              </span>
              <span className="text-[10px] font-medium tracking-wider uppercase text-slate-500 -mt-1">
                Vehicle Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/explore"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-100/80 dark:text-slate-200 dark:hover:text-brand-400 dark:hover:bg-slate-800/60 transition-colors"
            >
              Explore Fleet
            </Link>
            <Link
              to="/categories"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-100/80 dark:text-slate-200 dark:hover:text-brand-400 dark:hover:bg-slate-800/60 transition-colors"
            >
              Categories
            </Link>
            <Link
              to="/rental-plans"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-100/80 dark:text-slate-200 dark:hover:text-brand-400 dark:hover:bg-slate-800/60 transition-colors"
            >
              Rental Plans
            </Link>
            <Link
              to="/vendor/register"
              className="px-3 py-2 rounded-lg text-sm font-medium text-accent-600 hover:text-accent-700 hover:bg-accent-50 dark:text-accent-400 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              List Your Vehicle
            </Link>
          </div>

          {/* User Actions & Auth Profile */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                {/* Role Specific Quick Link */}
                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin Panel
                  </Link>
                )}
                {user.role === 'vendor' && (
                  <Link
                    to="/vendor/dashboard"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Vendor Hub
                  </Link>
                )}
                {user.role === 'customer' && (
                  <Link
                    to="/my-bookings"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100 transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    My Bookings
                  </Link>
                )}

                {/* Notification Dropdown */}
                <NotificationDropdown />

                {/* Profile Pill */}
                <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group"
                    title="View Profile"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-brand-600 to-sky-600 flex items-center justify-center text-white font-semibold text-xs border border-brand-500/30">
                      {user.avatar?.url ? (
                        <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name ? user.name[0].toUpperCase() : 'U'
                      )}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[120px] truncate group-hover:text-brand-600 dark:group-hover:text-brand-400">
                      {user.name}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-brand-600 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm hover:shadow-hover transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Explore Fleet
          </Link>
          <Link
            to="/categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Categories
          </Link>
          <Link
            to="/rental-plans"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Rental Plans
          </Link>
          <Link
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            My Profile
          </Link>
          <Link
            to="/vendor/register"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-accent-600 dark:text-accent-400 hover:bg-accent-50 dark:hover:bg-slate-800"
          >
            List Your Vehicle
          </Link>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="px-3 py-2 text-sm font-semibold text-slate-500">
                  Signed in as <span className="text-slate-800 dark:text-slate-200 font-bold">{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 dark:bg-slate-800 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-xl"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
