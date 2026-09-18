import React, { useState, useEffect } from 'react';
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
  Store,
  ChevronDown,
  Layers,
  ArrowRight
} from 'lucide-react';
import { cn } from '../utils/cn';
import { RentRideLogo } from '../components/common/RentRideLogo';

export const CustomerNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

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

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

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
            className="inline-flex items-center gap-1.5 text-accent-400 hover:text-accent-300 font-bold hover:underline text-xs"
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
      <nav className={cn(
        "transition-all duration-200 border-b",
        isScrolled
          ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-slate-200/90 dark:border-slate-800 shadow-sm"
          : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200/70 dark:border-slate-800/80"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-17 sm:h-18">
            
            {/* LEFT: Brand Logo */}
            <RentRideLogo />

            {/* CENTER: Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
              <Link
                to="/explore"
                className={cn(
                  "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                  isActive('/explore')
                    ? "text-brand-600 dark:text-brand-400 bg-brand-50/90 dark:bg-brand-950/60 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60"
                )}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explore Rides</span>
              </Link>

              <Link
                to="/categories"
                className={cn(
                  "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                  isActive('/categories')
                    ? "text-brand-600 dark:text-brand-400 bg-brand-50/90 dark:bg-brand-950/60 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60"
                )}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Categories</span>
              </Link>

              <Link
                to="/rental-plans"
                className={cn(
                  "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                  isActive('/rental-plans') || isActive('/pricing')
                    ? "text-brand-600 dark:text-brand-400 bg-brand-50/90 dark:bg-brand-950/60 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60"
                )}
              >
                <span>Rental Plans</span>
              </Link>

              <Link
                to="/vendor/register"
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50/80 dark:hover:bg-amber-950/40 transition-all flex items-center gap-1.5"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Become a Vendor</span>
              </Link>

              {/* Customer Bookings Shortcut */}
              {isAuthenticated && user && user.role === 'customer' && (
                <Link
                  to="/my-bookings"
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                    isActive('/my-bookings')
                      ? "text-brand-600 dark:text-brand-400 bg-brand-50/90 dark:bg-brand-950/60 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60"
                  )}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>My Bookings</span>
                </Link>
              )}
            </div>

            {/* RIGHT: Auth & User Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-3">
                  {/* Notifications */}
                  <NotificationDropdown />

                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/80 transition-all text-left"
                      aria-expanded={profileDropdownOpen}
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
                      <ChevronDown className={cn(
                        "w-3.5 h-3.5 text-slate-400 ml-1 transition-transform duration-200",
                        profileDropdownOpen && "rotate-180"
                      )} />
                    </button>

                    {/* Popover Menu */}
                    {profileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-fadeIn">
                        <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        </div>

                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>My Profile & KYC</span>
                        </Link>

                        {user.role === 'customer' && (
                          <Link
                            to="/my-bookings"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span>My Bookings</span>
                          </Link>
                        )}

                        {user.role === 'vendor' && (
                          <Link
                            to="/vendor/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Vendor Dashboard</span>
                          </Link>
                        )}

                        {user.role === 'admin' && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Admin Governance</span>
                          </Link>
                        )}

                        <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
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
                    className="px-4.5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 active:scale-[0.98] rounded-xl shadow-sm hover:shadow-hover transition-all duration-200"
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
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl px-5 pt-4 pb-6 space-y-2.5 animate-fadeIn shadow-2xl">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Explore Rides
            </Link>
            <Link
              to="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Categories
            </Link>
            <Link
              to="/rental-plans"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Rental Plans
            </Link>
            <Link
              to="/vendor/register"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2.5 rounded-xl text-sm font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
            >
              Become a Vendor
            </Link>

            {isAuthenticated && user && user.role === 'customer' && (
              <Link
                to="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                My Bookings
              </Link>
            )}

            {isAuthenticated && (
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                My Profile & KYC
              </Link>
            )}

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              {isAuthenticated && user ? (
                <div className="space-y-3">
                  <div className="px-3.5 py-2 text-xs font-semibold text-slate-500 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                    Signed in as <span className="text-slate-900 dark:text-white font-bold">{user.name}</span> ({user.role})
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center justify-between"
                  >
                    <span>Sign Out</span>
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-slate-200 rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-4 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-sm transition-colors"
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

export default CustomerNavbar;
