import React from 'react';
import { cn } from '../../utils/cn';

export const IconButton = React.forwardRef(({
  children,
  icon: Icon,
  className,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  title,
  type = 'button',
  ...props
}, ref) => {
  const variants = {
    ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white",
    solid: "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 shadow-xs",
    primary: "bg-brand-600 hover:bg-brand-500 text-white shadow-xs",
    danger: "hover:bg-rose-50 text-rose-600 dark:hover:bg-rose-950/40"
  };

  const sizes = {
    sm: "w-8 h-8 rounded-lg text-xs",
    md: "w-10 h-10 rounded-xl text-sm",
    lg: "w-12 h-12 rounded-2xl text-base"
  };

  return (
    <button
      ref={ref}
      type={type}
      title={title}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:opacity-40 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {Icon ? <Icon className="w-4 h-4" /> : children}
    </button>
  );
});

IconButton.displayName = 'IconButton';
export default IconButton;
