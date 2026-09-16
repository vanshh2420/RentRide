import React, { useState, useEffect, useRef } from 'react';
import { tripApi } from '../../services/tripApi';
import { 
  Navigation, 
  Clock, 
  Gauge, 
  Fuel, 
  IndianRupee, 
  ShieldCheck, 
  AlertTriangle, 
  MapPin, 
  Radio, 
  CheckCircle, 
  X,
  RefreshCw,
  Zap
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export const ActiveRentalDashboard = ({ bookingId, isOpen = true, onClose, isVendor = false }) => {
  const [liveData, setLiveData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const pathPolylineRef = useRef(null);
  const watchIdRef = useRef(null);

  // Initial and periodic fetch of authoritative live state from backend
  useEffect(() => {
    if (!bookingId || !isOpen) return;

    fetchLiveTrip();
    const interval = setInterval(fetchLiveTrip, 8000); // 8-second polling

    return () => clearInterval(interval);
  }, [bookingId, isOpen]);

  // Live timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchLiveTrip = async () => {
    try {
      const res = await tripApi.getLiveTripState(bookingId);
      setLiveData(res.data);
      setErrorMessage('');
    } catch (err) {
      console.warn('Failed to fetch live trip state:', err.message);
      setErrorMessage(err.message || 'Unable to fetch live trip telemetry');
    } finally {
      setIsLoading(false);
    }
  };

  // Browser Geolocation Telemetry Sync
  const toggleGpsTracking = () => {
    if (isGpsActive) {
      if (watchIdRef.current != null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsGpsActive(false);
      return;
    }

    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setGpsError('');
    setIsGpsActive(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude, accuracy, speed } = pos.coords;
        try {
          await tripApi.sendTelemetry(bookingId, {
            lat: latitude,
            lng: longitude,
            accuracy: accuracy || 10,
            speed: speed ? Math.round(speed * 3.6) : 0, // convert m/s to km/h
            timestamp: new Date(pos.timestamp)
          });
          // Refresh state after telemetry
          fetchLiveTrip();
        } catch (err) {
          console.warn('Telemetry submission rejected:', err.message);
        }
      },
      (err) => {
        console.warn('GPS watchPosition error:', err.message);
        setGpsError(`Location error: ${err.message}`);
        setIsGpsActive(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000
      }
    );
  };

  // Clean up GPS watcher on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current != null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!isOpen || !mapRef.current) return;

    const coords = liveData?.telemetry?.lastLocation;
    const initialLat = coords?.lat || 22.7196; // Indore default
    const initialLng = coords?.lng || 75.8577;

    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Update marker
    if (coords?.lat != null && coords?.lng != null) {
      const currentPos = [coords.lat, coords.lng];

      const liveIcon = L.divIcon({
        className: 'custom-live-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-8 h-8 bg-sky-500/30 rounded-full animate-ping absolute"></div>
            <div class="w-4 h-4 bg-sky-600 border-2 border-white rounded-full shadow-lg relative z-10"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      if (!markerRef.current) {
        markerRef.current = L.marker(currentPos, { icon: liveIcon }).addTo(map);
      } else {
        markerRef.current.setLatLng(currentPos);
      }

      // Update Waypoints polyline
      const waypoints = liveData.telemetry?.recentWaypoints || [];
      const latLngs = waypoints.map((w) => [w.lat, w.lng]);

      if (latLngs.length > 1) {
        if (!pathPolylineRef.current) {
          pathPolylineRef.current = L.polyline(latLngs, {
            color: '#0284c7',
            weight: 4,
            opacity: 0.8,
            dashArray: '6, 8'
          }).addTo(map);
        } else {
          pathPolylineRef.current.setLatLngs(latLngs);
        }
      }

      map.panTo(currentPos);
    }
  }, [liveData, isOpen]);

  // Clean up Leaflet on modal close
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  if (!isOpen) return null;

  const v = liveData?.vehicle;
  const tel = liveData?.telemetry;
  const fare = liveData?.liveFare;
  const fuel = liveData?.fuelCostEstimate;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 p-6 sm:p-8 animate-fadeIn">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
              <Navigation className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
                  Active Rental Telemetry & Live Fare
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping"></span>
                  {liveData?.status || 'ACTIVE'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Booking Reference: <strong className="font-mono">{liveData?.bookingNumber || '...'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchLiveTrip}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs"
              title="Refresh Telemetry"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-500">Synchronizing live rental telemetry...</p>
          </div>
        ) : (
          <>
            {/* Top Stat Ribbon: Duration, Live GPS Distance, Start Odometer */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-brand-500" /> Trip Duration
                </span>
                <div className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
                  {liveData?.elapsedFormatted || '0h 0m'}
                </div>
                <span className="text-[10px] text-slate-400 block">Plan: {liveData?.rentalPlan}</span>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-sky-500" /> Live Distance
                </span>
                <div className="font-heading font-extrabold text-lg text-sky-600 dark:text-sky-400">
                  {tel?.totalGpsDistanceKm || 0} km
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Allowed: {tel?.allowedKm || 250} km
                </span>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-amber-500" /> Start Odometer
                </span>
                <div className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
                  {liveData?.odometer?.startOdometer ? `${liveData.odometer.startOdometer} km` : 'Pending'}
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold block">Authoritative Basis</span>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-500" /> Live Estimated Fare
                </span>
                <div className="font-heading font-extrabold text-lg text-emerald-600 dark:text-emerald-400">
                  ₹{fare?.liveEstimatedTotal || 0}
                </div>
                <span className="text-[10px] text-slate-400 block">Includes deposit</span>
              </div>
            </div>

            {/* GPS Telemetry Controls & Live Map */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Live Telemetry Tracker
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Status: {tel?.gpsStatus || 'ACTIVE'}
                  </span>
                </div>

                {!isVendor && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleGpsTracking}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                        isGpsActive
                          ? 'bg-rose-600 hover:bg-rose-700 text-white'
                          : 'bg-brand-600 hover:bg-brand-700 text-white'
                      }`}
                    >
                      <Radio className={`w-3.5 h-3.5 ${isGpsActive ? 'animate-spin' : ''}`} />
                      <span>{isGpsActive ? 'Stop Live GPS Sync' : 'Start Live GPS Sync'}</span>
                    </button>
                  </div>
                )}
              </div>

              {gpsError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{gpsError}</span>
                </div>
              )}

              {/* Map Canvas */}
              <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner">
                <div ref={mapRef} className="w-full h-full"></div>
                <div className="absolute top-3 right-3 z-[400] px-3 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>OpenStreetMap Live Position</span>
                </div>
              </div>
            </div>

            {/* Split Grid: Live Fare Breakdown vs Fuel / Energy Consumption */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Left: Live Fare Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-brand-600" /> Live Fare Breakdown
                </h4>

                <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Base Rental Subtotal</span>
                    <span className="font-semibold text-slate-900 dark:text-white">₹{fare?.baseSubtotal}</span>
                  </div>

                  {tel?.extraKm > 0 && (
                    <div className="flex justify-between text-rose-600 font-bold">
                      <span>Extra Distance ({tel.extraKm} km × ₹{v?.extraKmCharge}/km)</span>
                      <span>+₹{tel.estimatedExtraKmCharge}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-500">
                    <span>Platform Fee + Taxes</span>
                    <span>₹{(fare?.platformFee || 0) + (fare?.taxAmount || 0)}</span>
                  </div>

                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Refundable Deposit</span>
                    <span>₹{fare?.securityDeposit}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
                    <span>Live Estimated Total</span>
                    <span className="text-emerald-600 font-extrabold">₹{fare?.liveEstimatedTotal}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-[11px] text-amber-800 dark:text-amber-200 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
                  <span>{fare?.notice}</span>
                </div>
              </div>

              {/* Right: Fuel & Energy Cost Estimation */}
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                    <Fuel className="w-4 h-4 text-amber-600" /> Fuel & Energy Consumption
                  </h4>
                  <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                    Operational Estimate
                  </span>
                </div>

                {fuel && fuel.isAvailable ? (
                  <div className="space-y-2 text-slate-600 dark:text-slate-300">
                    <div className="flex justify-between">
                      <span>Vehicle Fuel Economy</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {fuel.fuelEconomy} {fuel.fuelEconomyUnit}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>{fuel.city} Fuel Rate</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        ₹{fuel.fuelPricePerUnit}/{fuel.consumptionUnit}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Est. Consumed ({fuel.distanceKm} km)</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {fuel.estimatedConsumption} {fuel.consumptionUnit}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-amber-200 dark:border-amber-800/60 flex justify-between font-bold text-sm text-amber-950 dark:text-amber-200">
                      <span>Estimated Fuel Cost</span>
                      <span className="text-amber-700 dark:text-amber-300 font-extrabold">
                        ₹{fuel.estimatedCost}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 italic leading-relaxed pt-1">
                      Calculated from live GPS distance ({fuel.distanceKm} km). Fuel cost is an estimate and not an automatic customer fee.
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Fuel economy not specified for this vehicle ({v?.brand} {v?.model}).
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
