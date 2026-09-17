import React from 'react';

export const CardSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl bg-white dark:bg-slate-900 p-4 border border-slate-200/80 dark:border-slate-800 space-y-4 animate-pulse shadow-subtle"
        >
          <div className="aspect-[16/10] bg-slate-200 dark:bg-slate-800 rounded-2xl w-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-2/3"></div>
            <div className="h-3 bg-slate-100 dark:bg-slate-850 rounded-full w-1/2"></div>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-1/3"></div>
            <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-xl w-24"></div>
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

export const MetricSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-3 animate-pulse"
        >
          <div className="flex justify-between items-center">
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full w-24"></div>
            <div className="w-9 h-9 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          </div>
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-full w-32"></div>
          <div className="h-3 bg-slate-100 dark:bg-slate-850 rounded-full w-20"></div>
        </div>
      ))}
    </div>
  );
};

export const DetailSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-48"></div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[16/10] bg-slate-200 dark:bg-slate-800 rounded-3xl w-full"></div>
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[4/3] bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-5 space-y-6">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-full w-3/4"></div>
          <div className="h-4 bg-slate-100 dark:bg-slate-850 rounded-full w-1/2"></div>
          <div className="h-32 bg-slate-100 dark:bg-slate-850 rounded-2xl w-full"></div>
          <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full"></div>
        </div>
      </div>
    </div>
  );
};
