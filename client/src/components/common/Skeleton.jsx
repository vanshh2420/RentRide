import React from 'react';

export const CardSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl glass-panel p-4 border border-slate-200/80 dark:border-slate-800 space-y-4 animate-pulse"
        >
          <div className="aspect-[16/10] bg-slate-200 dark:bg-slate-800 rounded-2xl w-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-2/3"></div>
            <div className="h-3 bg-slate-100 dark:bg-slate-850 rounded-full w-1/2"></div>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-1/3"></div>
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="w-full space-y-3 animate-pulse">
      <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-14 bg-slate-50 dark:bg-slate-850/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 w-full"
        ></div>
      ))}
    </div>
  );
};
