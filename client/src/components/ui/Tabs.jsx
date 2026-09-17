import React from 'react';
import { cn } from '../../utils/cn';

export const Tabs = ({
  tabs = [],
  activeTab,
  onChange,
  className,
  tabClassName,
  variant = 'pill' // 'pill' | 'underline'
}) => {
  if (variant === 'underline') {
    return (
      <div className={cn("flex border-b border-slate-200 dark:border-slate-800 gap-6", className)}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                "pb-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 relative transition-colors",
                isActive
                  ? "text-brand-600 dark:text-brand-400"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200",
                tabClassName
              )}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={cn(
                  "px-1.5 py-0.5 rounded-full text-[10px] font-extrabold",
                  isActive
                    ? "bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                )}>
                  {tab.badge}
                </span>
              )}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 dark:bg-brand-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Pill variant (default)
  return (
    <div className={cn("inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800/90 rounded-2xl gap-1", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 select-none",
              isActive
                ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white",
              tabClassName
            )}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={cn(
                "px-1.5 py-0.2 rounded-full text-[10px] font-bold ml-1",
                isActive
                  ? "bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
              )}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
