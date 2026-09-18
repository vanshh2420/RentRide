import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

/**
 * RentRide Official Logo Mark (R + Integrated Road)
 * Communicates: R (RentRide) + Road (travel, mobility, vehicle rental, forward movement)
 */
export const RentRideMark = ({ className = '', size = 40 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={cn("flex-shrink-0 transition-transform duration-200", className)}
    aria-hidden="true"
  >
    {/* Dark High-Contrast Squircle Container */}
    <rect width="100" height="100" rx="26" fill="#090e17" />
    
    {/* Subtle Inner Accent Rim */}
    <rect 
      x="1" 
      y="1" 
      width="98" 
      height="98" 
      rx="25" 
      stroke="rgba(255,255,255,0.08)" 
      strokeWidth="2" 
    />

    {/* Geometric Solid R Stem in Crisp White */}
    <rect x="20" y="18" width="14" height="64" rx="4" fill="#ffffff" />

    {/* Geometric R Upper Loop/Bowl in Crisp White */}
    <path 
      d="M32 18H58C71.2548 18 82 28.7452 82 42C82 55.2548 71.2548 66 58 66H32V52H56C61.5228 52 66 47.5228 66 42C66 36.4772 61.5228 32 56 32H32V18Z" 
      fill="#ffffff" 
    />

    {/* Integrated Mobility Road (Diagonal Leg sweeping up into the R's core) */}
    <path 
      d="M43 82L55 48H67L82 82H43Z" 
      fill="#2557eb" 
    />

    {/* Road Highway Centerline Dashes with Perspective */}
    <line 
      x1="61.5" 
      y1="52" 
      x2="60.5" 
      y2="62" 
      stroke="#ffffff" 
      strokeWidth="3" 
      strokeLinecap="round" 
    />
    <line 
      x1="59.5" 
      y1="67" 
      x2="57" 
      y2="80" 
      stroke="#ffffff" 
      strokeWidth="4" 
      strokeLinecap="round" 
    />
  </svg>
);

/**
 * RentRide Primary Logo Component
 * 
 * Supports:
 * - Desktop Full Lockup (Mark + "RentRide" Wordmark + "Smart Mobility" Subtitle)
 * - Mobile Icon Mode or Full Mode
 * - Automatic dark/light theme adaptation or explicit inverted={true} for dark backgrounds
 * - Clickable root navigation
 */
export const RentRideLogo = ({
  variant = 'badge', // 'badge' | 'icon-only'
  size = 'md',       // 'sm' | 'md' | 'lg'
  inverted = false,  // true when placed on dark surfaces (footer, dark hero cards, auth left pane)
  showTagline = true,
  to = '/',
  className = '',
  onClick
}) => {
  const sizeMap = {
    sm: { box: 32, text: 'text-lg', dot: 'w-1.5 h-1.5', sub: 'text-[9px]' },
    md: { box: 40, text: 'text-xl', dot: 'w-1.5 h-1.5', sub: 'text-[10px]' },
    lg: { box: 46, text: 'text-2xl', dot: 'w-2 h-2', sub: 'text-[11px]' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const textColorClass = inverted 
    ? "text-white" 
    : "text-slate-900 dark:text-white";

  const subColorClass = inverted 
    ? "text-slate-400" 
    : "text-slate-400 dark:text-slate-500";

  const content = (
    <div className={cn("flex items-center space-x-2.5 sm:space-x-3 group cursor-pointer select-none", className)}>
      {/* R + Road Brand Mark */}
      <div className="relative group-hover:scale-105 transition-transform duration-200">
        <RentRideMark size={currentSize.box} />
      </div>

      {/* Wordmark (Hidden in icon-only mode) */}
      {variant !== 'icon-only' && (
        <div className="flex flex-col">
          <span className={cn(
            "font-heading font-black tracking-tight flex items-center gap-1 leading-none",
            currentSize.text,
            textColorClass
          )}>
            <span>RentRide</span>
            <span className={cn("rounded-full bg-brand-600 animate-pulse", currentSize.dot)} />
          </span>
          {showTagline && (
            <span className={cn(
              "font-bold tracking-widest uppercase mt-1 leading-none",
              currentSize.sub,
              subColorClass
            )}>
              Smart Mobility
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link 
        to={to} 
        onClick={onClick} 
        aria-label="RentRide — Smart Mobility Marketplace Home"
        className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-2xl"
      >
        {content}
      </Link>
    );
  }

  return content;
};

export default RentRideLogo;
