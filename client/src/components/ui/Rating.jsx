import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Rating = ({
  value = 5,
  max = 5,
  size = 'sm',
  interactive = false,
  onChange,
  className
}) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= Math.round(value);

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange && onChange(starValue)}
            className={cn(
              "transition-colors",
              interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
            )}
          >
            <Star
              className={cn(
                sizes[size] || sizes.sm,
                isFilled
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-300 dark:text-slate-600"
              )}
            />
          </button>
        );
      })}
    </div>
  );
};

export default Rating;
