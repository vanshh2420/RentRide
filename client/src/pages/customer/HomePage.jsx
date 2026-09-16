import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiRecommendationsCarousel } from '../../features/ai/AiRecommendationsCarousel';
import { PersonalizedOfferBanner } from '../../features/ai/PersonalizedOfferBanner';
import { CityAutocomplete } from '../../components/common/CityAutocomplete';
import { vehicleApi } from '../../services/vehicleApi';
import { categoryApi } from '../../services/categoryApi';
import { VehicleCard } from '../../features/vehicles/VehicleCard';
import { 
  Car, 
  Bike, 
  Search, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  SlidersHorizontal,
  MapPin,
  Star,
  Store,
  CreditCard,
  Layers,
  Fuel,
  Users,
  Compass,
  ChevronRight,
  Award
} from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();

  // Search State
  const [selectedCity, setSelectedCity] = useState('Indore');
  const [vehicleType, setVehicleType] = useState('all');
  const [pickupDate, setPickupDate] = useState('');
  const [rentalPlan, setRentalPlan] = useState('HOURLY');

  // AI Prompt State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiQueryCity, setAiQueryCity] = useState('Indore');
  const [isSearchingAi, setIsSearchingAi] = useState(false);

  // Dynamic Data States
  const [popularVehicles, setPopularVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true);

  // Default Categories Fallback
  const defaultCategories = [
    {
      _id: 'electric-scooters',
      slug: 'electric-scooters',
      name: 'Electric Scooters',
      type: 'two_wheeler',
      iconUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
      description: 'Silent, instant torque city commuters. 100% green transit.',
      startingRate: 'From ₹65/hr',
      count: '8+ Models'
    },
    {
      _id: 'bikes',
      slug: 'bikes',
      name: 'Cruiser & Sports Bikes',
      type: 'two_wheeler',
      iconUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
      description: 'High-torque touring cruisers and high-speed highway machines.',
      startingRate: 'From ₹90/hr',
      count: '12+ Models'
    },
    {
      _id: 'scooters',
      slug: 'scooters',
      name: 'Daily City Scooters',
      type: 'two_wheeler',
      iconUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
      description: 'Nimble automatic scooters perfect for market errands & college.',
      startingRate: 'From ₹55/hr',
      count: '6+ Models'
    },
    {
      _id: 'hatchbacks',
      slug: 'hatchbacks',
      name: 'Compact Hatchbacks',
      type: 'four_wheeler',
      iconUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
      description: 'Fuel-efficient, easy-parking 5-seaters for family & work commutes.',
      startingRate: 'From ₹180/hr',
      count: '14+ Models'
    },
    {
      _id: 'sedans',
      slug: 'sedans',
      name: 'Executive Sedans',
      type: 'four_wheeler',
      iconUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      description: 'Supreme boot space, premium legroom, and effortless highway cruising.',
      startingRate: 'From ₹240/hr',
      count: '10+ Models'
    },
    {
      _id: 'suvs',
      slug: 'suvs',
      name: 'Prime SUVs & 7-Seaters',
      type: 'four_wheeler',
      iconUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
      description: 'High ground clearance and commanding road presence for expeditions.',
      startingRate: 'From ₹350/hr',
      count: '9+ Models'
    }
  ];

  useEffect(() => {
    fetchInitialData();
  }, [selectedCity]);

  const fetchInitialData = async () => {
    setIsLoadingVehicles(true);
    try {
      const [vehiclesRes, categoriesRes] = await Promise.all([
        vehicleApi.searchVehicles({ limit: 4, city: selectedCity }),
        categoryApi.getAllCategories()
      ]);

      setPopularVehicles(vehiclesRes.data?.vehicles || []);
      if (categoriesRes.data?.categories?.length > 0) {
        setCategories(categoriesRes.data.categories);
      } else {
        setCategories(defaultCategories);
      }
    } catch (err) {
      console.error('Failed to load homepage data', err);
      setCategories(defaultCategories);
    } finally {
      setIsLoadingVehicles(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCity && selectedCity !== 'all') params.append('city', selectedCity);
    if (vehicleType && vehicleType !== 'all') params.append('type', vehicleType);
    if (rentalPlan) params.append('plan', rentalPlan);
    if (pickupDate) params.append('pickup', pickupDate);

    navigate(`/explore?${params.toString()}`);
  };

  const handleAiSearchSubmit = (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setIsSearchingAi(true);
    setAiQueryCity(selectedCity);
  };

  const samplePrompts = [
    "Automatic 5-seater sedan for family weekend",
    "Fast electric scooter for swift city errand",
    "Royal Enfield cruiser for highway roadtrip"
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-24">
      {/* ========================================================================= */}
      {/* SECTION 1 — HIGH IMPACT MARKETPLACE HERO                                 */}
      {/* ========================================================================= */}
      <section className="relative pt-6 pb-12 lg:pt-12 lg:pb-20 overflow-hidden bg-hero-glow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* LEFT COLUMN: Punchy Hero Copy & Search Engine */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Trust Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Zero Double-Booking · Verified Fleets</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08]">
                  Move Freely. <br />
                  <span className="bg-gradient-to-r from-brand-600 via-sky-500 to-emerald-500 bg-clip-text text-transparent">
                    Rent Smarter.
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl font-normal leading-relaxed pt-1">
                  Central India's leading vehicle rental marketplace. Book scooters, motorbikes, sedans, and luxury SUVs with instant conflict-free slot confirmation.
                </p>
              </div>

              {/* INTEGRATED SEARCH CONSOLE */}
              <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-floating space-y-5">
                
                {/* Vehicle Class Switcher Tabs */}
                <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setVehicleType('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        vehicleType === 'all'
                          ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>All Fleets</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVehicleType('four_wheeler')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        vehicleType === 'four_wheeler'
                          ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      <Car className="w-3.5 h-3.5" />
                      <span>Cars</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVehicleType('two_wheeler')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        vehicleType === 'two_wheeler'
                          ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      <Bike className="w-3.5 h-3.5" />
                      <span>Bikes</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVehicleType('electric')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        vehicleType === 'electric'
                          ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 text-emerald-500" />
                      <span>EVs</span>
                    </button>
                  </div>

                  {/* Plan Pill Switcher */}
                  <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                    <span className="text-slate-400">Plan:</span>
                    <select
                      value={rentalPlan}
                      onChange={(e) => setRentalPlan(e.target.value)}
                      className="bg-transparent font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                    >
                      <option value="HOURLY">Flexi Hourly</option>
                      <option value="12_HOURS">12h Day Pack</option>
                      <option value="24_HOURS">24h+ Escape (Save 15%)</option>
                    </select>
                  </div>
                </div>

                {/* Form Inputs Grid */}
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* WHERE */}
                    <div>
                      <CityAutocomplete
                        label="Pickup Location / Hub"
                        placeholder="Search Indore, Bhopal, Gwalior..."
                        value={selectedCity}
                        onChange={(cityName) => setSelectedCity(cityName)}
                      />
                    </div>

                    {/* WHEN */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Pickup Date & Time
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                        <input
                          type="datetime-local"
                          value={pickupDate}
                          onChange={(e) => setPickupDate(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-2xl bg-brand-600 hover:bg-brand-500 active:scale-[0.99] text-white font-extrabold text-sm shadow-md hover:shadow-hover transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <span>Search Available Fleets</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Quick Guarantees */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-medium">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ₹0 Deposit on Select Rides
                  </span>
                  <span>Instant Confirmation</span>
                  <span>Doorstep or Hub Pickup</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Automotive Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 aspect-[4/3] sm:aspect-[16/11]">
                <img
                  src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85"
                  alt="Modern Sedan Fleet"
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Floating Live Indicator Top */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold border border-white/10 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Live in {selectedCity}</span>
                  </span>

                  <span className="px-3 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white text-xs font-bold flex items-center gap-1 shadow-md">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>4.9 / 5</span>
                  </span>
                </div>

                {/* Floating Bottom Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-white/10 text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Featured Vehicle</span>
                      <h4 className="font-heading font-extrabold text-base">Skoda Slavia 1.5 TSI</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-300">From</span>
                      <p className="font-heading font-black text-lg text-white">₹240<span className="text-xs font-normal text-slate-300">/hr</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300 pt-1 border-t border-white/10">
                    <span>5 Seats</span>
                    <span>•</span>
                    <span>Automatic</span>
                    <span>•</span>
                    <span>18.7 km/l</span>
                  </div>
                </div>
              </div>

              {/* Decorative mini trust badge */}
              <div className="hidden sm:flex absolute -bottom-5 -left-5 p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">100% Conflict-Free</p>
                  <p className="text-[10px] text-slate-500">Atomic Booking Locks</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2 — TRUST HIGHLIGHTS BAR                                          */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Real-Time Slots</h4>
              <p className="text-[11px] text-slate-500">Zero double bookings</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Verified Hosts</h4>
              <p className="text-[11px] text-slate-500">Physical hub checks</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Flexi Pricing</h4>
              <p className="text-[11px] text-slate-500">Hourly, 12h, 24h packs</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Secure Escrow</h4>
              <p className="text-[11px] text-slate-500">Instant deposit refunds</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3 — PROMO OFFER BANNER                                            */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PersonalizedOfferBanner city={selectedCity} />
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4 — CATEGORY DISCOVERY (ZOOMCAR / ROYAL BROTHERS STYLE)           */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/80 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5 text-accent-500" />
              <span>Fleet Classifications</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Discover by Vehicle Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Choose the exact class designed for your journey style.
            </p>
          </div>

          <Link
            to="/categories"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            <span>All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.slice(0, 6).map((cat) => {
            const isTwoWheeler = cat.type === 'two_wheeler';

            return (
              <Link
                key={cat._id || cat.slug}
                to={`/explore?category=${cat.slug || cat._id}`}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={cat.iconUrl || (isTwoWheeler
                        ? 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80'
                        : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80')}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    
                    {/* Pill Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-mono text-[10px] font-extrabold flex items-center gap-1 border border-white/10">
                      {isTwoWheeler ? <Bike className="w-3 h-3 text-sky-400" /> : <Car className="w-3 h-3 text-amber-400" />}
                      <span>{isTwoWheeler ? 'TWO-WHEELER' : 'FOUR-WHEELER'}</span>
                    </div>

                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-200 text-[10px] font-bold">
                      {cat.count || 'Verified Fleet'}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {cat.description || 'Verified vehicles available for flexible rental.'}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between text-xs font-bold border-t border-slate-100 dark:border-slate-800/80 pt-3 mt-1">
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                    {cat.startingRate || 'Transparent Rates'}
                  </span>
                  <span className="text-brand-600 dark:text-brand-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Explore Fleet</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5 — FEATURED FLEET IN SELECTED CITY                               */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Verified Live Inventory</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Featured Rides in {selectedCity}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Hand-picked models ready for instant online checkout and pickup.
            </p>
          </div>

          <Link
            to={`/explore?city=${selectedCity}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            <span>View All Rides in {selectedCity}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoadingVehicles ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-84 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : popularVehicles.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <Car className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-heading font-bold text-base text-slate-800 dark:text-slate-200">
              No live vehicles found in {selectedCity} right now
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try switching your city selection or browse our all-city marketplace fleet.
            </p>
            <Link
              to="/explore"
              className="inline-block px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs"
            >
              Browse All Fleet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularVehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6 — NATURAL LANGUAGE AI TRIP FINDER                               */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl border border-brand-200 dark:border-brand-900/60 bg-gradient-to-br from-brand-50/50 via-white to-sky-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-brand-950/30 shadow-card space-y-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-600 text-white text-xs font-bold uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Trip Planner</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">
              Not sure what to rent? <br />
              <span className="bg-gradient-to-r from-brand-600 to-sky-500 bg-clip-text text-transparent">
                Tell RentRide what your trip looks like.
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Describe your journey in plain English — luggage, group size, terrain, or budget. Our machine learning recommendation engine will match you with the ideal verified vehicle.
            </p>
          </div>

          {/* Quick Prompt Chips */}
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-400">Try asking:</span>
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setAiPrompt(p)}
                className="px-3 py-1 rounded-full text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-brand-500 transition-colors"
              >
                "{p}"
              </button>
            ))}
          </div>

          {/* Prompt Bar */}
          <form onSubmit={handleAiSearchSubmit} className="relative max-w-3xl">
            <div className="flex flex-col sm:flex-row items-center gap-2 p-2 rounded-2xl bg-white dark:bg-slate-800 border-2 border-brand-500/50 shadow-md">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. Need an automatic SUV for 5 people with luggage under ₹3,000/day..."
                className="w-full px-4 py-3 bg-transparent text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="w-full sm:w-auto whitespace-nowrap px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Find My Ride</span>
              </button>
            </div>
          </form>

          {/* AI Recommendations Output */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <AiRecommendationsCarousel
              city={aiQueryCity}
              title="Personalized Recommendations for Your Trip"
            />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7 — HOW RENTRIDE WORKS                                            */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600">Simple 4-Step Journey</span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            How RentRide Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            From search to handover in four simple, transparent steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Find a ride',
              desc: 'Choose your city, vehicle type, and exact pickup date & time.',
              icon: MapPin,
              color: 'text-brand-600 bg-brand-50 dark:bg-brand-950/60'
            },
            {
              step: '02',
              title: 'Compare & Select',
              desc: 'Compare verified vehicle specs, rental plans, and customer ratings.',
              icon: SlidersHorizontal,
              color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/60'
            },
            {
              step: '03',
              title: 'Book securely',
              desc: 'Lock your 10-min slot and complete payment via Razorpay.',
              icon: CreditCard,
              color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60'
            },
            {
              step: '04',
              title: 'Ride away',
              desc: 'Inspect odometer and pick up vehicle from the verified vendor hub.',
              icon: Zap,
              color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60'
            }
          ].map((item, idx) => {
            const Icon = item.icon;

            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-subtle hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center font-bold`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-heading font-black text-2xl text-slate-300 dark:text-slate-700">
                    {item.step}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8 — WHY RENTRIDE (TRUST PILLARS)                                  */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-card space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Why Central India Chooses RentRide
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Built with mathematical scheduling accuracy and commercial vendor trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Zero Double-Booking</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Centralized interval queries guarantee walk-in offline rentals and online bookings never conflict.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 flex items-center justify-center font-bold">
                <Store className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Verified Vendors</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Rent only from verified fleet owners with commercial GST and maintained physical hubs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Transparent Pricing</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                See base rental, platform fee, GST, and refundable security deposit before paying.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">AI-Powered Discovery</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Smart recommendations and predictive fleet demand analysis based on your travel needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 9 — VENDOR PARTNER CALLOUT                                        */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-brand-950 p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800 shadow-2xl">
          <div className="space-y-4 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/20 text-accent-400 text-xs font-bold uppercase tracking-wider border border-accent-500/30">
              <Store className="w-3.5 h-3.5" />
              <span>Multi-Vendor Network</span>
            </span>

            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Have vehicles to rent? <br />
              <span className="text-accent-400">Turn your fleet into predictable revenue.</span>
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              List your bikes, scooters, or cars on RentRide. Manage both online marketplace bookings and walk-in offline customers with synchronized availability, automated odometer logs, and AI pricing insights.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs text-slate-300 font-semibold">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Double-Booking</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Offline Walk-in Log</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Direct Payouts</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full sm:w-auto">
            <Link
              to="/vendor/register"
              className="px-8 py-4 rounded-2xl bg-accent-500 hover:bg-accent-600 text-white font-bold text-xs sm:text-sm shadow-lg hover:shadow-accent-500/25 transition-all text-center flex items-center justify-center gap-2"
            >
              <span>Become a Vendor</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/login"
              className="px-8 py-3 rounded-2xl border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs transition-all text-center"
            >
              Vendor Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
