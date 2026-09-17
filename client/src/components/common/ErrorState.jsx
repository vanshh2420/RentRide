import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export const ErrorState = ({
  title = "Something went wrong",
  message = "We couldn't load this information. Please check your connection and try again.",
  onRetry,
  className = ""
}) => {
  return (
    <div className={`p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 text-center space-y-4 max-w-md mx-auto shadow-subtle ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-xs">
        <AlertCircle className="w-7 h-7 stroke-[1.8]" />
      </div>

      <div className="space-y-1.5">
        <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {message}
        </p>
      </div>

      {onRetry && (
        <div className="pt-2">
          <Button
            variant="primary"
            size="sm"
            onClick={onRetry}
            leftIcon={RefreshCw}
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorState;
