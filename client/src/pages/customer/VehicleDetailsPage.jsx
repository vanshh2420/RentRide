import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { vehicleApi } from '../../services/vehicleApi';
import { bookingApi } from '../../services/bookingApi';
import { VehicleReviewsList } from '../../features/reviews/VehicleReviewsList';
import { FareCalculator } from '../../features/pricing/FareCalculator';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { DetailSkeleton } from '../../components/common/Skeleton';
import { 
  Star, 
  MapPin, 
  Fuel, 
  Users, 
  ShieldCheck, 
  Clock, 
  Zap, 
  Check, 
  Store, 
  Calendar, 
  ArrowRight,
  Info,
  Car,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Gauge,
  Navigation
} from 'lucide-react';
import { MapView } from '../../components/common/MapView';
import { getOptimizedImageUrl } from '../../utils/imageUtils';
import { cn } from '../../utils/cn';

export const VehicleDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    setIsLoading(true);
    try {
      const res = await vehicleApi.getVehicleById(id);
      setVehicle(res.data.vehicle);
    } catch (err) {
      setError(err.message || 'Failed to load vehicle details');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (error || !vehicle) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
          <Car className="w-7 h-7" />
        </div>
        <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">Vehicle Not Found</h2>
        <p className="text-sm text-slate-500">{error || 'This vehicle is no longer available in the fleet.'}</p>
        <Link to="/explore" className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-sm">
          <span>Back to Fleet</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  const images = vehicle.images?.length > 0 ? vehicle.images : [
    { url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80' }
  ];

  const isElectric = vehicle.fuelType === 'electric';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Fleet Explore', href: '/explore' },
          { label: `${vehicle.brand} ${vehicle.model}` }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        
        {/* Left Column (8 cols): Media Gallery, Specs, Inclusions, Map, Reviews */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          
          {/* Main Showcase Image & Thumbnails */}
          <div className="space-y-3">
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-800 shadow-card">
              <img
                src={getOptimizedImageUrl(images[selectedImage]?.url || images[0].url, 'detail')}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay Badges */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-mono font-bold uppercase tracking-wider border border-white/10 shadow-xs">
                  {vehicle.registrationNumber}
                </span>
                {isElectric && (
                  <span className="px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>EV</span>
                  </span>
                )}
              </div>

              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-emerald-500/90 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{vehicle.catalogId ? 'Verified Fleet' : 'Partner Verified'}</span>
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      "w-20 h-16 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0",
                      selectedImage === idx
                        ? "border-brand-600 scale-105 shadow-md ring-2 ring-brand-400/20"
                        : "border-transparent opacity-70 hover:opacity-100"
                    )}
                  >
                    <img
                      src={getOptimizedImageUrl(img.url, 'thumbnail')}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Heading & Basic Meta */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-brand-50 text-brand-700 dark:bg-brand-950/80 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                {vehicle.categoryId?.name || 'Ride'}
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 text-xs font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{vehicle.ratingAverage ? vehicle.ratingAverage.toFixed(1) : '5.0'}</span>
                <span className="text-slate-400 font-normal">({vehicle.ratingCount || 0} reviews)</span>
              </div>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              {vehicle.brand} {vehicle.model}
            </h1>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <MapPin className="w-4 h-4 text-brand-600" />
              <span>{vehicle.location?.address ? `${vehicle.location.address}, ` : ''}{vehicle.location?.city}</span>
            </div>
          </div>

          {/* Technical Specifications Grid */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-subtle">
            <h2 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
              Vehicle Specifications
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 space-y-1">
                <span className="text-slate-400 uppercase font-semibold text-[10px]">Fuel & Motor</span>
                <p className="font-bold text-slate-900 dark:text-white capitalize text-sm">{vehicle.fuelType}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 space-y-1">
                <span className="text-slate-400 uppercase font-semibold text-[10px]">Transmission</span>
                <p className="font-bold text-slate-900 dark:text-white capitalize text-sm">{vehicle.transmission}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 space-y-1">
                <span className="text-slate-400 uppercase font-semibold text-[10px]">Seating Capacity</span>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{vehicle.seatingCapacity} Persons</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 space-y-1">
                <span className="text-slate-400 uppercase font-semibold text-[10px]">Displacement / Power</span>
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  {vehicle.engineCapacity ? `${vehicle.engineCapacity} ${isElectric ? 'kWh' : 'cc'}` : 'Standard'}
                </p>
              </div>

              {/* Fuel Economy */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 space-y-1 col-span-2 sm:col-span-1">
                <span className="text-emerald-700 dark:text-emerald-300 uppercase font-semibold text-[10px] flex items-center gap-1">
                  <Gauge className="w-3 h-3" /> Mileage
                </span>
                <p className="font-extrabold text-emerald-900 dark:text-emerald-200 text-sm">
                  {vehicle.fuelEconomy
                    ? `${vehicle.fuelEconomy} ${vehicle.fuelEconomyUnit || 'km/l'}`
                    : 'Standard'}
                </p>
              </div>
            </div>
          </div>

          {/* Features & Inclusions */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-subtle">
            <h2 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
              Features & Rental Inclusions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(vehicle.features && vehicle.features.length > 0
                ? vehicle.features
                : [
                    'GPS Navigation Enabled',
                    'Complimentary Helmet / Toolkit',
                    'Zero Overlap Guarantee',
                    'Comprehensive Insurance Cover',
                    'Clean & Sanitized Vehicle',
                    '24/7 Roadside Assistance'
                  ]
              ).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vendor Partner Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-subtle">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold text-xl shadow-md flex-shrink-0">
                <Store className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fleet Partner</span>
                <h4 className="font-heading font-extrabold text-base text-slate-900 dark:text-white">
                  {vehicle.vendorId?.vendorProfile?.businessName || vehicle.vendorId?.name || 'RentRide Verified Partner'}
                </h4>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Commercial GST Verified • Physical Dispatch Hub
                </p>
              </div>
            </div>

            {/* Verified Reviews Modal */}
            <VehicleReviewsList
              vehicleId={vehicle._id}
              ratingAverage={vehicle.ratingAverage || 5.0}
              ratingCount={vehicle.ratingCount || 0}
            />
          </div>

          {/* Interactive Pickup Location Map */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-subtle">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-600" /> Pickup Hub Location
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {vehicle.location?.address ? `${vehicle.location.address}, ` : ''}{vehicle.location?.city}
                </p>
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${vehicle.location?.coordinates?.lat || 22.7196},${vehicle.location?.coordinates?.lng || 75.8577}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-950 dark:hover:bg-brand-900 text-brand-700 dark:text-brand-300 text-xs font-bold transition-all border border-brand-200 dark:border-brand-800 self-start sm:self-auto"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>View Directions ↗</span>
              </a>
            </div>

            <MapView
              singleVehicle={vehicle}
              centerCity={vehicle.location?.city || 'Indore'}
              height="280px"
            />
          </div>

        </div>

        {/* Right Column (4-5 cols): Sticky Authoritative Fare Calculator */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <div className="sticky top-24">
            <FareCalculator
              vehicle={vehicle}
              onProceed={(plan, hours, pickup) => {
                navigate(`/checkout/${vehicle._id}?plan=${plan}&hours=${hours}&pickup=${encodeURIComponent(pickup)}`);
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default VehicleDetailsPage;
