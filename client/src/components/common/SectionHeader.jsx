import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export const SectionHeader = ({
  badge,
  badgeIcon: BadgeIcon = Sparkles,
  title,
  subtitle,
  actionText,
  actionLink,
  align = 'left',
  className = ''
}) => {
  const isCentered = align === 'center';

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 ${
        isCentered ? 'text-center max-w-3xl mx-auto' : ''
      } ${className}`}
    >
      <div className={`space-y-2 ${isCentered ? 'mx-auto' : ''}`}>
        {badge && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider">
            {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5 text-accent-500" />}
            <span>{badge}</span>
          </div>
        )}

        <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {title}
        </h2>

        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
};
