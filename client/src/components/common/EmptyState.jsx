import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ArrowRight, RefreshCw } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Car,
  title = 'No items found',
  description = 'Try adjusting your search criteria or filters to explore more options.',
  actionText,
  actionLink,
  onAction,
  className = ''
}) => {
  return (
    <div
      className={`glass-panel p-10 sm:p-14 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-center space-y-4 max-w-md mx-auto shadow-subtle ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto shadow-xs">
        <Icon className="w-7 h-7 stroke-[1.8]" />
      </div>

      <div className="space-y-1.5">
        <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      {(actionText && (actionLink || onAction)) && (
        <div className="pt-2">
          {actionLink ? (
            <Link
              to={actionLink}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all"
            >
              <span>{actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{actionText}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
