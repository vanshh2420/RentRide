import React, { useState, useRef, useEffect } from 'react';
import { SUPPORTED_CITIES, getCityByName } from '../../constants/cities';
import { 
  Building2, 
  Search, 
  X, 
  Check, 
  ChevronDown 
} from 'lucide-react';

export const CityAutocomplete = ({
  value = '',
  onChange,
  onSelectCity,
  label,
  placeholder = 'Select or type operating city...',
  error,
  required = false,
  disabled = false,
  id = 'city-autocomplete',
  name = 'city',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value || '');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listboxRef = useRef(null);

  // Synchronize internal search query when external value changes
  useEffect(() => {
    setSearchQuery(value || '');
  }, [value]);

  // Filter cities based on search query
  const filteredCities = SUPPORTED_CITIES.filter((city) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      city.name.toLowerCase().includes(q) ||
      city.state.toLowerCase().includes(q) ||
      city.keywords?.some((k) => k.toLowerCase().includes(q))
    );
  });

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        // If query is not a valid city, snap to previously selected valid city value or clear
        if (value && searchQuery !== value) {
          setSearchQuery(value);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [value, searchQuery]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;

    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter')) {
      setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => 
        prev < filteredCities.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => 
        prev > 0 ? prev - 1 : filteredCities.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && filteredCities.length > 0 && highlightedIndex >= 0) {
        selectCity(filteredCities[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const selectCity = (city) => {
    setSearchQuery(city.name);
    setIsOpen(false);
    if (onChange) {
      onChange(city.name);
    }
    if (onSelectCity) {
      onSelectCity(city);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSearchQuery('');
    if (onChange) {
      onChange('');
    }
    if (onSelectCity) {
      onSelectCity(null);
    }
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label 
          htmlFor={id}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input Field Container */}
      <div 
        className={`relative flex items-center rounded-xl bg-white dark:bg-slate-800 border transition-all ${
          error
            ? 'border-red-500 ring-2 ring-red-500/20'
            : isOpen
            ? 'border-brand-500 ring-2 ring-brand-500/20 dark:border-brand-400'
            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
        } ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50 dark:bg-slate-900' : ''}`}
      >
        {/* Left Building Outline Icon */}
        <div className="pl-3.5 pr-2 py-2.5 text-slate-400 dark:text-slate-500 flex items-center pointer-events-none">
          <Building2 className="w-4 h-4" />
        </div>

        {/* Text Input */}
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={`${id}-listbox`}
          disabled={disabled}
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setHighlightedIndex(0);
            if (!isOpen) setIsOpen(true);
            if (onChange) {
              onChange(e.target.value);
            }
          }}
          onFocus={() => {
            if (!disabled) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="w-full py-2.5 pr-8 bg-transparent text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
        />

        {/* Clear & Dropdown Actions */}
        <div className="pr-3 flex items-center gap-1">
          {searchQuery && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            tabIndex={-1}
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-600 dark:text-brand-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Dropdown Popover */}
      {isOpen && (
        <div
          id={`${id}-listbox`}
          ref={listboxRef}
          role="listbox"
          className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden animate-fadeIn"
        >
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-60 overflow-y-auto">
            {filteredCities.length > 0 ? (
              filteredCities.map((city, idx) => {
                const isSelected = value?.toLowerCase() === city.name.toLowerCase();
                const isHighlighted = highlightedIndex === idx;

                return (
                  <div
                    key={city.id}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => selectCity(city)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`group flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-slate-50/90 dark:bg-slate-800/90'
                        : isHighlighted
                        ? 'bg-slate-50/70 dark:bg-slate-800/60'
                        : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {/* Left Icon & Two-line City/State Text */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors flex-shrink-0 flex items-center justify-center">
                        <Building2 className="w-5 h-5 stroke-[1.75]" />
                      </div>
                      <div className="flex flex-col text-left min-w-0">
                        <span className={`text-sm font-semibold leading-tight text-slate-900 dark:text-white ${isSelected ? 'text-brand-600 dark:text-brand-400' : ''}`}>
                          {city.name}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                          {city.state}
                        </span>
                      </div>
                    </div>

                    {/* Selected Checkmark */}
                    {isSelected && (
                      <div className="flex-shrink-0 text-brand-600 dark:text-brand-400 ml-2">
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-5 text-center space-y-1.5">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-2">
                  <Search className="w-4 h-4" />
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  No matching city found
                </p>
                <p className="text-[11px] text-slate-400">
                  Available cities: <strong>Indore</strong>, <strong>Bhopal</strong>, and <strong>Gwalior</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

