import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { vehicleApi } from '../../services/vehicleApi';
import { VehicleCard } from '../../features/vehicles/VehicleCard';
import { FilterPanel } from '../../features/vehicles/FilterPanel';
import { CardSkeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Grid, 
  Map as MapIcon, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  ArrowUpDown,
  Car,
  Navigation,
  CheckCircle2
} from 'lucide-react';
import { MapView } from '../../components/common/MapView';
import { SUPPORTED_CITIES } from '../../constants/cities';

export const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter State
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || 'all',
    category: searchParams.get('category') || 'all',
    type: searchParams.get('type') || 'all',
    fuelType: searchParams.get('fuelType') || 'all',
    transmission: searchParams.get('transmission') || 'all',
    plan: searchParams.get('plan') || 'HOURLY',
    search: searchParams.get('search') || '',
    sortBy: searchParams.get('sortBy') || 'popular',
    sortOrder: searchParams.get('sortOrder') || 'desc',
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: 12
  });

  // UI States
  const [vehicles, setVehicles] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedMapVehicle, setSelectedMapVehicle] = useState(null);

  // Nearest Available Rides State
  const [userCoords, setUserCoords] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isNearbyMode, setIsNearbyMode] = useState(false);

  // Sync state with URL search params changes
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlCity = searchParams.get('city');
    const urlType = searchParams.get('type');
    const urlPlan = searchParams.get('plan');
    const urlSearch = searchParams.get('search');

    setFilters((prev) => {
      const updated = { ...prev };
      if (urlCategory !== null) updated.category = urlCategory;
      if (urlCity !== null) updated.city = urlCity;
      if (urlType !== null) updated.type = urlType;
      if (urlPlan !== null) updated.plan = urlPlan;
      if (urlSearch !== null) updated.search = urlSearch;
      updated.page = 1;
      return updated;
    });
  }, [searchParams]);

  // Fetch vehicles whenever filter state changes
  useEffect(() => {
    if (!isNearbyMode) {
      fetchVehicles();
    }
  }, [filters, isNearbyMode]);

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const queryParams = { ...filters };
      if (queryParams.category === 'all') delete queryParams.category;
      if (queryParams.type === 'all') delete queryParams.type;
      if (queryParams.fuelType === 'all') delete queryParams.fuelType;
      if (queryParams.transmission === 'all') delete queryParams.transmission;
      if (queryParams.city === 'all') delete queryParams.city;
      if (!queryParams.search) delete queryParams.search;

      const res = await vehicleApi.searchVehicles(queryParams);
      setVehicles(res.data?.vehicles || []);
      const pag = res.data?.pagination || {};
      const totalPages = pag.totalPages || pag.pages || 1;
      setPagination({
        total: pag.total || 0,
        page: pag.page || 1,
        pages: totalPages,
        totalPages
      });
      if (res.data?.vehicles?.length > 0 && !selectedMapVehicle) {
        setSelectedMapVehicle(res.data.vehicles[0]);
      }
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setVehicles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindNearMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setUserCoords(coords);
        setIsNearbyMode(true);
        setIsLoading(true);
        try {
          const res = await vehicleApi.getNearbyVehicles({
            lat: coords.lat,
            lng: coords.lng,
            category: filters.category !== 'all' ? filters.category : undefined,
            radius: 50,
            limit: 20
          });
          setVehicles(res.data?.vehicles || []);
          setPagination({ total: res.data?.totalFound || 0, pages: 1, page: 1 });
          if (res.data?.vehicles?.length > 0) {
            setSelectedMapVehicle(res.data.vehicles[0]);
          }
        } catch (err) {
          console.error('Failed to fetch nearby vehicles:', err);
        } finally {
          setIsLocating(false);
          setIsLoading(false);
        }
      },
      (err) => {
        console.warn('Geolocation unavailable, defaulting to Indore center hub:', err.message);
        const fallbackCoords = { lat: 22.7196, lng: 75.8577 };
        setUserCoords(fallbackCoords);
        setIsNearbyMode(true);
        loadNearbyWithCoords(fallbackCoords);
      },
      { timeout: 8000 }
    );
  };

  const loadNearbyWithCoords = async (coords) => {
    setIsLoading(true);
    try {
      const res = await vehicleApi.getNearbyVehicles({
        lat: coords.lat,
        lng: coords.lng,
        radius: 50,
        limit: 20
      });
      setVehicles(res.data?.vehicles || []);
      setPagination({ total: res.data?.totalFound || 0, pages: 1, page: 1 });
      if (res.data?.vehicles?.length > 0) {
        setSelectedMapVehicle(res.data.vehicles[0]);
      }
    } catch (err) {
      console.error('Failed to fetch fallback nearby:', err);
    } finally {
      setIsLocating(false);
      setIsLoading(false);
    }
  };

  const handleClearNearby = () => {
    setIsNearbyMode(false);
    setUserCoords(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      city: 'all',
      category: 'all',
      type: 'all',
      fuelType: 'all',
      transmission: 'all',
      plan: 'HOURLY',
      search: '',
      sortBy: 'popular',
      sortOrder: 'desc',
      page: 1,
      limit: 12
    });
    setSearchParams({});
  };

  const removeFilter = (key, defaultVal = 'all') => {
    setFilters((prev) => ({ ...prev, [key]: defaultVal, page: 1 }));
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    setSearchParams(newParams);
  };

  const activeFilterChips = [];
  if (filters.search) activeFilterChips.push({ label: `"${filters.search}"`, key: 'search', defaultVal: '' });
  if (filters.category && filters.category !== 'all') activeFilterChips.push({ label: `Category: ${filters.category}`, key: 'category' });
  if (filters.type && filters.type !== 'all') activeFilterChips.push({ label: filters.type === 'two_wheeler' ? 'Two-Wheelers' : 'Four-Wheelers', key: 'type' });
  if (filters.fuelType && filters.fuelType !== 'all') activeFilterChips.push({ label: `Fuel: ${filters.fuelType}`, key: 'fuelType' });
  if (filters.transmission && filters.transmission !== 'all') activeFilterChips.push({ label: `Trans: ${filters.transmission}`, key: 'transmission' });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by brand or model (e.g. Slavia, Thar, Ather)..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {/* City Selector, View Toggle, Sort & Mobile Filters */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            {/* City Dropdown */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <MapPin className="w-3.5 h-3.5 text-brand-600" />
              <select
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value, page: 1 })}
                className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="all" className="dark:bg-slate-800 font-semibold">All Hubs & Cities</option>
                {SUPPORTED_CITIES.map((c) => (
                  <option key={c.name} value={c.name} className="dark:bg-slate-800">
                    {c.name}, {c.state}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value, page: 1 })}
                className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="popular" className="dark:bg-slate-800">Popular & Recommended</option>
                <option value="price_asc" className="dark:bg-slate-800">Price: Low to High</option>
                <option value="price_desc" className="dark:bg-slate-800">Price: High to Low</option>
                <option value="rating" className="dark:bg-slate-800">Top Rated First</option>
              </select>
            </div>

            {/* Near Me GPS Trigger */}
            <button
              onClick={handleFindNearMe}
              disabled={isLocating}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                isNearbyMode
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-brand-500'
              }`}
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : 'Near Me'}</span>
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'map'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Map</span>
              </button>
            </div>

            {/* Mobile Filter Trigger Button */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Nearby Rides Active Notice */}
        {isNearbyMode && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-600 flex-shrink-0 animate-pulse" />
              <span>
                <strong>Nearest Available Rides:</strong> Showing vehicles within 50 km of your physical location, verified against our anti-collision engine.
              </span>
            </div>
            <button
              onClick={handleClearNearby}
              className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 text-[11px] flex-shrink-0"
            >
              Reset to City View
            </button>
          </div>
        )}

        {/* Active Filter Chips */}
        {activeFilterChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Active Filters:</span>
            {activeFilterChips.map((chip, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 font-bold text-xs"
              >
                <span>{chip.label}</span>
                <button
                  type="button"
                  onClick={() => removeFilter(chip.key, chip.defaultVal)}
                  className="hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-bold text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Main Results Grid & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sticky Sidebar: FilterPanel */}
        <div className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'}`}>
          <div className="sticky top-24">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>

        {/* Right Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Results Count Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Showing <strong className="text-slate-900 dark:text-white">{vehicles.length}</strong> of{' '}
                <strong className="text-slate-900 dark:text-white">{pagination.total || vehicles.length}</strong> rides
                {isNearbyMode
                  ? ' near your current location'
                  : filters.city && filters.city !== 'all'
                  ? ` in ${filters.city}`
                  : ' across all hubs'}
              </span>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && <CardSkeleton count={6} />}

          {/* Empty State */}
          {!isLoading && vehicles.length === 0 && (
            <EmptyState
              title="No rides found matching your filters"
              description={
                isNearbyMode
                  ? "We couldn't find any available vehicles within 50 km of your location right now. Try expanding your search or selecting a city hub."
                  : filters.city && filters.city !== 'all'
                  ? `We couldn't find any available vehicles in ${filters.city} matching your selected filters.`
                  : "We couldn't find any available vehicles matching your selected filters."
              }
              actionText={isNearbyMode ? "View All Cities" : "Reset All Filters"}
              onAction={isNearbyMode ? handleClearNearby : handleResetFilters}
            />
          )}

          {/* Grid View */}
          {!isLoading && vehicles.length > 0 && viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
              ))}
            </div>
          )}

          {/* Interactive Leaflet Map View */}
          {!isLoading && vehicles.length > 0 && viewMode === 'map' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-brand-600" />
                    Interactive Dispatch Map {filters.city && filters.city !== 'all' ? `(${filters.city})` : ''}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pins represent verified available vehicles parked at pickup desks with live pricing.
                  </p>
                </div>
                <span className="text-xs font-bold text-brand-600 bg-brand-50 dark:bg-brand-950 px-3 py-1.5 rounded-full border border-brand-200">
                  {vehicles.length} Vehicles On Map
                </span>
              </div>

              {/* Leaflet Map */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <MapView
                    vehicles={vehicles}
                    userLocation={userCoords}
                    centerCity={filters.city || 'Indore'}
                    height="460px"
                    onSelectVehicle={(v) => setSelectedMapVehicle(v)}
                  />
                </div>

                {/* Selected Vehicle Quick Inspector */}
                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Selected Vehicle Pin:
                  </span>
                  {selectedMapVehicle ? (
                    <VehicleCard vehicle={selectedMapVehicle} />
                  ) : (
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center space-y-2">
                      <MapPin className="w-8 h-8 text-brand-500 mx-auto" />
                      <p className="font-bold text-xs text-slate-800 dark:text-white">Click any pin</p>
                      <p className="text-[11px] text-slate-400">
                        Tap on a price badge on the map to preview vehicle specifications and initiate checkout.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-200/80 dark:border-slate-800">
              <button
                disabled={filters.page <= 1}
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: pagination.pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setFilters({ ...filters, page: i + 1 })}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    filters.page === i + 1
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={filters.page >= pagination.pages}
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
