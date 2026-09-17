import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export const SearchInput = React.forwardRef(({
  value,
  onChange,
  onClear,
  placeholder = "Search...",
  className,
  wrapperClassName,
  ...props
}, ref) => {
  return (
    <div className={cn("relative flex items-center w-full", wrapperClassName)}>
      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "w-full pl-10 pr-9 py-2.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500",
          className
        )}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
});

SearchInput.displayName = 'SearchInput';
export default SearchInput;
