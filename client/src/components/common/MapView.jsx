import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

// Default Hub Coordinates for MP
const CITY_COORDINATES = {
  indore: { lat: 22.7196, lng: 75.8577 },
  bhopal: { lat: 23.2599, lng: 77.4126 },
  gwalior: { lat: 26.2183, lng: 78.1828 },
  bangalore: { lat: 12.9716, lng: 77.5946 }
};

export const MapView = ({
  vehicles = [],
  singleVehicle = null,
  userLocation = null,
  centerCity = 'Indore',
  zoom = 13,
  height = '360px',
  className = '',
  onSelectVehicle = null
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  const getCoordinatesForVehicle = (v) => {
    const lat = v?.computedCoordinates?.lat || v?.location?.coordinates?.lat;
    const lng = v?.computedCoordinates?.lng || v?.location?.coordinates?.lng;

    if (lat && lng && (lat !== 0 || lng !== 0)) {
      return { lat: Number(lat), lng: Number(lng) };
    }

    // City center fallback
    const cityName = (v?.location?.city || centerCity || 'Indore').toLowerCase();
    for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
      if (cityName.includes(key)) {
        // Add subtle random jitter to avoid completely stacked pins if multiple vehicles in same hub
        const jitterLat = (Math.random() - 0.5) * 0.012;
        const jitterLng = (Math.random() - 0.5) * 0.012;
        return { lat: coords.lat + jitterLat, lng: coords.lng + jitterLng };
      }
    }

    return CITY_COORDINATES.indore;
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing instance if container re-rendered
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const initialCenter = singleVehicle
      ? getCoordinatesForVehicle(singleVehicle)
      : userLocation || CITY_COORDINATES[centerCity.toLowerCase()] || CITY_COORDINATES.indore;

    const map = L.map(mapContainerRef.current, {
      center: [initialCenter.lat, initialCenter.lng],
      zoom: zoom,
      scrollWheelZoom: false
    });

    // OpenStreetMap free tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when vehicles or singleVehicle changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();

    const bounds = L.latLngBounds([]);

    // 1. If user location is provided, render blue user dot
    if (userLocation?.lat && userLocation?.lng) {
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div style="width: 18px; height: 18px; background: #2563eb; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 0 10px rgba(37, 99, 235, 0.6);"></div>
        `,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });

      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .bindPopup('<b>Your Current Location</b>')
        .addTo(markersLayer);

      bounds.extend([userLocation.lat, userLocation.lng]);
    }

    // 2. Single Vehicle Mode (For Vehicle Details Page)
    if (singleVehicle) {
      const coords = getCoordinatesForVehicle(singleVehicle);
      const isTwoWheeler = singleVehicle.categoryId?.type === 'two_wheeler';

      const singleIcon = L.divIcon({
        className: 'custom-vendor-pin',
        html: `
          <div style="background: #2563eb; color: #fff; padding: 4px 8px; border-radius: 12px; font-weight: 700; font-size: 11px; display: flex; align-items: center; gap: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.25); border: 2px solid #fff;">
            <span>📍 ${singleVehicle.brand} ${singleVehicle.model}</span>
          </div>
        `,
        iconSize: [120, 30],
        iconAnchor: [60, 15]
      });

      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;

      const popupContent = `
        <div style="font-family: sans-serif; min-width: 180px; padding: 4px;">
          <h4 style="margin: 0 0 4px 0; font-weight: 800; font-size: 13px; color: #0f172a;">${singleVehicle.brand} ${singleVehicle.model}</h4>
          <p style="margin: 0 0 6px 0; font-size: 11px; color: #64748b;">${singleVehicle.location?.address || 'Pickup Hub'}, ${singleVehicle.location?.city}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-weight: 700; color: #2563eb; font-size: 12px;">₹${singleVehicle.pricing?.hourlyRate}/hr</span>
            ${singleVehicle.distanceKm !== undefined ? `<span style="font-size: 10px; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 6px;">${singleVehicle.distanceKm} km away</span>` : ''}
          </div>
          <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" style="display: block; text-align: center; background: #2563eb; color: #ffffff; text-decoration: none; padding: 6px; border-radius: 8px; font-size: 11px; font-weight: 700;">
            View Directions ↗
          </a>
        </div>
      `;

      L.marker([coords.lat, coords.lng], { icon: singleIcon })
        .bindPopup(popupContent)
        .addTo(markersLayer)
        .openPopup();

      map.setView([coords.lat, coords.lng], 14);
      return;
    }

    // 3. Multi-Vehicle Fleet Mode (For Explore Page)
    if (vehicles && vehicles.length > 0) {
      vehicles.forEach((v, idx) => {
        const coords = getCoordinatesForVehicle(v);
        bounds.extend([coords.lat, coords.lng]);

        const pinIcon = L.divIcon({
          className: 'custom-fleet-pin',
          html: `
            <div style="background: #1e293b; color: #ffffff; padding: 3px 7px; border-radius: 10px; font-weight: 800; font-size: 10px; border: 1.5px solid #38bdf8; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 3px; cursor: pointer;">
              <span>₹${v.pricing?.hourlyRate}/h</span>
            </div>
          `,
          iconSize: [64, 24],
          iconAnchor: [32, 12]
        });

        const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;

        const popupHtml = `
          <div style="font-family: sans-serif; width: 170px; padding: 2px;">
            <div style="font-weight: 800; font-size: 12px; margin-bottom: 2px; color: #0f172a;">${v.brand} ${v.model}</div>
            <div style="font-size: 10px; color: #64748b; margin-bottom: 4px;">${v.location?.address || 'Pickup Hub'}, ${v.location?.city}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-weight: 800; color: #2563eb; font-size: 11px;">₹${v.pricing?.hourlyRate}/hr</span>
              ${v.distanceKm !== undefined ? `<span style="font-size: 10px; color: #059669; font-weight: 700;">${v.distanceKm} km</span>` : ''}
            </div>
            <div style="display: flex; gap: 4px;">
              <a href="/vehicles/${v._id}" style="flex: 1; text-align: center; background: #2563eb; color: #fff; text-decoration: none; padding: 4px 0; border-radius: 6px; font-size: 10px; font-weight: 700;">
                Details
              </a>
              <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" style="flex: 1; text-align: center; background: #f1f5f9; color: #334155; text-decoration: none; padding: 4px 0; border-radius: 6px; font-size: 10px; font-weight: 600;">
                Directions ↗
              </a>
            </div>
          </div>
        `;

        const marker = L.marker([coords.lat, coords.lng], { icon: pinIcon })
          .bindPopup(popupHtml)
          .addTo(markersLayer);

        marker.on('click', () => {
          if (onSelectVehicle) onSelectVehicle(v);
        });
      });

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
      }
    }
  }, [vehicles, singleVehicle, userLocation]);

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-glass z-0 ${className}`}>
      <div ref={mapContainerRef} style={{ height: height, width: '100%' }} />
      <div className="absolute bottom-2 right-2 z-[400] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] text-slate-500 font-medium border border-slate-200 dark:border-slate-800">
        OpenStreetMap • Leaflet
      </div>
    </div>
  );
};
