import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import base electric scooters
import { catalogDefinitions as baseElectricScooters } from './catalogDefinitions.js';

// Build all remaining categories
const petrolScooters = [
  // Honda
  {
    brand: 'Honda', model: 'Activa 6G', variant: 'Standard 110cc',
    categorySlug: 'scooters', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 109.5, fuelEconomyValue: 50.0, fuelEconomyUnit: 'km/l',
    features: ['PGM-FI Fuel Injection', 'eSP Technology', 'Telescopic Suspension', 'External Fuel Fill', 'Engine Start/Stop Switch'],
    specs: { groundClearanceMm: 162, fuelTankCapacityLiters: 5.3, maxPowerBhp: 7.7, maxTorqueNm: 8.9, kerbWeightKg: 106, topSpeedKmph: 85 },
    pricing: { hourlyRate: 45, rate12Hour: 300, rate24Hour: 500 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Honda', model: 'Activa 6G', variant: 'Deluxe Smart Key',
    categorySlug: 'scooters', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 109.5, fuelEconomyValue: 50.0, fuelEconomyUnit: 'km/l',
    features: ['Honda Smart Key', 'Anti-Theft System', 'Smart Safe Unlock', 'LED Headlamp', 'Alloy Wheels'],
    specs: { groundClearanceMm: 162, fuelTankCapacityLiters: 5.3, maxPowerBhp: 7.7, maxTorqueNm: 8.9, kerbWeightKg: 105, topSpeedKmph: 85 },
    pricing: { hourlyRate: 50, rate12Hour: 320, rate24Hour: 550 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Honda', model: 'Activa 125', variant: 'Disc Smart Key',
    categorySlug: 'scooters', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 124.0, fuelEconomyValue: 47.0, fuelEconomyUnit: 'km/l',
    features: ['Digital-Analogue Meter with Mileage Indicator', 'Idling Stop System', 'Front Disc Brake', 'Side Stand Engine Cut-off'],
    specs: { groundClearanceMm: 162, fuelTankCapacityLiters: 5.3, maxPowerBhp: 8.2, maxTorqueNm: 10.4, kerbWeightKg: 109, topSpeedKmph: 90 },
    pricing: { hourlyRate: 50, rate12Hour: 330, rate24Hour: 550 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Honda', model: 'Dio 110', variant: 'Sports Edition',
    categorySlug: 'scooters', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 109.5, fuelEconomyValue: 48.0, fuelEconomyUnit: 'km/l',
    features: ['Sporty Moto-Scooter Styling', 'Split Grab Rails', 'LED Position Lamps', 'External Lid Fuel Filling'],
    specs: { groundClearanceMm: 160, fuelTankCapacityLiters: 5.3, maxPowerBhp: 7.7, maxTorqueNm: 9.0, kerbWeightKg: 103, topSpeedKmph: 83 },
    pricing: { hourlyRate: 45, rate12Hour: 300, rate24Hour: 500 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Honda', model: 'Dio 125', variant: 'Smart 125cc',
    categorySlug: 'scooters', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 123.9, fuelEconomyValue: 45.0, fuelEconomyUnit: 'km/l',
    features: ['Sporty Dual-Tone Muffler', 'Fully Digital Cluster', 'Smart Key with Keyless Ign', 'Wider 90/90 Tubeless Tyres'],
    specs: { groundClearanceMm: 171, fuelTankCapacityLiters: 5.3, maxPowerBhp: 8.2, maxTorqueNm: 10.4, kerbWeightKg: 104, topSpeedKmph: 92 },
    pricing: { hourlyRate: 50, rate12Hour: 330, rate24Hour: 550 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  // TVS
  {
    brand: 'TVS', model: 'Jupiter 110', variant: 'ZX SmartXonnect',
    categorySlug: 'scooters', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 109.7, fuelEconomyValue: 52.0, fuelEconomyUnit: 'km/l',
    features: ['Bluetooth Navigation Assistance', 'i-TOUCHstart Silent Motor', 'Front External Fuel Fill', 'Metal Body'],
    specs: { groundClearanceMm: 163, fuelTankCapacityLiters: 5.8, maxPowerBhp: 7.8, maxTorqueNm: 8.8, kerbWeightKg: 107, topSpeedKmph: 85 },
    pricing: { hourlyRate: 45, rate12Hour: 300, rate24Hour: 500 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'TVS', model: 'Jupiter 125', variant: 'Disc with 33L Boot',
    categorySlug: 'scooters', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 124.8, fuelEconomyValue: 50.0, fuelEconomyUnit: 'km/l',
    features: ['Class Leading 33L Underseat Storage (Fits 2 Full Helmets)', 'Floorboard Front Fuel Tank', 'Longest Seat (790mm)'],
    specs: { groundClearanceMm: 163, fuelTankCapacityLiters: 5.1, maxPowerBhp: 8.0, maxTorqueNm: 10.5, kerbWeightKg: 108, topSpeedKmph: 88 },
    pricing: { hourlyRate: 50, rate12Hour: 320, rate24Hour: 550 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'TVS', model: 'Ntorq 125', variant: 'Race XP Edition',
    categorySlug: 'scooters', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 124.8, fuelEconomyValue: 42.0, fuelEconomyUnit: 'km/l',
    features: ['Dual Ride Modes (Race & Street)', 'Voice Assist & Connected Tech', '10.06 PS 3-Valve Engine', 'Petal Disc Brakes'],
    specs: { groundClearanceMm: 155, fuelTankCapacityLiters: 5.8, maxPowerBhp: 10.1, maxTorqueNm: 10.8, kerbWeightKg: 111, topSpeedKmph: 98 },
    pricing: { hourlyRate: 60, rate12Hour: 380, rate24Hour: 650 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'TVS', model: 'Ntorq 125', variant: 'Super Squad Edition (Marvel)',
    categorySlug: 'scooters', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 124.8, fuelEconomyValue: 42.0, fuelEconomyUnit: 'km/l',
    features: ['Marvel Graphic Livery', 'SmartXonnect App integration', 'Engine Kill Switch', 'Hazard Lights'],
    specs: { groundClearanceMm: 155, fuelTankCapacityLiters: 5.8, maxPowerBhp: 9.25, maxTorqueNm: 10.5, kerbWeightKg: 118, topSpeedKmph: 95 },
    pricing: { hourlyRate: 60, rate12Hour: 380, rate24Hour: 650 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'TVS', model: 'Scooty Zest 110', variant: 'Matte Series',
    categorySlug: 'scooters', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 109.7, fuelEconomyValue: 55.0, fuelEconomyUnit: 'km/l',
    features: ['Lightweight Easy Handling', '19L Underseat Storage', 'Eco Thrust Fuel Injection', 'LED DRL'],
    specs: { groundClearanceMm: 150, fuelTankCapacityLiters: 5.0, maxPowerBhp: 7.7, maxTorqueNm: 8.8, kerbWeightKg: 97, topSpeedKmph: 80 },
    pricing: { hourlyRate: 40, rate12Hour: 260, rate24Hour: 450 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  // Suzuki
  {
    brand: 'Suzuki', model: 'Access 125', variant: 'Special Edition Disc CBS',
    categorySlug: 'scooters', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 124.0, fuelEconomyValue: 52.5, fuelEconomyUnit: 'km/l',
    features: ['Suzuki Eco Performance (SEP)', 'Bluetooth Ride Connect Console', 'Chrome Mirrors & Retro Styling', 'External Fuel Filler'],
    specs: { groundClearanceMm: 160, fuelTankCapacityLiters: 5.0, maxPowerBhp: 8.6, maxTorqueNm: 10.0, kerbWeightKg: 103, topSpeedKmph: 92 },
    pricing: { hourlyRate: 50, rate12Hour: 330, rate24Hour: 550 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Suzuki', model: 'Burgman Street 125', variant: 'Maxi Scooter EX',
    categorySlug: 'scooters', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 124.0, fuelEconomyValue: 48.0, fuelEconomyUnit: 'km/l',
    features: ['Maxi-Scooter Ergonomics', 'Extended Long Footboard', '12-inch Rear Wheel', 'Silent Start System (EASS)'],
    specs: { groundClearanceMm: 160, fuelTankCapacityLiters: 5.5, maxPowerBhp: 8.5, maxTorqueNm: 10.0, kerbWeightKg: 111, topSpeedKmph: 95 },
    pricing: { hourlyRate: 60, rate12Hour: 380, rate24Hour: 650 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Suzuki', model: 'Avenis 125', variant: 'Race Edition',
    categorySlug: 'scooters', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 124.0, fuelEconomyValue: 49.0, fuelEconomyUnit: 'km/l',
    features: ['Sporty Aerodynamic Front Apron', 'Digital Console with Turn-by-Turn Navigation', 'Split Grab Rail', 'USB Socket'],
    specs: { groundClearanceMm: 160, fuelTankCapacityLiters: 5.2, maxPowerBhp: 8.6, maxTorqueNm: 10.0, kerbWeightKg: 106, topSpeedKmph: 90 },
    pricing: { hourlyRate: 55, rate12Hour: 350, rate24Hour: 600 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  // Yamaha
  {
    brand: 'Yamaha', model: 'RayZR 125 Fi', variant: 'Hybrid Disc Street Rally',
    categorySlug: 'scooters', vehicleType: 'two_wheeler', fuelType: 'hybrid', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 125.0, fuelEconomyValue: 58.0, fuelEconomyUnit: 'km/l',
    features: ['Smart Motor Generator (SMG) Electric Assist', 'Ultra Light (99 kg)', 'Stop & Start System', 'Block Pattern Knobby Tyres'],
    specs: { groundClearanceMm: 145, fuelTankCapacityLiters: 5.2, maxPowerBhp: 8.2, maxTorqueNm: 10.3, kerbWeightKg: 99, topSpeedKmph: 90 },
    pricing: { hourlyRate: 50, rate12Hour: 340, rate24Hour: 580 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Yamaha', model: 'Fascino 125 Fi', variant: 'Hybrid Chrome Edition',
    categorySlug: 'scooters', vehicleType: 'two_wheeler', fuelType: 'hybrid', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 125.0, fuelEconomyValue: 58.0, fuelEconomyUnit: 'km/l',
    features: ['European Classic Curvilinear Styling', 'Electric Power Assist', 'Quiet Engine Start', 'Y-Connect App'],
    specs: { groundClearanceMm: 145, fuelTankCapacityLiters: 5.2, maxPowerBhp: 8.2, maxTorqueNm: 10.3, kerbWeightKg: 99, topSpeedKmph: 88 },
    pricing: { hourlyRate: 50, rate12Hour: 340, rate24Hour: 580 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Yamaha', model: 'Aerox 155', variant: 'Version S Traction Control',
    categorySlug: 'scooters', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 155.0, fuelEconomyValue: 42.0, fuelEconomyUnit: 'km/l',
    features: ['R15-derived 155cc Liquid-Cooled VVA Engine', 'Traction Control System (TCS)', 'Smart Key Keyless', '14-inch Wide Tyres', 'Front Disc with ABS'],
    specs: { groundClearanceMm: 145, fuelTankCapacityLiters: 5.5, maxPowerBhp: 15.0, maxTorqueNm: 13.9, kerbWeightKg: 126, topSpeedKmph: 115 },
    pricing: { hourlyRate: 90, rate12Hour: 600, rate24Hour: 1000 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  // Hero
  {
    brand: 'Hero', model: 'Pleasure Plus', variant: 'XTEC Connected',
    categorySlug: 'scooters', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 110.9, fuelEconomyValue: 50.0, fuelEconomyUnit: 'km/l',
    features: ['Projector LED Headlamp', 'Bluetooth Calling Alert', 'i3S Idle Stop-Start', 'Metal Body Fender'],
    specs: { groundClearanceMm: 155, fuelTankCapacityLiters: 4.8, maxPowerBhp: 8.0, maxTorqueNm: 8.7, kerbWeightKg: 104, topSpeedKmph: 78 },
    pricing: { hourlyRate: 40, rate12Hour: 280, rate24Hour: 480 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Hero', model: 'Xoom 110', variant: 'ZX Corner Bending Lights',
    categorySlug: 'scooters', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 110.9, fuelEconomyValue: 48.0, fuelEconomyUnit: 'km/l',
    features: ['First-in-Segment Corner Bending Lights', 'Big 12-inch Diamond Cut Alloys', 'Aerodynamic Design', 'Digital Cluster with Real-time Mileage'],
    specs: { groundClearanceMm: 155, fuelTankCapacityLiters: 5.2, maxPowerBhp: 8.05, maxTorqueNm: 8.7, kerbWeightKg: 109, topSpeedKmph: 85 },
    pricing: { hourlyRate: 45, rate12Hour: 300, rate24Hour: 520 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Hero', model: 'Destini 125', variant: 'XTEC Prime',
    categorySlug: 'scooters', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 124.6, fuelEconomyValue: 47.0, fuelEconomyUnit: 'km/l',
    features: ['Chrome Accents', 'Backrest for Pillion', 'Hero i3S Tech', 'Mobile Charging Port with Boot Light'],
    specs: { groundClearanceMm: 155, fuelTankCapacityLiters: 5.0, maxPowerBhp: 9.0, maxTorqueNm: 10.4, kerbWeightKg: 114, topSpeedKmph: 85 },
    pricing: { hourlyRate: 45, rate12Hour: 300, rate24Hour: 520 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  // Vespa
  {
    brand: 'Vespa', model: 'VXL 125', variant: 'Classic Italian Monocoque',
    categorySlug: 'scooters', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 124.4, fuelEconomyValue: 45.0, fuelEconomyUnit: 'km/l',
    features: ['Pressed Steel Monocoque Body', '3-Valve i-Get Engine', 'Front Disc with Single Channel ABS', 'Iconic Round LED Lamp'],
    specs: { groundClearanceMm: 155, fuelTankCapacityLiters: 7.4, maxPowerBhp: 9.9, maxTorqueNm: 9.6, kerbWeightKg: 115, topSpeedKmph: 90 },
    pricing: { hourlyRate: 75, rate12Hour: 480, rate24Hour: 800 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Vespa', model: 'SXL 150', variant: 'Sporty Rectangular Lamp',
    categorySlug: 'scooters', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 149.5, fuelEconomyValue: 38.0, fuelEconomyUnit: 'km/l',
    features: ['150cc High Performance Engine', 'Wide Tyres with Black Alloys', 'ABS Braking', 'Signature Rectangular Headlight'],
    specs: { groundClearanceMm: 155, fuelTankCapacityLiters: 7.4, maxPowerBhp: 10.5, maxTorqueNm: 11.26, kerbWeightKg: 115, topSpeedKmph: 95 },
    pricing: { hourlyRate: 85, rate12Hour: 550, rate24Hour: 900 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  // Aprilia
  {
    brand: 'Aprilia', model: 'SR 125', variant: 'Racing Heritage',
    categorySlug: 'scooters', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 124.4, fuelEconomyValue: 40.0, fuelEconomyUnit: 'km/l',
    features: ['14-inch Large Alloy Wheels', 'Twin Chamber LED Headlamp', 'Digital Instrument Cluster', 'Sport Suspension Tuning'],
    specs: { groundClearanceMm: 169, fuelTankCapacityLiters: 6.0, maxPowerBhp: 9.9, maxTorqueNm: 9.7, kerbWeightKg: 115, topSpeedKmph: 92 },
    pricing: { hourlyRate: 65, rate12Hour: 420, rate24Hour: 700 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Aprilia', model: 'SR 160', variant: 'Race Edition Carbon Finish',
    categorySlug: 'scooters', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 160.0, fuelEconomyValue: 35.0, fuelEconomyUnit: 'km/l',
    features: ['160cc 3V Tech Engine', 'Single Channel ABS', 'Aprilia MotoGP Inspired Graphics', 'Sharp Cornering Dynamic Chassis'],
    specs: { groundClearanceMm: 169, fuelTankCapacityLiters: 6.0, maxPowerBhp: 11.2, maxTorqueNm: 13.4, kerbWeightKg: 118, topSpeedKmph: 100 },
    pricing: { hourlyRate: 80, rate12Hour: 500, rate24Hour: 850 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Aprilia', model: 'SXR 160', variant: 'Maxi Touring Edition',
    categorySlug: 'scooters', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: 160.0, fuelEconomyValue: 36.0, fuelEconomyUnit: 'km/l',
    features: ['CrossMax Design Concept', 'Ergonomic Wide Touring Seat', 'Large Smoked Flyscreen', 'Full Digital Cluster'],
    specs: { groundClearanceMm: 161, fuelTankCapacityLiters: 7.0, maxPowerBhp: 10.9, maxTorqueNm: 11.6, kerbWeightKg: 129, topSpeedKmph: 98 },
    pricing: { hourlyRate: 85, rate12Hour: 550, rate24Hour: 900 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  }
];

console.log(`Prepared ${petrolScooters.length} verified petrol/hybrid scooter models.`);
