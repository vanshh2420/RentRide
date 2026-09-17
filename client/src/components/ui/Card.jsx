import React from 'react';
import { cn } from '../../utils/cn';

export const Card = ({
  children,
  className,
  hoverable = false,
  glass = false,
  padding = 'default',
  ...props
}) => {
  const paddings = {
    none: "p-0",
    sm: "p-3 sm:p-4",
    default: "p-4 sm:p-6",
    lg: "p-6 sm:p-8"
  };

  return (
    <div
      className={cn(
        "rounded-2xl sm:rounded-3xl border transition-all duration-200",
        glass
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/80 dark:border-slate-800"
          : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-subtle",
        hoverable && "hover:shadow-card hover:border-slate-300 dark:hover:border-slate-700/80 hover:-translate-y-0.5",
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className }) => (
  <div className={cn("flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80", className)}>
    <div className="space-y-0.5">
      <h3 className="font-heading font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
        {title}
      </h3>
      {subtitle && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
      )}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);

export default Card;
