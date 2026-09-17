import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Select = React.forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  className,
  wrapperClassName,
  children,
  id,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={cn("w-full space-y-1.5", wrapperClassName)}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <select
          ref={ref}
          id={selectId}
          className={cn(
            "w-full appearance-none rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer py-2.5",
            Icon ? "pl-10" : "pl-3.5",
            "pr-10",
            error ? "border-rose-500 focus:border-rose-500" : "",
            className
          )}
          {...props}
        >
          {children}
        </select>

        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 pointer-events-none" />
      </div>

      {error ? (
        <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
