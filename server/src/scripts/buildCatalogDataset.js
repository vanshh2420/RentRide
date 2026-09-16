import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Verified Indian Vehicle Master Catalog Dataset
 * Real models, verified ARAI fuel economy, EV battery capacities & certified ranges,
 * precise engine displacements, transmission options, and specifications.
 */

const RAW_MODELS = [
  // =========================================================================
  // 1. ELECTRIC SCOOTERS (Category: 'electric-scooters', Type: 'two_wheeler')
  // =========================================================================
  {
    brand: 'Ather', model: '450X Gen 3', variant: '3.7 kWh',
    categorySlug: 'electric-scooters', vehicleType: 'two_wheeler', fuelType: 'electric', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 3.7, fuelEconomyValue: 150, fuelEconomyUnit: 'km/charge',
    features: ['7-inch Touchscreen TFT', 'Google Maps Navigation', 'Warp Mode', 'AutoHold Assist', 'Regenerative Braking', 'Bluetooth Audio & Calls'],
    specs: { groundClearanceMm: 153, batteryCapacityKwh: 3.7, maxPowerBhp: 8.5, maxTorqueNm: 26, kerbWeightKg: 111, topSpeedKmph: 90, chargingTimeHours: 5.5 },
    pricing: { hourly: 70, rate12h: 450, rate24h: 750 },
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Ather', model: '450S', variant: '2.9 kWh',
    categorySlug: 'electric-scooters', vehicleType: 'two_wheeler', fuelType: 'electric', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 2.9, fuelEconomyValue: 115, fuelEconomyUnit: 'km/charge',
    features: ['DeepView Display', 'Turn-by-Turn Navigation', 'Eco Mode', 'Reverse Mode', 'Regen Braking'],
    specs: { groundClearanceMm: 153, batteryCapacityKwh: 2.9, maxPowerBhp: 7.2, maxTorqueNm: 22, kerbWeightKg: 108, topSpeedKmph: 90, chargingTimeHours: 8.5 },
    pricing: { hourly: 60, rate12h: 400, rate24h: 650 },
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Ather', model: '450 Apex', variant: 'Special Edition 3.7 kWh',
    categorySlug: 'electric-scooters', vehicleType: 'two_wheeler', fuelType: 'electric', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 3.7, fuelEconomyValue: 157, fuelEconomyUnit: 'km/charge',
    features: ['Magic Twist Throttle', 'Warp+ Mode', 'Transparent Body Panels', 'Fast Charging', 'Connected Dashboard'],
    specs: { groundClearanceMm: 153, batteryCapacityKwh: 3.7, maxPowerBhp: 9.4, maxTorqueNm: 26, kerbWeightKg: 111, topSpeedKmph: 100, chargingTimeHours: 5.5 },
    pricing: { hourly: 85, rate12h: 550, rate24h: 900 },
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Ather', model: 'Rizta Z', variant: 'Family Electric 3.7 kWh',
    categorySlug: 'electric-scooters', vehicleType: 'two_wheeler', fuelType: 'electric', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 3.7, fuelEconomyValue: 160, fuelEconomyUnit: 'km/charge',
    features: ['Largest Seat in Category', 'Underseat Storage 34L', 'SkidControl Traction', 'TFT Navigation', 'Pillion Backrest'],
    specs: { groundClearanceMm: 165, batteryCapacityKwh: 3.7, maxPowerBhp: 5.8, maxTorqueNm: 22, kerbWeightKg: 119, topSpeedKmph: 80, chargingTimeHours: 6.0 },
    pricing: { hourly: 70, rate12h: 450, rate24h: 750 },
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Ola Electric', model: 'S1 Pro Gen 2', variant: '4.0 kWh',
    categorySlug: 'electric-scooters', vehicleType: 'two_wheeler', fuelType: 'electric', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 4.0, fuelEconomyValue: 195, fuelEconomyUnit: 'km/charge',
    features: ['Hyper Mode', 'MoveOS 4 Smart Tech', '34L Boot Space', 'Cruise Control', 'Proximity Lock', 'Party Mode'],
    specs: { groundClearanceMm: 160, batteryCapacityKwh: 4.0, maxPowerBhp: 14.7, maxTorqueNm: 58, kerbWeightKg: 116, topSpeedKmph: 120, chargingTimeHours: 6.5 },
    pricing: { hourly: 75, rate12h: 480, rate24h: 800 },
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Ola Electric', model: 'S1 Air', variant: '3.0 kWh',
    categorySlug: 'electric-scooters', vehicleType: 'two_wheeler', fuelType: 'electric', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 3.0, fuelEconomyValue: 151, fuelEconomyUnit: 'km/charge',
    features: ['Flat Floorboard', 'Twin Telescopic Suspension', 'Touchscreen Dashboard', 'Reverse Throttle', 'Hill Hold'],
    specs: { groundClearanceMm: 165, batteryCapacityKwh: 3.0, maxPowerBhp: 8.0, maxTorqueNm: 25, kerbWeightKg: 108, topSpeedKmph: 90, chargingTimeHours: 5.0 },
    pricing: { hourly: 60, rate12h: 400, rate24h: 650 },
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Ola Electric', model: 'S1 X Plus', variant: '3.0 kWh',
    categorySlug: 'electric-scooters', vehicleType: 'two_wheeler', fuelType: 'electric', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 3.0, fuelEconomyValue: 151, fuelEconomyUnit: 'km/charge',
    features: ['Multi-color Segmented Display', 'Physical Keyless Access', 'Sports Mode', 'Regen Brake System'],
    specs: { groundClearanceMm: 165, batteryCapacityKwh: 3.0, maxPowerBhp: 8.0, maxTorqueNm: 25, kerbWeightKg: 108, topSpeedKmph: 90, chargingTimeHours: 5.0 },
    pricing: { hourly: 55, rate12h: 360, rate24h: 600 },
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'TVS', model: 'iQube', variant: 'Standard 2.2 kWh',
    categorySlug: 'electric-scooters', vehicleType: 'two_wheeler', fuelType: 'electric', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 2.2, fuelEconomyValue: 75, fuelEconomyUnit: 'km/charge',
    features: ['TVS SmartXonnect', 'Q-Park Assist (Reverse)', 'Silent BLDC Motor', 'Regenerative Braking', 'LED Headlamp'],
    specs: { groundClearanceMm: 157, batteryCapacityKwh: 2.2, maxPowerBhp: 5.9, maxTorqueNm: 33, kerbWeightKg: 115, topSpeedKmph: 75, chargingTimeHours: 2.5 },
    pricing: { hourly: 55, rate12h: 360, rate24h: 600 },
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'TVS', model: 'iQube S', variant: '3.4 kWh',
    categorySlug: 'electric-scooters', vehicleType: 'two_wheeler', fuelType: 'electric', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 3.4, fuelEconomyValue: 100, fuelEconomyUnit: 'km/charge',
    features: ['7-inch TFT Cluster', 'HMI 5-way Joystick', 'Fast Charging Port', 'Large Luggage Space', 'Live Geo-fencing'],
    specs: { groundClearanceMm: 157, batteryCapacityKwh: 3.4, maxPowerBhp: 5.9, maxTorqueNm: 33, kerbWeightKg: 118, topSpeedKmph: 78, chargingTimeHours: 4.5 },
    pricing: { hourly: 65, rate12h: 420, rate24h: 700 },
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'TVS', model: 'iQube ST', variant: 'Long Range 5.1 kWh',
    categorySlug: 'electric-scooters', vehicleType: 'two_wheeler', fuelType: 'electric', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 5.1, fuelEconomyValue: 150, fuelEconomyUnit: 'km/charge',
    features: ['32L Boot Capacity (2 Helmets)', 'Fast Charge 950W', 'Music Controls', 'Voice Assist', 'Anti-theft Alarm'],
    specs: { groundClearanceMm: 157, batteryCapacityKwh: 5.1, maxPowerBhp: 5.9, maxTorqueNm: 33, kerbWeightKg: 128, topSpeedKmph: 82, chargingTimeHours: 4.2 },
    pricing: { hourly: 80, rate12h: 500, rate24h: 850 },
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Bajaj', model: 'Chetak Premium', variant: '3.2 kWh',
    categorySlug: 'electric-scooters', vehicleType: 'two_wheeler', fuelType: 'electric', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 3.2, fuelEconomyValue: 126, fuelEconomyUnit: 'km/charge',
    features: ['Full Metal Body', 'Color TFT Console', 'Turn-by-turn Navigation', 'Sequential LED Indicators', 'Onboard Charger'],
    specs: { groundClearanceMm: 160, batteryCapacityKwh: 3.2, maxPowerBhp: 5.6, maxTorqueNm: 20, kerbWeightKg: 134, topSpeedKmph: 73, chargingTimeHours: 4.5 },
    pricing: { hourly: 70, rate12h: 450, rate24h: 750 },
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Bajaj', model: 'Chetak Urbane', variant: '2.9 kWh',
    categorySlug: 'electric-scooters', vehicleType: 'two_wheeler', fuelType: 'electric', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 2.9, fuelEconomyValue: 113, fuelEconomyUnit: 'km/charge',
    features: ['Steel Frame Body', 'LCD Instrument Cluster', 'Hill Hold Assist', 'Reverse Gear', 'Remote Location Tracking'],
    specs: { groundClearanceMm: 160, batteryCapacityKwh: 2.9, maxPowerBhp: 5.6, maxTorqueNm: 20, kerbWeightKg: 130, topSpeedKmph: 63, chargingTimeHours: 4.8 },
    pricing: { hourly: 60, rate12h: 400, rate24h: 650 },
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Vida', model: 'V1 Pro', variant: 'Powered by Hero 3.94 kWh',
    categorySlug: 'electric-scooters', vehicleType: 'two_wheeler', fuelType: 'electric', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 3.94, fuelEconomyValue: 165, fuelEconomyUnit: 'km/charge',
    features: ['Removable Dual Batteries', '7-inch Touch TFT', 'Custom Ride Modes', 'Fast Charging (1.2 km/min)', 'Cruise Control'],
    specs: { groundClearanceMm: 155, batteryCapacityKwh: 3.94, maxPowerBhp: 8.0, maxTorqueNm: 25, kerbWeightKg: 125, topSpeedKmph: 80, chargingTimeHours: 5.5 },
    pricing: { hourly: 75, rate12h: 480, rate24h: 800 },
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Vida', model: 'V1 Plus', variant: 'Powered by Hero 3.44 kWh',
    categorySlug: 'electric-scooters', vehicleType: 'two_wheeler', fuelType: 'electric', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 3.44, fuelEconomyValue: 143, fuelEconomyUnit: 'km/charge',
    features: ['Modular Removable Battery', 'Keyless Remote Fob', 'Follow-me-home Lights', 'SOS Button'],
    specs: { groundClearanceMm: 155, batteryCapacityKwh: 3.44, maxPowerBhp: 8.0, maxTorqueNm: 25, kerbWeightKg: 124, topSpeedKmph: 80, chargingTimeHours: 5.0 },
    pricing: { hourly: 65, rate12h: 420, rate24h: 700 },
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Simple Energy', model: 'Simple One', variant: '5.0 kWh',
    categorySlug: 'electric-scooters', vehicleType: 'two_wheeler', fuelType: 'electric', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 5.0, fuelEconomyValue: 212, fuelEconomyUnit: 'km/charge',
    features: ['Longest Range in India', 'Fixed + Removable Battery', 'Sonic Mode', 'Custom Dashboard UI', '30L Boot Space'],
    specs: { groundClearanceMm: 164, batteryCapacityKwh: 5.0, maxPowerBhp: 11.4, maxTorqueNm: 72, kerbWeightKg: 134, topSpeedKmph: 105, chargingTimeHours: 5.8 },
    pricing: { hourly: 85, rate12h: 550, rate24h: 900 },
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'River', model: 'Indie', variant: 'SUV of Scooters 4.0 kWh',
    categorySlug: 'electric-scooters', vehicleType: 'two_wheeler', fuelType: 'electric', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 4.0, fuelEconomyValue: 120, fuelEconomyUnit: 'km/charge',
    features: ['43L Under-Seat Storage', '12L Front Glove Box', 'Pannier Mounts Included', '14-inch Alloy Wheels', 'Twin Beam Headlamps'],
    specs: { groundClearanceMm: 165, batteryCapacityKwh: 4.0, maxPowerBhp: 9.0, maxTorqueNm: 26, kerbWeightKg: 140, topSpeedKmph: 90, chargingTimeHours: 5.0 },
    pricing: { hourly: 75, rate12h: 480, rate24h: 800 },
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Hero Electric', model: 'Optima CX 5.0', variant: 'Dual Battery',
    categorySlug: 'electric-scooters', vehicleType: 'two_wheeler', fuelType: 'electric', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 3.0, fuelEconomyValue: 135, fuelEconomyUnit: 'km/charge',
    features: ['Dual Lithium Batteries', 'Digital Speedometer', 'USB Charging', 'Regenerative Braking'],
    specs: { groundClearanceMm: 140, batteryCapacityKwh: 3.0, maxPowerBhp: 2.6, maxTorqueNm: 15, kerbWeightKg: 102, topSpeedKmph: 55, chargingTimeHours: 4.5 },
    pricing: { hourly: 45, rate12h: 300, rate24h: 500 },
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Hero Electric', model: 'Photon LP', variant: '72V 26Ah',
    categorySlug: 'electric-scooters', vehicleType: 'two_wheeler', fuelType: 'electric', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 1.9, fuelEconomyValue: 90, fuelEconomyUnit: 'km/charge',
    features: ['High-torque BLDC motor', 'Anti-theft Wireless Alarm', 'Combi Braking System', 'Telescopic Suspension'],
    specs: { groundClearanceMm: 140, batteryCapacityKwh: 1.9, maxPowerBhp: 2.4, maxTorqueNm: 14, kerbWeightKg: 111, topSpeedKmph: 45, chargingTimeHours: 5.0 },
    pricing: { hourly: 45, rate12h: 300, rate24h: 500 },
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Okinawa', model: 'Praise Pro', variant: 'Lithium Detachable',
    categorySlug: 'electric-scooters', vehicleType: 'two_wheeler', fuelType: 'electric', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 2.08, fuelEconomyValue: 88, fuelEconomyUnit: 'km/charge',
    features: ['Detachable Lithium-ion Battery', 'Front Disc Brake', 'Central Locking with Alarm', 'Find My Scooter Feature'],
    specs: { groundClearanceMm: 175, batteryCapacityKwh: 2.08, maxPowerBhp: 3.6, maxTorqueNm: 18, kerbWeightKg: 96, topSpeedKmph: 58, chargingTimeHours: 3.0 },
    pricing: { hourly: 50, rate12h: 320, rate24h: 550 },
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Ampere', model: 'Nexus', variant: '3.0 kWh LFP',
    categorySlug: 'electric-scooters', vehicleType: 'two_wheeler', fuelType: 'electric', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 3.0, fuelEconomyValue: 136, fuelEconomyUnit: 'km/charge',
    features: ['Safe LFP Chemistry Battery', '7-inch Touchscreen', 'IP67 Waterproofing', 'Hybrid Cast Swingarm'],
    specs: { groundClearanceMm: 170, batteryCapacityKwh: 3.0, maxPowerBhp: 5.4, maxTorqueNm: 24, kerbWeightKg: 120, topSpeedKmph: 93, chargingTimeHours: 3.5 },
    pricing: { hourly: 65, rate12h: 420, rate24h: 700 },
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
  }
];

// Helper to generate the full dataset programmatically with realistic data
console.log('Building complete catalog generator...');
