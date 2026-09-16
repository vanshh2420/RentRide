import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle, Clock, Zap, Shield } from 'lucide-react';

export const Badge = ({
  variant = 'primary',
  size = 'sm',
  icon: CustomIcon,
  children,
  className = ''
}) => {
  const variantStyles = {
    primary: 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border-brand-200 dark:border-brand-800',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    danger: 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800',
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    ai: 'bg-gradient-to-r from-brand-50 to-accent-50 dark:from-brand-950/80 dark:to-accent-950/80 text-brand-800 dark:text-brand-200 border-brand-200/80 dark:border-brand-700/80 shadow-xs',
    dark: 'bg-slate-900 text-white border-slate-800'
  };

  const sizeStyles = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  const defaultIcons = {
    ai: Sparkles,
    success: CheckCircle2,
    warning: AlertCircle,
    danger: AlertCircle,
    primary: Zap,
    dark: Shield
  };

  const IconComponent = CustomIcon || (variant === 'ai' ? Sparkles : null);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wider border transition-colors ${
        variantStyles[variant] || variantStyles.primary
      } ${sizeStyles[size] || sizeStyles.sm} ${className}`}
    >
      {IconComponent && <IconComponent className="w-3 h-3 flex-shrink-0" />}
      <span>{children}</span>
    </span>
  );
};
