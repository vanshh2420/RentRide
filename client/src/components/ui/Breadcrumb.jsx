import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Breadcrumb = ({
  items = [],
  className
}) => {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400", className)}>
      <Link
        to="/"
        className="inline-flex items-center gap-1 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="sr-only">Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            {isLast || !item.href ? (
              <span className="font-bold text-slate-800 dark:text-white truncate max-w-[200px] sm:max-w-xs">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors truncate max-w-[150px]"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
