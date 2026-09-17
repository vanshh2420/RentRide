import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Button = React.forwardRef(({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none";

  const variants = {
    primary: "bg-brand-600 hover:bg-brand-500 text-white shadow-sm hover:shadow-hover focus:ring-brand-500 active:scale-[0.98]",
    secondary: "bg-slate-100 hover:bg-slate-200/80 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 focus:ring-slate-400 active:scale-[0.98]",
    outline: "border border-slate-300 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 bg-transparent text-slate-700 dark:text-slate-200 hover:bg-brand-50/50 dark:hover:bg-brand-950/30 focus:ring-brand-500 active:scale-[0.98]",
    ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus:ring-slate-400",
    danger: "bg-rose-600 hover:bg-rose-500 text-white shadow-xs focus:ring-rose-500 active:scale-[0.98]",
    success: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs focus:ring-emerald-500 active:scale-[0.98]",
    ai: "bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white shadow-md shadow-indigo-500/20 active:scale-[0.98] focus:ring-indigo-500",
    dark: "bg-slate-900 hover:bg-slate-800 text-white shadow-sm dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 active:scale-[0.98]"
  };

  const sizes = {
    xs: "px-2.5 py-1 text-[11px] rounded-lg gap-1.5",
    sm: "px-3 py-1.5 text-xs rounded-xl gap-1.5",
    md: "px-4 py-2.5 text-xs sm:text-sm rounded-xl gap-2",
    lg: "px-6 py-3.5 text-sm sm:text-base rounded-2xl gap-2.5",
    icon: "p-2 rounded-xl"
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : LeftIcon ? (
        <LeftIcon className="w-4 h-4 flex-shrink-0" />
      ) : null}
      
      {children}
      
      {!isLoading && RightIcon && (
        <RightIcon className="w-4 h-4 flex-shrink-0" />
      )}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
