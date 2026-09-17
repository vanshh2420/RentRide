import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, XCircle, Sparkles, Shield, Wrench } from 'lucide-react';
import { cn } from '../../utils/cn';

export const StatusBadge = ({
  status = '',
  size = 'sm',
  className
}) => {
  const norm = String(status).toUpperCase();

  const configs = {
    // Vehicle & Fleet
    AVAILABLE: {
      label: 'Available',
      style: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      icon: CheckCircle2
    },
    BOOKED: {
      label: 'Booked',
      style: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800',
      icon: Clock
    },
    MAINTENANCE: {
      label: 'Maintenance',
      style: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      icon: Wrench
    },
    INACTIVE: {
      label: 'Inactive',
      style: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
      icon: XCircle
    },

    // Booking Statuses
    CONFIRMED: {
      label: 'Confirmed',
      style: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      icon: CheckCircle2
    },
    ACTIVE: {
      label: 'Active Trip',
      style: 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border-brand-200 dark:border-brand-800 animate-pulse',
      icon: Sparkles
    },
    COMPLETED: {
      label: 'Completed',
      style: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      icon: CheckCircle2
    },
    CANCELLED: {
      label: 'Cancelled',
      style: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      icon: XCircle
    },
    PENDING: {
      label: 'Pending',
      style: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      icon: Clock
    },

    // User / KYC
    VERIFIED: {
      label: 'Verified',
      style: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      icon: Shield
    },
    REJECTED: {
      label: 'Rejected',
      style: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      icon: AlertTriangle
    }
  };

  const current = configs[norm] || {
    label: status || 'Unknown',
    style: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    icon: Clock
  };

  const Icon = current.icon;

  const sizeStyles = {
    xs: 'px-2 py-0.5 text-[10px] gap-1',
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-sm gap-2'
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-bold uppercase tracking-wider border",
        current.style,
        sizeStyles[size] || sizeStyles.sm,
        className
      )}
    >
      <Icon className="w-3 h-3 flex-shrink-0" />
      <span>{current.label}</span>
    </span>
  );
};

export default StatusBadge;
