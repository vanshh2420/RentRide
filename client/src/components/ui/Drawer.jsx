import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Drawer = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  position = 'right', // 'right' | 'bottom'
  maxWidth = 'max-w-md',
  className
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isBottom = position === 'bottom';

  return (
    <div className="fixed inset-0 z-50 flex animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div
        className={cn(
          "relative bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-2xl z-10 flex flex-col transition-transform duration-300",
          isBottom
            ? "mt-auto w-full max-h-[85vh] rounded-t-3xl border-t"
            : cn("ml-auto h-full w-full border-l", maxWidth),
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 bg-slate-50/70 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Drawer;
