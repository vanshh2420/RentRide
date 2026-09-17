import React from 'react';
import { cn } from '../../utils/cn';

export const Input = React.forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  rightElement,
  className,
  wrapperClassName,
  id,
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={cn("w-full space-y-1.5", wrapperClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            "w-full rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/90 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-900",
            Icon ? "pl-10" : "pl-3.5",
            rightElement ? "pr-10" : "pr-3.5",
            "py-2.5",
            error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : "",
            className
          )}
          {...props}
        />

        {rightElement && (
          <div className="absolute right-3 flex items-center justify-center">
            {rightElement}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
