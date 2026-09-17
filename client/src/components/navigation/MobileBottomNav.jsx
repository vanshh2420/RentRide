import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Home, Compass, Calendar, User } from 'lucide-react';
import { cn } from '../../utils/cn';

export const MobileBottomNav = () => {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const navItems = [
    { label: 'Home', path: '/', icon: Home, exact: true },
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Bookings', path: isAuthenticated ? '/my-bookings' : '/login', icon: Calendar },
    { label: 'Profile', path: isAuthenticated ? '/profile' : '/login', icon: User },
  ];

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 shadow-2xl py-1.5 px-4">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-150",
                active
                  ? "text-brand-600 dark:text-brand-400 font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
              )}
            >
              <div className={cn(
                "p-1 rounded-xl transition-all",
                active && "bg-brand-50 dark:bg-brand-950/60"
              )}>
                <Icon className={cn("w-5 h-5", active ? "stroke-[2.4]" : "stroke-[1.8]")} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
