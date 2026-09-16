import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Full array of models across all categories
const allVehicles = [];

// Helper to push models with standard catalog attributes
function addModel({
  brand, model, variant = '', categorySlug, vehicleType, fuelType, transmission,
  seatingCapacity, engineCapacity, fuelEconomyValue, fuelEconomyUnit,
  features = [], specs = {}, pricing = {}, imageUrl
}) {
  const brandSlug = brand.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const modelSlug = model.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const variantSlug = variant ? variant.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
  const catalogKey = `${brandSlug}-${modelSlug}${variantSlug ? `-${variantSlug}` : ''}`
    .replace(/-+/g, '-').replace(/(^-|-$)/g, '');

  allVehicles.push({
    catalogKey,
    brand,
    model,
    variant,
    categorySlug,
    vehicleType,
    fuelType,
    transmission,
    seatingCapacity,
    engineCapacity: engineCapacity ?? null,
    fuelEconomy: {
      value: fuelEconomyValue,
      unit: fuelEconomyUnit || (fuelType === 'electric' ? 'km/charge' : fuelType === 'cng' ? 'km/kg' : 'km/l'),
      source: 'ARAI / Manufacturer Certified'
    },
    features,
    specifications: specs,
    images: [
      {
        url: imageUrl,
        publicId: `rentride/catalog/${catalogKey}`,
        isPrimary: true,
        altText: `${brand} ${model} ${variant}`.trim()
      }
    ],
    suggestedPricing: {
      hourlyRate: pricing.hourlyRate || (vehicleType === 'two_wheeler' ? 60 : 150),
      rate12Hour: pricing.rate12Hour || (vehicleType === 'two_wheeler' ? 400 : 1000),
      rate24Hour: pricing.rate24Hour || (vehicleType === 'two_wheeler' ? 700 : 1700)
    },
    isActive: true
  });
}

console.log('Generating comprehensive vehicle catalog with 320+ models...');

// -------------------------------------------------------------
// 1. ELECTRIC SCOOTERS (32 Models)
// -------------------------------------------------------------
const eScooters = [
  { brand: 'Ather', model: '450X Gen 3', variant: '3.7 kWh', capacity: 3.7, range: 150, power: 8.5, torque: 26, topSpeed: 90, chargeTime: 5.5, price: { hourlyRate: 70, rate12Hour: 450, rate24Hour: 750 } },
  { brand: 'Ather', model: '450S', variant: '2.9 kWh', capacity: 2.9, range: 115, power: 7.2, torque: 22, topSpeed: 90, chargeTime: 8.5, price: { hourlyRate: 60, rate12Hour: 400, rate24Hour: 650 } },
  { brand: 'Ather', model: '450 Apex', variant: 'Special 3.7 kWh', capacity: 3.7, range: 157, power: 9.4, torque: 26, topSpeed: 100, chargeTime: 5.5, price: { hourlyRate: 85, rate12Hour: 550, rate24Hour: 900 } },
  { brand: 'Ather', model: 'Rizta Z', variant: '3.7 kWh Family', capacity: 3.7, range: 160, power: 5.8, torque: 22, topSpeed: 80, chargeTime: 6.0, price: { hourlyRate: 70, rate12Hour: 450, rate24Hour: 750 } },
  { brand: 'Ather', model: 'Rizta S', variant: '2.9 kWh', capacity: 2.9, range: 123, power: 5.8, torque: 22, topSpeed: 80, chargeTime: 6.5, price: { hourlyRate: 60, rate12Hour: 400, rate24Hour: 650 } },
  { brand: 'Ola Electric', model: 'S1 Pro Gen 2', variant: '4.0 kWh', capacity: 4.0, range: 195, power: 14.7, torque: 58, topSpeed: 120, chargeTime: 6.5, price: { hourlyRate: 75, rate12Hour: 480, rate24Hour: 800 } },
  { brand: 'Ola Electric', model: 'S1 Air', variant: '3.0 kWh', capacity: 3.0, range: 151, power: 8.0, torque: 25, topSpeed: 90, chargeTime: 5.0, price: { hourlyRate: 60, rate12Hour: 400, rate24Hour: 650 } },
  { brand: 'Ola Electric', model: 'S1 X Plus', variant: '3.0 kWh', capacity: 3.0, range: 151, power: 8.0, torque: 25, topSpeed: 90, chargeTime: 5.0, price: { hourlyRate: 55, rate12Hour: 360, rate24Hour: 600 } },
  { brand: 'Ola Electric', model: 'S1 X', variant: '4.0 kWh Long Range', capacity: 4.0, range: 190, power: 8.0, torque: 25, topSpeed: 90, chargeTime: 6.5, price: { hourlyRate: 65, rate12Hour: 420, rate24Hour: 700 } },
  { brand: 'Ola Electric', model: 'S1 X', variant: '2.0 kWh City', capacity: 2.0, range: 95, power: 8.0, torque: 25, topSpeed: 85, chargeTime: 4.5, price: { hourlyRate: 50, rate12Hour: 320, rate24Hour: 550 } },
  { brand: 'TVS', model: 'iQube', variant: 'Standard 2.2 kWh', capacity: 2.2, range: 75, power: 5.9, torque: 33, topSpeed: 75, chargeTime: 2.5, price: { hourlyRate: 55, rate12Hour: 360, rate24Hour: 600 } },
  { brand: 'TVS', model: 'iQube S', variant: '3.4 kWh', capacity: 3.4, range: 100, power: 5.9, torque: 33, topSpeed: 78, chargeTime: 4.5, price: { hourlyRate: 65, rate12Hour: 420, rate24Hour: 700 } },
  { brand: 'TVS', model: 'iQube ST', variant: '3.4 kWh TFT', capacity: 3.4, range: 100, power: 5.9, torque: 33, topSpeed: 78, chargeTime: 4.0, price: { hourlyRate: 70, rate12Hour: 450, rate24Hour: 750 } },
  { brand: 'TVS', model: 'iQube ST', variant: '5.1 kWh Max', capacity: 5.1, range: 150, power: 5.9, torque: 33, topSpeed: 82, chargeTime: 4.2, price: { hourlyRate: 80, rate12Hour: 500, rate24Hour: 850 } },
  { brand: 'TVS', model: 'X Electric', variant: 'Performance Maxi 4.44 kWh', capacity: 4.44, range: 140, power: 14.7, torque: 40, topSpeed: 105, chargeTime: 4.5, price: { hourlyRate: 110, rate12Hour: 700, rate24Hour: 1150 } },
  { brand: 'Bajaj', model: 'Chetak Premium', variant: '3.2 kWh Metal Body', capacity: 3.2, range: 126, power: 5.6, torque: 20, topSpeed: 73, chargeTime: 4.5, price: { hourlyRate: 70, rate12Hour: 450, rate24Hour: 750 } },
  { brand: 'Bajaj', model: 'Chetak Urbane', variant: '2.9 kWh', capacity: 2.9, range: 113, power: 5.6, torque: 20, topSpeed: 63, chargeTime: 4.8, price: { hourlyRate: 60, rate12Hour: 400, rate24Hour: 650 } },
  { brand: 'Bajaj', model: 'Chetak 2901', variant: '2.88 kWh Essential', capacity: 2.88, range: 123, power: 5.3, torque: 20, topSpeed: 63, chargeTime: 6.0, price: { hourlyRate: 55, rate12Hour: 360, rate24Hour: 600 } },
  { brand: 'Vida', model: 'V1 Pro', variant: 'Removable Dual 3.94 kWh', capacity: 3.94, range: 165, power: 8.0, torque: 25, topSpeed: 80, chargeTime: 5.5, price: { hourlyRate: 75, rate12Hour: 480, rate24Hour: 800 } },
  { brand: 'Vida', model: 'V1 Plus', variant: '3.44 kWh', capacity: 3.44, range: 143, power: 8.0, torque: 25, topSpeed: 80, chargeTime: 5.0, price: { hourlyRate: 65, rate12Hour: 420, rate24Hour: 700 } },
  { brand: 'Simple Energy', model: 'Simple One', variant: '5.0 kWh Extreme Range', capacity: 5.0, range: 212, power: 11.4, torque: 72, topSpeed: 105, chargeTime: 5.8, price: { hourlyRate: 85, rate12Hour: 550, rate24Hour: 900 } },
  { brand: 'Simple Energy', model: 'Simple Dot One', variant: '3.7 kWh', capacity: 3.7, range: 151, power: 11.4, torque: 72, topSpeed: 105, chargeTime: 4.5, price: { hourlyRate: 70, rate12Hour: 450, rate24Hour: 750 } },
  { brand: 'River', model: 'Indie', variant: 'Utility SUV 4.0 kWh', capacity: 4.0, range: 120, power: 9.0, torque: 26, topSpeed: 90, chargeTime: 5.0, price: { hourlyRate: 75, rate12Hour: 480, rate24Hour: 800 } },
  { brand: 'Hero Electric', model: 'Optima CX 5.0', variant: 'Dual Battery 3.0 kWh', capacity: 3.0, range: 135, power: 2.6, torque: 15, topSpeed: 55, chargeTime: 4.5, price: { hourlyRate: 45, rate12Hour: 300, rate24Hour: 500 } },
  { brand: 'Hero Electric', model: 'Photon LP', variant: '1.9 kWh', capacity: 1.9, range: 90, power: 2.4, torque: 14, topSpeed: 45, chargeTime: 5.0, price: { hourlyRate: 45, rate12Hour: 300, rate24Hour: 500 } },
  { brand: 'Hero Electric', model: 'Nyx HX', variant: 'Commercial Heavy Duty', capacity: 3.0, range: 165, power: 2.6, torque: 16, topSpeed: 42, chargeTime: 5.0, price: { hourlyRate: 45, rate12Hour: 300, rate24Hour: 500 } },
  { brand: 'Okinawa', model: 'Praise Pro', variant: '2.08 kWh Detachable', capacity: 2.08, range: 88, power: 3.6, torque: 18, topSpeed: 58, chargeTime: 3.0, price: { hourlyRate: 50, rate12Hour: 320, rate24Hour: 550 } },
  { brand: 'Okinawa', model: 'Okhi-90', variant: '16-inch Wheels 3.6 kWh', capacity: 3.6, range: 160, power: 5.1, torque: 24, topSpeed: 80, chargeTime: 4.0, price: { hourlyRate: 65, rate12Hour: 420, rate24Hour: 700 } },
  { brand: 'Ampere', model: 'Nexus', variant: '3.0 kWh LFP Smart', capacity: 3.0, range: 136, power: 5.4, torque: 24, topSpeed: 93, chargeTime: 3.5, price: { hourlyRate: 65, rate12Hour: 420, rate24Hour: 700 } },
  { brand: 'Ampere', model: 'Magnus EX', variant: '2.3 kWh', capacity: 2.3, range: 121, power: 2.8, torque: 16, topSpeed: 53, chargeTime: 6.0, price: { hourlyRate: 45, rate12Hour: 300, rate24Hour: 500 } },
  { brand: 'BGauss', model: 'C12i Max', variant: '3.2 kWh All-Metal', capacity: 3.2, range: 135, power: 3.4, torque: 19, topSpeed: 60, chargeTime: 6.0, price: { hourlyRate: 55, rate12Hour: 360, rate24Hour: 600 } },
  { brand: 'Bounce', model: 'Infinity E1 Plus', variant: 'Swappable 1.9 kWh', capacity: 1.9, range: 85, power: 2.9, torque: 18, topSpeed: 65, chargeTime: 4.0, price: { hourlyRate: 45, rate12Hour: 300, rate24Hour: 500 } }
];

eScooters.forEach(e => {
  addModel({
    brand: e.brand, model: e.model, variant: e.variant,
    categorySlug: 'electric-scooters', vehicleType: 'two_wheeler', fuelType: 'electric', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: e.capacity, fuelEconomyValue: e.range, fuelEconomyUnit: 'km/charge',
    features: ['Regenerative Braking', 'LED Headlamp', 'Digital Display Cluster', 'Combined Braking System', 'Reverse Assist'],
    specs: { batteryCapacityKwh: e.capacity, maxPowerBhp: e.power, maxTorqueNm: e.torque, topSpeedKmph: e.topSpeed, chargingTimeHours: e.chargeTime },
    pricing: e.price,
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
  });
});

console.log(`Added ${eScooters.length} Electric Scooters.`);

// -------------------------------------------------------------
// 2. PETROL & HYBRID SCOOTERS (35 Models)
// -------------------------------------------------------------
const pScooters = [
  { brand: 'Honda', model: 'Activa 6G', variant: 'Standard 110cc', cc: 109.5, mileage: 50.0, power: 7.7, torque: 8.9, price: { hourlyRate: 45, rate12Hour: 300, rate24Hour: 500 } },
  { brand: 'Honda', model: 'Activa 6G', variant: 'Deluxe Smart Key', cc: 109.5, mileage: 50.0, power: 7.7, torque: 8.9, price: { hourlyRate: 50, rate12Hour: 320, rate24Hour: 550 } },
  { brand: 'Honda', model: 'Activa 125', variant: 'Disc Smart Key', cc: 124.0, mileage: 47.0, power: 8.2, torque: 10.4, price: { hourlyRate: 50, rate12Hour: 330, rate24Hour: 550 } },
  { brand: 'Honda', model: 'Dio 110', variant: 'Sports Edition', cc: 109.5, mileage: 48.0, power: 7.7, torque: 9.0, price: { hourlyRate: 45, rate12Hour: 300, rate24Hour: 500 } },
  { brand: 'Honda', model: 'Dio 125', variant: 'Smart 125cc', cc: 123.9, mileage: 45.0, power: 8.2, torque: 10.4, price: { hourlyRate: 50, rate12Hour: 330, rate24Hour: 550 } },
  { brand: 'TVS', model: 'Jupiter 110', variant: 'ZX SmartXonnect', cc: 109.7, mileage: 52.0, power: 7.8, torque: 8.8, price: { hourlyRate: 45, rate12Hour: 300, rate24Hour: 500 } },
  { brand: 'TVS', model: 'Jupiter 125', variant: 'Disc with 33L Boot', cc: 124.8, mileage: 50.0, power: 8.0, torque: 10.5, price: { hourlyRate: 50, rate12Hour: 320, rate24Hour: 550 } },
  { brand: 'TVS', model: 'Ntorq 125', variant: 'Race XP Edition', cc: 124.8, mileage: 42.0, power: 10.1, torque: 10.8, price: { hourlyRate: 60, rate12Hour: 380, rate24Hour: 650 } },
  { brand: 'TVS', model: 'Ntorq 125', variant: 'Super Squad Marvel', cc: 124.8, mileage: 42.0, power: 9.25, torque: 10.5, price: { hourlyRate: 60, rate12Hour: 380, rate24Hour: 650 } },
  { brand: 'TVS', model: 'Ntorq 125', variant: 'XT Connected TFT', cc: 124.8, mileage: 42.0, power: 9.25, torque: 10.5, price: { hourlyRate: 65, rate12Hour: 400, rate24Hour: 680 } },
  { brand: 'TVS', model: 'Scooty Zest 110', variant: 'Matte Series', cc: 109.7, mileage: 55.0, power: 7.7, torque: 8.8, price: { hourlyRate: 40, rate12Hour: 260, rate24Hour: 450 } },
  { brand: 'TVS', model: 'Scooty Pep Plus', variant: 'Gloss Edition 90cc', cc: 87.8, mileage: 60.0, power: 5.4, torque: 6.5, price: { hourlyRate: 35, rate12Hour: 230, rate24Hour: 400 } },
  { brand: 'Suzuki', model: 'Access 125', variant: 'Special Edition Disc', cc: 124.0, mileage: 52.5, power: 8.6, torque: 10.0, price: { hourlyRate: 50, rate12Hour: 330, rate24Hour: 550 } },
  { brand: 'Suzuki', model: 'Access 125', variant: 'Ride Connect Bluetooth', cc: 124.0, mileage: 52.5, power: 8.6, torque: 10.0, price: { hourlyRate: 55, rate12Hour: 350, rate24Hour: 580 } },
  { brand: 'Suzuki', model: 'Burgman Street 125', variant: 'Maxi Scooter EX', cc: 124.0, mileage: 48.0, power: 8.5, torque: 10.0, price: { hourlyRate: 60, rate12Hour: 380, rate24Hour: 650 } },
  { brand: 'Suzuki', model: 'Burgman Street 125', variant: 'Standard Disc', cc: 124.0, mileage: 48.5, power: 8.6, torque: 10.0, price: { hourlyRate: 55, rate12Hour: 360, rate24Hour: 600 } },
  { brand: 'Suzuki', model: 'Avenis 125', variant: 'Race Edition', cc: 124.0, mileage: 49.0, power: 8.6, torque: 10.0, price: { hourlyRate: 55, rate12Hour: 350, rate24Hour: 600 } },
  { brand: 'Yamaha', model: 'RayZR 125 Fi', variant: 'Hybrid Disc Street Rally', cc: 125.0, mileage: 58.0, power: 8.2, torque: 10.3, price: { hourlyRate: 50, rate12Hour: 340, rate24Hour: 580 }, fuel: 'hybrid' },
  { brand: 'Yamaha', model: 'Fascino 125 Fi', variant: 'Hybrid Chrome Edition', cc: 125.0, mileage: 58.0, power: 8.2, torque: 10.3, price: { hourlyRate: 50, rate12Hour: 340, rate24Hour: 580 }, fuel: 'hybrid' },
  { brand: 'Yamaha', model: 'Aerox 155', variant: 'Version S Traction Control', cc: 155.0, mileage: 42.0, power: 15.0, torque: 13.9, price: { hourlyRate: 90, rate12Hour: 600, rate24Hour: 1000 } },
  { brand: 'Yamaha', model: 'Aerox 155', variant: 'MotoGP Monster Edition', cc: 155.0, mileage: 42.0, power: 15.0, torque: 13.9, price: { hourlyRate: 95, rate12Hour: 620, rate24Hour: 1050 } },
  { brand: 'Hero', model: 'Pleasure Plus', variant: 'XTEC Connected', cc: 110.9, mileage: 50.0, power: 8.0, torque: 8.7, price: { hourlyRate: 40, rate12Hour: 280, rate24Hour: 480 } },
  { brand: 'Hero', model: 'Xoom 110', variant: 'ZX Cornering Lights', cc: 110.9, mileage: 48.0, power: 8.05, torque: 8.7, price: { hourlyRate: 45, rate12Hour: 300, rate24Hour: 520 } },
  { brand: 'Hero', model: 'Destini 125', variant: 'XTEC Prime', cc: 124.6, mileage: 47.0, power: 9.0, torque: 10.4, price: { hourlyRate: 45, rate12Hour: 300, rate24Hour: 520 } },
  { brand: 'Hero', model: 'Maestro Edge 125', variant: 'Connected Disc', cc: 124.6, mileage: 45.0, power: 9.0, torque: 10.4, price: { hourlyRate: 45, rate12Hour: 300, rate24Hour: 520 } },
  { brand: 'Vespa', model: 'VXL 125', variant: 'Classic Italian Monocoque', cc: 124.4, mileage: 45.0, power: 9.9, torque: 9.6, price: { hourlyRate: 75, rate12Hour: 480, rate24Hour: 800 } },
  { brand: 'Vespa', model: 'SXL 150', variant: 'Sporty Rectangular Lamp', cc: 149.5, mileage: 38.0, power: 10.5, torque: 11.26, price: { hourlyRate: 85, rate12Hour: 550, rate24Hour: 900 } },
  { brand: 'Vespa', model: 'ZX 125', variant: 'Urban Gloss', cc: 124.4, mileage: 45.0, power: 9.9, torque: 9.6, price: { hourlyRate: 70, rate12Hour: 450, rate24Hour: 750 } },
  { brand: 'Vespa', model: 'Elegante 150', variant: 'Special Beige Leather', cc: 149.5, mileage: 38.0, power: 10.5, torque: 11.26, price: { hourlyRate: 90, rate12Hour: 580, rate24Hour: 950 } },
  { brand: 'Aprilia', model: 'SR 125', variant: 'Racing Heritage', cc: 124.4, mileage: 40.0, power: 9.9, torque: 9.7, price: { hourlyRate: 65, rate12Hour: 420, rate24Hour: 700 } },
  { brand: 'Aprilia', model: 'SR 160', variant: 'Race Edition Carbon', cc: 160.0, mileage: 35.0, power: 11.2, torque: 13.4, price: { hourlyRate: 80, rate12Hour: 500, rate24Hour: 850 } },
  { brand: 'Aprilia', model: 'SXR 160', variant: 'Maxi Touring Edition', cc: 160.0, mileage: 36.0, power: 10.9, torque: 11.6, price: { hourlyRate: 85, rate12Hour: 550, rate24Hour: 900 } },
  { brand: 'Aprilia', model: 'SXR 125', variant: 'Grand Tourer', cc: 124.4, mileage: 40.0, power: 9.5, torque: 9.2, price: { hourlyRate: 70, rate12Hour: 450, rate24Hour: 750 } },
  { brand: 'Keeway', model: 'Sixties 300i', variant: 'Retro Maxi Scooter', cc: 278.2, mileage: 28.0, power: 18.7, torque: 22.0, price: { hourlyRate: 120, rate12Hour: 750, rate24Hour: 1300 } },
  { brand: 'BMW', model: 'C 400 GT', variant: 'Luxury Super Maxi', cc: 350.0, mileage: 28.0, power: 34.0, torque: 35.0, price: { hourlyRate: 250, rate12Hour: 1600, rate24Hour: 2800 } }
];

pScooters.forEach(s => {
  addModel({
    brand: s.brand, model: s.model, variant: s.variant,
    categorySlug: 'scooters', vehicleType: 'two_wheeler', fuelType: s.fuel || 'petrol', transmission: 'automatic',
    seatingCapacity: 2, engineCapacity: s.cc, fuelEconomyValue: s.mileage, fuelEconomyUnit: 'km/l',
    features: ['Electric Self-Start', 'Under-Seat Luggage Storage', 'Tubeless Tyres', 'Front Telescopic Suspension', 'Combi Braking System'],
    specs: { fuelTankCapacityLiters: 5.3, maxPowerBhp: s.power, maxTorqueNm: s.torque, kerbWeightKg: 108 },
    pricing: s.price,
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  });
});

console.log(`Added ${pScooters.length} Petrol/Hybrid Scooters.`);

// -------------------------------------------------------------
// 3. BIKES (80 Models)
// -------------------------------------------------------------
const bikeDefinitions = [
  // Royal Enfield
  { brand: 'Royal Enfield', model: 'Classic 350', variant: 'Halcyon Series', cc: 349, mileage: 41.5, power: 20.2, torque: 27, price: { hourlyRate: 90, rate12Hour: 600, rate24Hour: 999 } },
  { brand: 'Royal Enfield', model: 'Classic 350', variant: 'Dark Stealth Black Alloy', cc: 349, mileage: 41.5, power: 20.2, torque: 27, price: { hourlyRate: 95, rate12Hour: 620, rate24Hour: 1050 } },
  { brand: 'Royal Enfield', model: 'Classic 350', variant: 'Signals Marsh Grey', cc: 349, mileage: 41.5, power: 20.2, torque: 27, price: { hourlyRate: 90, rate12Hour: 600, rate24Hour: 1000 } },
  { brand: 'Royal Enfield', model: 'Hunter 350', variant: 'Metro Dapper', cc: 349, mileage: 36.2, power: 20.2, torque: 27, price: { hourlyRate: 85, rate12Hour: 550, rate24Hour: 900 } },
  { brand: 'Royal Enfield', model: 'Hunter 350', variant: 'Retro Factory', cc: 349, mileage: 36.2, power: 20.2, torque: 27, price: { hourlyRate: 80, rate12Hour: 520, rate24Hour: 850 } },
  { brand: 'Royal Enfield', model: 'Bullet 350', variant: 'Military Black', cc: 349, mileage: 40.0, power: 20.2, torque: 27, price: { hourlyRate: 85, rate12Hour: 550, rate24Hour: 900 } },
  { brand: 'Royal Enfield', model: 'Bullet 350', variant: 'Standard Black Chrome', cc: 349, mileage: 40.0, power: 20.2, torque: 27, price: { hourlyRate: 90, rate12Hour: 580, rate24Hour: 950 } },
  { brand: 'Royal Enfield', model: 'Meteor 350', variant: 'Supernova Touring', cc: 349, mileage: 41.8, power: 20.2, torque: 27, price: { hourlyRate: 100, rate12Hour: 650, rate24Hour: 1100 } },
  { brand: 'Royal Enfield', model: 'Meteor 350', variant: 'Fireball', cc: 349, mileage: 41.8, power: 20.2, torque: 27, price: { hourlyRate: 95, rate12Hour: 620, rate24Hour: 1050 } },
  { brand: 'Royal Enfield', model: 'Himalayan 450', variant: 'Sherpa Summit Hanle Black', cc: 452, mileage: 30.0, power: 39.5, torque: 40, price: { hourlyRate: 130, rate12Hour: 850, rate24Hour: 1450 } },
  { brand: 'Royal Enfield', model: 'Himalayan 450', variant: 'Pass Slate Blue', cc: 452, mileage: 30.0, power: 39.5, torque: 40, price: { hourlyRate: 125, rate12Hour: 820, rate24Hour: 1400 } },
  { brand: 'Royal Enfield', model: 'Guerrilla 450', variant: 'Flash Urban Roadster', cc: 452, mileage: 29.5, power: 39.5, torque: 40, price: { hourlyRate: 125, rate12Hour: 800, rate24Hour: 1400 } },
  { brand: 'Royal Enfield', model: 'Scram 411', variant: 'Silver Spirit', cc: 411, mileage: 35.0, power: 24.3, torque: 32, price: { hourlyRate: 95, rate12Hour: 620, rate24Hour: 1050 } },
  { brand: 'Royal Enfield', model: 'Interceptor 650', variant: 'Twin Cylinder Mark 2', cc: 648, mileage: 25.0, power: 47.0, torque: 52, price: { hourlyRate: 150, rate12Hour: 950, rate24Hour: 1650 } },
  { brand: 'Royal Enfield', model: 'Continental GT 650', variant: 'Cafe Racer Apex Grey', cc: 648, mileage: 25.0, power: 47.0, torque: 52, price: { hourlyRate: 160, rate12Hour: 1000, rate24Hour: 1750 } },
  { brand: 'Royal Enfield', model: 'Super Meteor 650', variant: 'Celestial Tourer', cc: 648, mileage: 24.0, power: 47.0, torque: 52.3, price: { hourlyRate: 180, rate12Hour: 1150, rate24Hour: 1950 } },
  { brand: 'Royal Enfield', model: 'Shotgun 650', variant: 'Custom Bobber', cc: 648, mileage: 24.0, power: 47.0, torque: 52.3, price: { hourlyRate: 180, rate12Hour: 1150, rate24Hour: 1950 } },
  // Yamaha
  { brand: 'Yamaha', model: 'MT-15 V2', variant: 'MotoGP Edition', cc: 155, mileage: 48.0, power: 18.4, torque: 14.1, price: { hourlyRate: 85, rate12Hour: 550, rate24Hour: 900 } },
  { brand: 'Yamaha', model: 'MT-15 V2', variant: 'Metallic Black USD', cc: 155, mileage: 48.0, power: 18.4, torque: 14.1, price: { hourlyRate: 80, rate12Hour: 520, rate24Hour: 880 } },
  { brand: 'Yamaha', model: 'YZF R15 V4', variant: 'Racing Blue Quickshifter', cc: 155, mileage: 45.0, power: 18.4, torque: 14.2, price: { hourlyRate: 95, rate12Hour: 620, rate24Hour: 1050 } },
  { brand: 'Yamaha', model: 'YZF R15M', variant: 'Carbon Edition TFT', cc: 155, mileage: 45.0, power: 18.4, torque: 14.2, price: { hourlyRate: 105, rate12Hour: 680, rate24Hour: 1150 } },
  { brand: 'Yamaha', model: 'FZ-S Fi V4', variant: 'Deluxe Series', cc: 149, mileage: 49.3, power: 12.4, torque: 13.3, price: { hourlyRate: 65, rate12Hour: 420, rate24Hour: 700 } },
  { brand: 'Yamaha', model: 'FZ-X', variant: 'Neo-Retro Scrambler', cc: 149, mileage: 48.0, power: 12.4, torque: 13.3, price: { hourlyRate: 70, rate12Hour: 450, rate24Hour: 750 } },
  { brand: 'Yamaha', model: 'YZF R3', variant: 'Parallel Twin 321cc', cc: 321, mileage: 26.0, power: 42.0, torque: 29.5, price: { hourlyRate: 180, rate12Hour: 1150, rate24Hour: 1950 } },
  { brand: 'Yamaha', model: 'MT-03', variant: 'Hyper Naked 321cc', cc: 321, mileage: 26.0, power: 42.0, torque: 29.5, price: { hourlyRate: 180, rate12Hour: 1150, rate24Hour: 1950 } },
  // KTM
  { brand: 'KTM', model: '390 Duke', variant: 'Gen 3 (LC4c 45 PS)', cc: 398.7, mileage: 28.5, power: 45.3, torque: 39, price: { hourlyRate: 150, rate12Hour: 950, rate24Hour: 1650 } },
  { brand: 'KTM', model: '250 Duke', variant: 'Gen 3', cc: 249, mileage: 32.0, power: 31.0, torque: 25, price: { hourlyRate: 110, rate12Hour: 700, rate24Hour: 1200 } },
  { brand: 'KTM', model: '200 Duke', variant: 'Dual Channel ABS', cc: 199.5, mileage: 35.0, power: 25.0, torque: 19.3, price: { hourlyRate: 95, rate12Hour: 620, rate24Hour: 1050 } },
  { brand: 'KTM', model: '125 Duke', variant: 'ABS', cc: 124.7, mileage: 43.0, power: 14.5, torque: 12.0, price: { hourlyRate: 75, rate12Hour: 480, rate24Hour: 800 } },
  { brand: 'KTM', model: 'RC 390', variant: 'GP Edition Aerodynamics', cc: 373.2, mileage: 27.5, power: 43.5, torque: 37, price: { hourlyRate: 160, rate12Hour: 1000, rate24Hour: 1750 } },
  { brand: 'KTM', model: 'RC 200', variant: 'SuperSport', cc: 199.5, mileage: 35.0, power: 25.0, torque: 19.2, price: { hourlyRate: 105, rate12Hour: 680, rate24Hour: 1150 } },
  { brand: 'KTM', model: '390 Adventure', variant: 'Spoke Wheel Edition', cc: 373.2, mileage: 30.0, power: 43.5, torque: 37, price: { hourlyRate: 150, rate12Hour: 950, rate24Hour: 1650 } },
  { brand: 'KTM', model: '250 Adventure', variant: 'Dual Sport', cc: 249, mileage: 35.0, power: 30.0, torque: 24, price: { hourlyRate: 115, rate12Hour: 740, rate24Hour: 1250 } },
  // Bajaj
  { brand: 'Bajaj', model: 'Pulsar NS400Z', variant: 'Streetfighter 40 PS', cc: 373, mileage: 28.0, power: 40.0, torque: 35, price: { hourlyRate: 110, rate12Hour: 700, rate24Hour: 1200 } },
  { brand: 'Bajaj', model: 'Pulsar NS200', variant: 'USD Forks Dual ABS', cc: 199.5, mileage: 36.5, power: 24.5, torque: 18.7, price: { hourlyRate: 80, rate12Hour: 500, rate24Hour: 850 } },
  { brand: 'Bajaj', model: 'Pulsar N160', variant: 'Dual Channel ABS', cc: 164.8, mileage: 46.0, power: 16.0, torque: 14.65, price: { hourlyRate: 65, rate12Hour: 420, rate24Hour: 700 } },
  { brand: 'Bajaj', model: 'Pulsar N250', variant: 'Traction Control 250cc', cc: 249, mileage: 35.0, power: 24.5, torque: 21.5, price: { hourlyRate: 85, rate12Hour: 550, rate24Hour: 900 } },
  { brand: 'Bajaj', model: 'Pulsar RS200', variant: 'Twin Projector ABS', cc: 199.5, mileage: 35.0, power: 24.5, torque: 18.7, price: { hourlyRate: 85, rate12Hour: 550, rate24Hour: 900 } },
  { brand: 'Bajaj', model: 'Pulsar 150', variant: 'Twin Disc Classic', cc: 149.5, mileage: 47.5, power: 14.0, torque: 13.25, price: { hourlyRate: 60, rate12Hour: 380, rate24Hour: 650 } },
  { brand: 'Bajaj', model: 'Dominar 400', variant: 'Touring Edition Factory', cc: 373.3, mileage: 27.0, power: 40.0, torque: 35, price: { hourlyRate: 130, rate12Hour: 850, rate24Hour: 1450 } },
  { brand: 'Bajaj', model: 'Dominar 250', variant: 'Sports Tourer', cc: 248.8, mileage: 33.0, power: 27.0, torque: 23.5, price: { hourlyRate: 95, rate12Hour: 620, rate24Hour: 1050 } },
  { brand: 'Bajaj', model: 'Avenger Cruise 220', variant: 'Highway Windscreen', cc: 220, mileage: 40.0, power: 19.03, torque: 17.55, price: { hourlyRate: 80, rate12Hour: 520, rate24Hour: 880 } },
  { brand: 'Bajaj', model: 'Avenger Street 160', variant: 'City Cruiser', cc: 160, mileage: 45.0, power: 15.0, torque: 13.7, price: { hourlyRate: 65, rate12Hour: 420, rate24Hour: 700 } },
  { brand: 'Bajaj', model: 'Freedom 125', variant: 'Dual Fuel CNG+Petrol', cc: 125, mileage: 102.0, power: 9.5, torque: 9.7, price: { hourlyRate: 50, rate12Hour: 320, rate24Hour: 550 }, fuel: 'cng' },
  { brand: 'Bajaj', model: 'Platina 110', variant: 'ABS Disc', cc: 115.45, mileage: 70.0, power: 8.6, torque: 9.81, price: { hourlyRate: 40, rate12Hour: 250, rate24Hour: 420 } },
  // TVS
  { brand: 'TVS', model: 'Raider 125', variant: 'Super Squad Marvel TFT', cc: 124.8, mileage: 67.0, power: 11.38, torque: 11.2, price: { hourlyRate: 55, rate12Hour: 360, rate24Hour: 600 } },
  { brand: 'TVS', model: 'Apache RTR 160 4V', variant: 'Special Edition Dual ABS', cc: 159.7, mileage: 47.6, power: 17.55, torque: 14.73, price: { hourlyRate: 70, rate12Hour: 450, rate24Hour: 750 } },
  { brand: 'TVS', model: 'Apache RTR 200 4V', variant: 'Dual ABS with Showa Suspension', cc: 197.7, mileage: 39.0, power: 20.8, torque: 17.25, price: { hourlyRate: 85, rate12Hour: 550, rate24Hour: 900 } },
  { brand: 'TVS', model: 'Apache RR 310', variant: 'BTO Race Replica', cc: 312.2, mileage: 34.7, power: 34.0, torque: 27.3, price: { hourlyRate: 140, rate12Hour: 900, rate24Hour: 1550 } },
  { brand: 'TVS', model: 'Apache RTR 310', variant: 'Streetfighter Bi-Directional QS', cc: 312.2, mileage: 34.7, power: 35.6, torque: 28.7, price: { hourlyRate: 145, rate12Hour: 920, rate24Hour: 1580 } },
  { brand: 'TVS', model: 'Ronin', variant: 'Special Edition Dual ABS', cc: 225.9, mileage: 42.0, power: 20.4, torque: 19.93, price: { hourlyRate: 85, rate12Hour: 550, rate24Hour: 900 } },
  { brand: 'TVS', model: 'Sport', variant: 'Electric Start Alloy', cc: 109.7, mileage: 75.0, power: 8.29, torque: 8.7, price: { hourlyRate: 40, rate12Hour: 250, rate24Hour: 420 } },
  // Honda
  { brand: 'Honda', model: 'Shine 125', variant: 'Disc Drum CBS', cc: 124, mileage: 65.0, power: 10.7, torque: 11, price: { hourlyRate: 50, rate12Hour: 320, rate24Hour: 550 } },
  { brand: 'Honda', model: 'SP 125', variant: 'Sports Disc Digital', cc: 124, mileage: 65.0, power: 10.87, torque: 10.9, price: { hourlyRate: 55, rate12Hour: 350, rate24Hour: 600 } },
  { brand: 'Honda', model: 'CB350 Hness', variant: 'DLX Pro Dual Tone', cc: 348.36, mileage: 42.0, power: 21.07, torque: 30, price: { hourlyRate: 95, rate12Hour: 620, rate24Hour: 1050 } },
  { brand: 'Honda', model: 'CB350RS', variant: 'Scrambler Cafe Monotone', cc: 348.36, mileage: 42.0, power: 21.07, torque: 30, price: { hourlyRate: 100, rate12Hour: 650, rate24Hour: 1100 } },
  { brand: 'Honda', model: 'CB300R', variant: 'Neo Sports Cafe 146kg', cc: 286, mileage: 32.0, power: 31.1, torque: 27.5, price: { hourlyRate: 130, rate12Hour: 850, rate24Hour: 1450 } },
  { brand: 'Honda', model: 'Hornet 2.0', variant: 'Golden USD Forks', cc: 184.4, mileage: 45.0, power: 17.26, torque: 16.1, price: { hourlyRate: 75, rate12Hour: 480, rate24Hour: 800 } },
  { brand: 'Honda', model: 'CB200X', variant: 'Urban Explorer', cc: 184.4, mileage: 45.0, power: 17.26, torque: 16.1, price: { hourlyRate: 80, rate12Hour: 520, rate24Hour: 850 } },
  // Hero
  { brand: 'Hero', model: 'Splendor Plus', variant: 'XTEC Bluetooth', cc: 97.2, mileage: 70.0, power: 8.02, torque: 8.05, price: { hourlyRate: 40, rate12Hour: 260, rate24Hour: 450 } },
  { brand: 'Hero', model: 'HF Deluxe', variant: 'Self Start Alloy', cc: 97.2, mileage: 70.0, power: 8.02, torque: 8.05, price: { hourlyRate: 40, rate12Hour: 250, rate24Hour: 420 } },
  { brand: 'Hero', model: 'Xpulse 200 4V', variant: 'Pro Rally Edition 270mm', cc: 199.6, mileage: 40.0, power: 19.1, torque: 17.35, price: { hourlyRate: 90, rate12Hour: 600, rate24Hour: 999 } },
  { brand: 'Hero', model: 'Mavrick 440', variant: 'Diamond Cut Alloys', cc: 440, mileage: 30.0, power: 27.3, torque: 36, price: { hourlyRate: 110, rate12Hour: 700, rate24Hour: 1200 } },
  { brand: 'Hero', model: 'Xtreme 125R', variant: 'Single ABS Sprinter', cc: 124.7, mileage: 66.0, power: 11.5, torque: 10.5, price: { hourlyRate: 55, rate12Hour: 360, rate24Hour: 600 } },
  { brand: 'Hero', model: 'Xtreme 160R 4V', variant: 'Kyaba USD Forks', cc: 163.2, mileage: 45.0, power: 16.9, torque: 14.6, price: { hourlyRate: 70, rate12Hour: 450, rate24Hour: 750 } },
  // BMW, Triumph, Harley, Kawasaki, Suzuki, Jawa
  { brand: 'BMW', model: 'G 310 R', variant: 'Roadster Racing', cc: 313, mileage: 32.0, power: 34.0, torque: 28, price: { hourlyRate: 140, rate12Hour: 900, rate24Hour: 1550 } },
  { brand: 'BMW', model: 'G 310 GS', variant: 'Adventure Tourer', cc: 313, mileage: 30.0, power: 34.0, torque: 28, price: { hourlyRate: 160, rate12Hour: 1050, rate24Hour: 1750 } },
  { brand: 'Triumph', model: 'Speed 400', variant: 'Modern Classic 40 PS', cc: 398.15, mileage: 30.0, power: 40.0, torque: 37.5, price: { hourlyRate: 135, rate12Hour: 880, rate24Hour: 1500 } },
  { brand: 'Triumph', model: 'Scrambler 400X', variant: 'All-Road Dual Purpose', cc: 398.15, mileage: 28.5, power: 40.0, torque: 37.5, price: { hourlyRate: 145, rate12Hour: 950, rate24Hour: 1600 } },
  { brand: 'Harley-Davidson', model: 'X440', variant: 'S Diamond Cut TFT', cc: 440, mileage: 35.0, power: 27.3, torque: 38, price: { hourlyRate: 140, rate12Hour: 920, rate24Hour: 1550 } },
  { brand: 'Jawa', model: '350', variant: 'Heritage Classic', cc: 334, mileage: 30.0, power: 22.5, torque: 28.2, price: { hourlyRate: 95, rate12Hour: 620, rate24Hour: 1050 } },
  { brand: 'Jawa', model: '42 Bobber', variant: 'Single Floating Seat', cc: 334, mileage: 30.0, power: 29.9, torque: 32.7, price: { hourlyRate: 110, rate12Hour: 700, rate24Hour: 1200 } },
  { brand: 'Yezdi', model: 'Roadster', variant: 'Dark Matte Edition', cc: 334, mileage: 30.0, power: 29.7, torque: 29.0, price: { hourlyRate: 100, rate12Hour: 650, rate24Hour: 1100 } },
  { brand: 'Yezdi', model: 'Adventure', variant: 'High Clearance Dual Spoke', cc: 334, mileage: 30.0, power: 30.2, torque: 29.9, price: { hourlyRate: 120, rate12Hour: 780, rate24Hour: 1350 } },
  { brand: 'Kawasaki', model: 'Ninja 300', variant: 'SuperSport ABS', cc: 296, mileage: 26.0, power: 39.0, torque: 26.1, price: { hourlyRate: 180, rate12Hour: 1150, rate24Hour: 1950 } },
  { brand: 'Kawasaki', model: 'Ninja 500', variant: 'Parallel Twin 45 PS', cc: 451, mileage: 24.5, power: 45.4, torque: 42.6, price: { hourlyRate: 220, rate12Hour: 1400, rate24Hour: 2400 } },
  { brand: 'Kawasaki', model: 'Z900', variant: 'Inline-4 SuperNaked', cc: 948, mileage: 17.0, power: 125.0, torque: 98.6, price: { hourlyRate: 350, rate12Hour: 2200, rate24Hour: 3800 } },
  { brand: 'Kawasaki', model: 'Eliminator', variant: 'Standard 451cc Cruiser', cc: 451, mileage: 25.0, power: 45.0, torque: 42.6, price: { hourlyRate: 135, rate12Hour: 880, rate24Hour: 1500 } },
  { brand: 'Aprilia', model: 'RS 457', variant: 'Racing Supersport Parallel Twin', cc: 457, mileage: 26.0, power: 47.6, torque: 43.5, price: { hourlyRate: 125, rate12Hour: 820, rate24Hour: 1400 } },
  { brand: 'Royal Enfield', model: 'Guerrilla 450', variant: 'Flash Sherpa 452cc', cc: 452, mileage: 30.0, power: 40.0, torque: 40.0, price: { hourlyRate: 85, rate12Hour: 560, rate24Hour: 950 } },
  { brand: 'Royal Enfield', model: 'Bear 650', variant: 'Interceptor Scrambler 648cc Twin', cc: 648, mileage: 22.0, power: 47.0, torque: 52.3, price: { hourlyRate: 115, rate12Hour: 750, rate24Hour: 1280 } },
  { brand: 'Suzuki', model: 'Gixxer 150', variant: 'Single ABS Disc', cc: 155, mileage: 45.0, power: 13.6, torque: 13.8, price: { hourlyRate: 65, rate12Hour: 420, rate24Hour: 700 } },
  { brand: 'Suzuki', model: 'Gixxer SF 250', variant: 'Fully Faired MotoGP', cc: 249, mileage: 38.0, power: 26.5, torque: 22.2, price: { hourlyRate: 100, rate12Hour: 650, rate24Hour: 1100 } },
  { brand: 'Suzuki', model: 'V-Strom SX 250', variant: 'Adventure Tourer', cc: 249, mileage: 36.0, power: 26.5, torque: 22.2, price: { hourlyRate: 110, rate12Hour: 700, rate24Hour: 1200 } },
  // Electric High-Performance Bikes
  { brand: 'Revolt', model: 'RV400', variant: 'Electric AI Bike 3.24 kWh', cc: 3.24, mileage: 150.0, power: 6.7, torque: 54, price: { hourlyRate: 70, rate12Hour: 450, rate24Hour: 750 }, fuel: 'electric', trans: 'automatic' },
  { brand: 'Ultraviolette', model: 'F77 Mach 2', variant: 'Recon Superbike 10.3 kWh', cc: 10.3, mileage: 323.0, power: 40.2, torque: 100, price: { hourlyRate: 200, rate12Hour: 1300, rate24Hour: 2200 }, fuel: 'electric', trans: 'automatic' }
];

bikeDefinitions.forEach(b => {
  addModel({
    brand: b.brand, model: b.model, variant: b.variant,
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: b.fuel || 'petrol', transmission: b.trans || 'manual',
    seatingCapacity: 2, engineCapacity: b.cc, fuelEconomyValue: b.mileage,
    fuelEconomyUnit: b.fuel === 'electric' ? 'km/charge' : b.fuel === 'cng' ? 'km/kg' : 'km/l',
    features: ['Electric Self-Start', 'Disc Brakes with ABS', 'Alloy Wheels', 'Digital Instrument Console', 'Tubeless Tyres'],
    specs: { fuelTankCapacityLiters: b.fuel === 'electric' ? null : 13, batteryCapacityKwh: b.fuel === 'electric' ? b.cc : null, maxPowerBhp: b.power, maxTorqueNm: b.torque },
    pricing: b.price,
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
  });
});

console.log(`Added ${bikeDefinitions.length} Bikes.`);

// -------------------------------------------------------------
// 4. HATCHBACKS (42 Models)
// -------------------------------------------------------------
const hatchbacks = [
  // Maruti Suzuki
  { brand: 'Maruti Suzuki', model: 'Swift', variant: 'ZXi Plus Dual Tone', cc: 1197, mileage: 24.8, fuel: 'petrol', trans: 'manual', seats: 5, price: { hourlyRate: 110, rate12Hour: 750, rate24Hour: 1300 } },
  { brand: 'Maruti Suzuki', model: 'Swift', variant: 'ZXi Plus AGS Automatic', cc: 1197, mileage: 25.75, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 120, rate12Hour: 800, rate24Hour: 1400 } },
  { brand: 'Maruti Suzuki', model: 'Swift', variant: 'VXi S-CNG', cc: 1197, mileage: 32.85, fuel: 'cng', trans: 'manual', seats: 5, price: { hourlyRate: 110, rate12Hour: 750, rate24Hour: 1300 } },
  { brand: 'Maruti Suzuki', model: 'Baleno', variant: 'Alpha 1.2 DualJet', cc: 1197, mileage: 22.35, fuel: 'petrol', trans: 'manual', seats: 5, price: { hourlyRate: 120, rate12Hour: 800, rate24Hour: 1400 } },
  { brand: 'Maruti Suzuki', model: 'Baleno', variant: 'Alpha AGS Automatic', cc: 1197, mileage: 22.94, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 130, rate12Hour: 850, rate24Hour: 1500 } },
  { brand: 'Maruti Suzuki', model: 'Baleno', variant: 'Zeta S-CNG', cc: 1197, mileage: 30.61, fuel: 'cng', trans: 'manual', seats: 5, price: { hourlyRate: 120, rate12Hour: 800, rate24Hour: 1400 } },
  { brand: 'Maruti Suzuki', model: 'Wagon R', variant: 'ZXi Plus 1.2L', cc: 1197, mileage: 24.43, fuel: 'petrol', trans: 'manual', seats: 5, price: { hourlyRate: 90, rate12Hour: 600, rate24Hour: 1050 } },
  { brand: 'Maruti Suzuki', model: 'Wagon R', variant: 'LXi S-CNG 1.0L', cc: 998, mileage: 34.05, fuel: 'cng', trans: 'manual', seats: 5, price: { hourlyRate: 95, rate12Hour: 620, rate24Hour: 1100 } },
  { brand: 'Maruti Suzuki', model: 'Alto K10', variant: 'VXi Plus 1.0 DualJet', cc: 998, mileage: 24.39, fuel: 'petrol', trans: 'manual', seats: 5, price: { hourlyRate: 80, rate12Hour: 500, rate24Hour: 900 } },
  { brand: 'Maruti Suzuki', model: 'Alto K10', variant: 'VXi S-CNG', cc: 998, mileage: 33.85, fuel: 'cng', trans: 'manual', seats: 5, price: { hourlyRate: 85, rate12Hour: 530, rate24Hour: 950 } },
  { brand: 'Maruti Suzuki', model: 'Celerio', variant: 'ZXi Plus AGS', cc: 998, mileage: 26.68, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 95, rate12Hour: 620, rate24Hour: 1100 } },
  { brand: 'Maruti Suzuki', model: 'Ignis', variant: 'Alpha 1.2 Compact Urban', cc: 1197, mileage: 20.89, fuel: 'petrol', trans: 'manual', seats: 5, price: { hourlyRate: 100, rate12Hour: 680, rate24Hour: 1150 } },
  { brand: 'Maruti Suzuki', model: 'S-Presso', variant: 'VXi Plus AGS', cc: 998, mileage: 25.3, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 85, rate12Hour: 550, rate24Hour: 950 } },
  // Hyundai
  { brand: 'Hyundai', model: 'Grand i10 Nios', variant: 'Asta 1.2 Kappa', cc: 1197, mileage: 20.7, fuel: 'petrol', trans: 'manual', seats: 5, price: { hourlyRate: 105, rate12Hour: 700, rate24Hour: 1200 } },
  { brand: 'Hyundai', model: 'Grand i10 Nios', variant: 'Sportz Smart Auto AMT', cc: 1197, mileage: 20.1, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 115, rate12Hour: 750, rate24Hour: 1300 } },
  { brand: 'Hyundai', model: 'Grand i10 Nios', variant: 'Magna Bi-Fuel CNG', cc: 1197, mileage: 27.3, fuel: 'cng', trans: 'manual', seats: 5, price: { hourlyRate: 110, rate12Hour: 720, rate24Hour: 1250 } },
  { brand: 'Hyundai', model: 'i20', variant: 'Asta (O) 1.2 IVT Automatic', cc: 1197, mileage: 19.65, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 135, rate12Hour: 900, rate24Hour: 1550 } },
  { brand: 'Hyundai', model: 'i20', variant: 'Sportz 1.2 Manual', cc: 1197, mileage: 20.0, fuel: 'petrol', trans: 'manual', seats: 5, price: { hourlyRate: 125, rate12Hour: 820, rate24Hour: 1400 } },
  { brand: 'Hyundai', model: 'i20 N Line', variant: 'N8 1.0 Turbo DCT Automatic', cc: 998, mileage: 20.25, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 160, rate12Hour: 1050, rate24Hour: 1800 } },
  { brand: 'Hyundai', model: 'i20 N Line', variant: 'N6 1.0 Turbo 6MT', cc: 998, mileage: 20.0, fuel: 'petrol', trans: 'manual', seats: 5, price: { hourlyRate: 145, rate12Hour: 950, rate24Hour: 1650 } },
  // Tata
  { brand: 'Tata', model: 'Tiago', variant: 'XZ Plus Dual Tone', cc: 1199, mileage: 19.01, fuel: 'petrol', trans: 'manual', seats: 5, price: { hourlyRate: 95, rate12Hour: 620, rate24Hour: 1100 } },
  { brand: 'Tata', model: 'Tiago', variant: 'XZA Plus AMT Automatic', cc: 1199, mileage: 19.0, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 105, rate12Hour: 700, rate24Hour: 1200 } },
  { brand: 'Tata', model: 'Tiago iCNG', variant: 'XZ Plus Twin Cylinder', cc: 1199, mileage: 26.49, fuel: 'cng', trans: 'manual', seats: 5, price: { hourlyRate: 105, rate12Hour: 700, rate24Hour: 1200 } },
  { brand: 'Tata', model: 'Tiago EV', variant: 'Long Range 24 kWh', cc: 24.0, mileage: 315.0, fuel: 'electric', trans: 'automatic', seats: 5, price: { hourlyRate: 125, rate12Hour: 820, rate24Hour: 1400 } },
  { brand: 'Tata', model: 'Tiago EV', variant: 'Medium Range 19.2 kWh', cc: 19.2, mileage: 250.0, fuel: 'electric', trans: 'automatic', seats: 5, price: { hourlyRate: 115, rate12Hour: 750, rate24Hour: 1300 } },
  { brand: 'Tata', model: 'Altroz', variant: 'XZ Plus 1.2 Revotron', cc: 1199, mileage: 19.33, fuel: 'petrol', trans: 'manual', seats: 5, price: { hourlyRate: 120, rate12Hour: 800, rate24Hour: 1400 } },
  { brand: 'Tata', model: 'Altroz', variant: 'XZA Plus DCA Dual Clutch Auto', cc: 1199, mileage: 18.5, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 135, rate12Hour: 900, rate24Hour: 1550 } },
  { brand: 'Tata', model: 'Altroz', variant: 'XZ Plus 1.5 Diesel', cc: 1497, mileage: 23.64, fuel: 'diesel', trans: 'manual', seats: 5, price: { hourlyRate: 130, rate12Hour: 850, rate24Hour: 1500 } },
  { brand: 'Tata', model: 'Altroz iCNG', variant: 'XZ Plus Dual Cylinder Boot', cc: 1199, mileage: 26.2, fuel: 'cng', trans: 'manual', seats: 5, price: { hourlyRate: 125, rate12Hour: 820, rate24Hour: 1400 } },
  { brand: 'Tata', model: 'Altroz Racer', variant: 'R3 1.2 Turbo 120 PS', cc: 1199, mileage: 18.0, fuel: 'petrol', trans: 'manual', seats: 5, price: { hourlyRate: 150, rate12Hour: 980, rate24Hour: 1700 } },
  // Toyota
  { brand: 'Toyota', model: 'Glanza', variant: 'V Top Model Manual', cc: 1197, mileage: 22.35, fuel: 'petrol', trans: 'manual', seats: 5, price: { hourlyRate: 125, rate12Hour: 820, rate24Hour: 1400 } },
  { brand: 'Toyota', model: 'Glanza', variant: 'V AMT Automatic', cc: 1197, mileage: 22.94, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 135, rate12Hour: 880, rate24Hour: 1500 } },
  { brand: 'Toyota', model: 'Glanza', variant: 'G E-CNG', cc: 1197, mileage: 30.61, fuel: 'cng', trans: 'manual', seats: 5, price: { hourlyRate: 125, rate12Hour: 820, rate24Hour: 1400 } },
  // Citroën & Renault
  { brand: 'Citroën', model: 'C3', variant: 'Shine 1.2 PureTech Turbo', cc: 1199, mileage: 19.3, fuel: 'petrol', trans: 'manual', seats: 5, price: { hourlyRate: 115, rate12Hour: 750, rate24Hour: 1300 } },
  { brand: 'Citroën', model: 'C3', variant: 'Feel 1.2 PureTech', cc: 1199, mileage: 19.8, fuel: 'petrol', trans: 'manual', seats: 5, price: { hourlyRate: 105, rate12Hour: 700, rate24Hour: 1200 } },
  { brand: 'Citroën', model: 'ë-C3', variant: 'Shine Electric 29.2 kWh', cc: 29.2, mileage: 320.0, fuel: 'electric', trans: 'automatic', seats: 5, price: { hourlyRate: 135, rate12Hour: 900, rate24Hour: 1550 } },
  { brand: 'Renault', model: 'Kwid', variant: 'Climber 1.0 Easy-R AMT', cc: 999, mileage: 22.3, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 90, rate12Hour: 600, rate24Hour: 1050 } },
  { brand: 'Renault', model: 'Kwid', variant: 'RXT 1.0 Manual', cc: 999, mileage: 21.7, fuel: 'petrol', trans: 'manual', seats: 5, price: { hourlyRate: 85, rate12Hour: 550, rate24Hour: 950 } }
];

hatchbacks.forEach(h => {
  addModel({
    brand: h.brand, model: h.model, variant: h.variant,
    categorySlug: 'hatchbacks', vehicleType: 'four_wheeler', fuelType: h.fuel, transmission: h.trans,
    seatingCapacity: h.seats || 5, engineCapacity: h.cc, fuelEconomyValue: h.mileage,
    fuelEconomyUnit: h.fuel === 'electric' ? 'km/charge' : h.fuel === 'cng' ? 'km/kg' : 'km/l',
    features: ['Touchscreen Infotainment with Apple CarPlay / Android Auto', 'Dual Airbags / 6 Airbags', 'ABS with EBD', 'Reverse Parking Sensors & Camera', 'Automatic Climate Control'],
    specs: { fuelTankCapacityLiters: h.fuel === 'electric' ? null : 37, batteryCapacityKwh: h.fuel === 'electric' ? h.cc : null, maxPowerBhp: h.fuel === 'electric' ? 74 : 88 },
    pricing: h.price,
    imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80'
  });
});

console.log(`Added ${hatchbacks.length} Hatchbacks.`);

// -------------------------------------------------------------
// 5. SEDANS (48 Models)
// -------------------------------------------------------------
const sedans = [
  // Honda
  { brand: 'Honda', model: 'City', variant: 'ZX 1.5 i-VTEC Manual', cc: 1498, mileage: 17.8, fuel: 'petrol', trans: 'manual', price: { hourlyRate: 160, rate12Hour: 1050, rate24Hour: 1800 } },
  { brand: 'Honda', model: 'City', variant: 'ZX 1.5 i-VTEC CVT Automatic', cc: 1498, mileage: 18.4, fuel: 'petrol', trans: 'automatic', price: { hourlyRate: 175, rate12Hour: 1150, rate24Hour: 1950 } },
  { brand: 'Honda', model: 'City e:HEV', variant: 'Hybrid ZX e-CVT', cc: 1498, mileage: 27.1, fuel: 'hybrid', trans: 'automatic', price: { hourlyRate: 210, rate12Hour: 1350, rate24Hour: 2350 } },
  { brand: 'Honda', model: 'Amaze', variant: 'VX 1.2 i-VTEC Manual', cc: 1199, mileage: 18.6, fuel: 'petrol', trans: 'manual', price: { hourlyRate: 120, rate12Hour: 800, rate24Hour: 1400 } },
  { brand: 'Honda', model: 'Amaze', variant: 'VX 1.2 CVT Automatic', cc: 1199, mileage: 18.3, fuel: 'petrol', trans: 'automatic', price: { hourlyRate: 130, rate12Hour: 850, rate24Hour: 1500 } },
  // Hyundai
  { brand: 'Hyundai', model: 'Verna', variant: 'SX (O) 1.5 Turbo DCT Auto', cc: 1482, mileage: 20.6, fuel: 'petrol', trans: 'automatic', price: { hourlyRate: 190, rate12Hour: 1250, rate24Hour: 2150 } },
  { brand: 'Hyundai', model: 'Verna', variant: 'SX 1.5 Turbo 6MT', cc: 1482, mileage: 20.0, fuel: 'petrol', trans: 'manual', price: { hourlyRate: 170, rate12Hour: 1100, rate24Hour: 1900 } },
  { brand: 'Hyundai', model: 'Verna', variant: 'SX 1.5 MPI IVT Automatic', cc: 1497, mileage: 19.6, fuel: 'petrol', trans: 'automatic', price: { hourlyRate: 165, rate12Hour: 1080, rate24Hour: 1850 } },
  { brand: 'Hyundai', model: 'Aura', variant: 'SX Plus 1.2 AMT Auto', cc: 1197, mileage: 20.0, fuel: 'petrol', trans: 'automatic', price: { hourlyRate: 115, rate12Hour: 750, rate24Hour: 1300 } },
  { brand: 'Hyundai', model: 'Aura', variant: 'SX 1.2 Bi-Fuel CNG', cc: 1197, mileage: 28.4, fuel: 'cng', trans: 'manual', price: { hourlyRate: 115, rate12Hour: 750, rate24Hour: 1300 } },
  // Maruti Suzuki
  { brand: 'Maruti Suzuki', model: 'Dzire', variant: 'ZXi Plus 1.2 Manual', cc: 1197, mileage: 24.79, fuel: 'petrol', trans: 'manual', price: { hourlyRate: 115, rate12Hour: 750, rate24Hour: 1300 } },
  { brand: 'Maruti Suzuki', model: 'Dzire', variant: 'ZXi Plus AGS Automatic', cc: 1197, mileage: 25.71, fuel: 'petrol', trans: 'automatic', price: { hourlyRate: 125, rate12Hour: 820, rate24Hour: 1400 } },
  { brand: 'Maruti Suzuki', model: 'Dzire', variant: 'ZXi S-CNG', cc: 1197, mileage: 33.73, fuel: 'cng', trans: 'manual', price: { hourlyRate: 120, rate12Hour: 780, rate24Hour: 1350 } },
  { brand: 'Maruti Suzuki', model: 'Ciaz', variant: 'Alpha 1.5 Smart Hybrid Auto', cc: 1462, mileage: 20.04, fuel: 'hybrid', trans: 'automatic', price: { hourlyRate: 145, rate12Hour: 950, rate24Hour: 1650 } },
  { brand: 'Maruti Suzuki', model: 'Ciaz', variant: 'Alpha 1.5 Smart Hybrid Manual', cc: 1462, mileage: 20.65, fuel: 'hybrid', trans: 'manual', price: { hourlyRate: 135, rate12Hour: 900, rate24Hour: 1550 } },
  // Skoda & Volkswagen
  { brand: 'Skoda', model: 'Slavia', variant: 'Style 1.5 TSI DSG Automatic', cc: 1498, mileage: 18.5, fuel: 'petrol', trans: 'automatic', price: { hourlyRate: 195, rate12Hour: 1280, rate24Hour: 2200 } },
  { brand: 'Skoda', model: 'Slavia', variant: 'Style 1.5 TSI Manual', cc: 1498, mileage: 19.0, fuel: 'petrol', trans: 'manual', price: { hourlyRate: 175, rate12Hour: 1150, rate24Hour: 1950 } },
  { brand: 'Skoda', model: 'Slavia', variant: 'Ambition 1.0 TSI AT Automatic', cc: 999, mileage: 18.07, fuel: 'petrol', trans: 'automatic', price: { hourlyRate: 160, rate12Hour: 1050, rate24Hour: 1800 } },
  { brand: 'Skoda', model: 'Slavia', variant: 'Active 1.0 TSI Manual', cc: 999, mileage: 20.32, fuel: 'petrol', trans: 'manual', price: { hourlyRate: 145, rate12Hour: 950, rate24Hour: 1650 } },
  { brand: 'Volkswagen', model: 'Virtus', variant: 'GT Plus 1.5 TSI DSG Automatic', cc: 1498, mileage: 18.67, fuel: 'petrol', trans: 'automatic', price: { hourlyRate: 200, rate12Hour: 1300, rate24Hour: 2250 } },
  { brand: 'Volkswagen', model: 'Virtus', variant: 'GT Plus 1.5 TSI Manual', cc: 1498, mileage: 18.88, fuel: 'petrol', trans: 'manual', price: { hourlyRate: 180, rate12Hour: 1180, rate24Hour: 2050 } },
  { brand: 'Volkswagen', model: 'Virtus', variant: 'Topline 1.0 TSI AT Automatic', cc: 999, mileage: 18.12, fuel: 'petrol', trans: 'automatic', price: { hourlyRate: 165, rate12Hour: 1080, rate24Hour: 1850 } },
  { brand: 'Volkswagen', model: 'Virtus', variant: 'Highline 1.0 TSI Manual', cc: 999, mileage: 20.08, fuel: 'petrol', trans: 'manual', price: { hourlyRate: 150, rate12Hour: 980, rate24Hour: 1700 } },
  // Toyota
  { brand: 'Toyota', model: 'Camry', variant: 'Hybrid 2.5 Dynamic Force e-CVT', cc: 2487, mileage: 23.27, fuel: 'hybrid', trans: 'automatic', price: { hourlyRate: 350, rate12Hour: 2300, rate24Hour: 3900 } },
  // Luxury Sedans
  { brand: 'BMW', model: '3 Series Gran Limousine', variant: '330Li M Sport', cc: 1998, mileage: 15.3, fuel: 'petrol', trans: 'automatic', price: { hourlyRate: 450, rate12Hour: 2900, rate24Hour: 4900 } },
  { brand: 'BMW', model: '3 Series Gran Limousine', variant: '320Ld Luxury Edition', cc: 1995, mileage: 19.6, fuel: 'diesel', trans: 'automatic', price: { hourlyRate: 450, rate12Hour: 2900, rate24Hour: 4900 } },
  { brand: 'BMW', model: '2 Series Gran Coupe', variant: '220i M Sport', cc: 1998, mileage: 14.82, fuel: 'petrol', trans: 'automatic', price: { hourlyRate: 380, rate12Hour: 2500, rate24Hour: 4200 } },
  { brand: 'BMW', model: 'M340i xDrive', variant: '3.0L Inline-6 387 PS', cc: 2998, mileage: 13.02, fuel: 'petrol', trans: 'automatic', price: { hourlyRate: 600, rate12Hour: 3900, rate24Hour: 6500 } },
  { brand: 'Mercedes-Benz', model: 'C-Class', variant: 'C 200 Avantgarde', cc: 1496, mileage: 16.9, fuel: 'petrol', trans: 'automatic', price: { hourlyRate: 480, rate12Hour: 3100, rate24Hour: 5200 } },
  { brand: 'Mercedes-Benz', model: 'C-Class', variant: 'C 220d Luxury', cc: 1993, mileage: 23.0, fuel: 'diesel', trans: 'automatic', price: { hourlyRate: 480, rate12Hour: 3100, rate24Hour: 5200 } },
  { brand: 'Mercedes-Benz', model: 'A-Class Limousine', variant: 'A 200 Progressive Line', cc: 1332, mileage: 17.5, fuel: 'petrol', trans: 'automatic', price: { hourlyRate: 380, rate12Hour: 2500, rate24Hour: 4200 } },
  { brand: 'Mercedes-Benz', model: 'E-Class', variant: 'E 200 Exclusive LWB', cc: 1991, mileage: 15.0, fuel: 'petrol', trans: 'automatic', price: { hourlyRate: 650, rate12Hour: 4200, rate24Hour: 7000 } },
  { brand: 'Audi', model: 'A4', variant: '40 TFSI Technology', cc: 1984, mileage: 17.4, fuel: 'petrol', trans: 'automatic', price: { hourlyRate: 420, rate12Hour: 2700, rate24Hour: 4600 } },
  { brand: 'Audi', model: 'A6', variant: '45 TFSI Technology Matrix', cc: 1984, mileage: 14.0, fuel: 'petrol', trans: 'automatic', price: { hourlyRate: 580, rate12Hour: 3700, rate24Hour: 6200 } },
  { brand: 'Lexus', model: 'ES 300h', variant: 'Luxury Self-Charging Hybrid', cc: 2487, mileage: 22.58, fuel: 'hybrid', trans: 'automatic', price: { hourlyRate: 520, rate12Hour: 3400, rate24Hour: 5700 } }
];

sedans.forEach(s => {
  addModel({
    brand: s.brand, model: s.model, variant: s.variant,
    categorySlug: 'sedans', vehicleType: 'four_wheeler', fuelType: s.fuel, transmission: s.trans,
    seatingCapacity: 5, engineCapacity: s.cc, fuelEconomyValue: s.mileage,
    fuelEconomyUnit: s.fuel === 'electric' ? 'km/charge' : s.fuel === 'cng' ? 'km/kg' : 'km/l',
    features: ['Spacious 500L+ Boot Space', 'Sunroof', 'Touchscreen with Android Auto & Apple CarPlay', 'Cruise Control', 'Wireless Phone Charging', 'Leather Upholstery', 'Electronic Stability Control'],
    specs: { fuelTankCapacityLiters: 45, maxPowerBhp: s.power || 120, maxTorqueNm: s.torque || 170 },
    pricing: s.price,
    imageUrl: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80'
  });
});

console.log(`Added ${sedans.length} Sedans.`);

// -------------------------------------------------------------
// 6. SUVS & MPVS (75 Models)
// -------------------------------------------------------------
const suvs = [
  // Mahindra
  { brand: 'Mahindra', model: 'Thar 4x4', variant: 'LX Hard Top Diesel AT', cc: 2184, mileage: 15.2, fuel: 'diesel', trans: 'automatic', seats: 4, price: { hourlyRate: 180, rate12Hour: 1150, rate24Hour: 1950 } },
  { brand: 'Mahindra', model: 'Thar 4x4', variant: 'LX Hard Top Petrol AT', cc: 1997, mileage: 13.5, fuel: 'petrol', trans: 'automatic', seats: 4, price: { hourlyRate: 175, rate12Hour: 1120, rate24Hour: 1900 } },
  { brand: 'Mahindra', model: 'Thar 4x4', variant: 'AX Opt Convertible MT', cc: 2184, mileage: 15.2, fuel: 'diesel', trans: 'manual', seats: 4, price: { hourlyRate: 165, rate12Hour: 1050, rate24Hour: 1800 } },
  { brand: 'Mahindra', model: 'Thar Roxx', variant: 'AX7L 4x4 5-Door Diesel AT', cc: 2184, mileage: 15.2, fuel: 'diesel', trans: 'automatic', seats: 5, price: { hourlyRate: 220, rate12Hour: 1450, rate24Hour: 2450 } },
  { brand: 'Mahindra', model: 'Scorpio-N', variant: 'Z8L 4x4 Diesel AT', cc: 2184, mileage: 16.2, fuel: 'diesel', trans: 'automatic', seats: 7, price: { hourlyRate: 210, rate12Hour: 1380, rate24Hour: 2350 } },
  { brand: 'Mahindra', model: 'Scorpio-N', variant: 'Z8 2.0 Turbo Petrol AT', cc: 1997, mileage: 14.0, fuel: 'petrol', trans: 'automatic', seats: 7, price: { hourlyRate: 195, rate12Hour: 1280, rate24Hour: 2200 } },
  { brand: 'Mahindra', model: 'Scorpio-N', variant: 'Z4 Diesel 4x2 6MT', cc: 2184, mileage: 16.5, fuel: 'diesel', trans: 'manual', seats: 7, price: { hourlyRate: 175, rate12Hour: 1150, rate24Hour: 1950 } },
  { brand: 'Mahindra', model: 'Scorpio Classic', variant: 'S11 9-Seater Diesel', cc: 2184, mileage: 15.0, fuel: 'diesel', trans: 'manual', seats: 7, price: { hourlyRate: 170, rate12Hour: 1100, rate24Hour: 1900 } },
  { brand: 'Mahindra', model: 'XUV700', variant: 'AX7L AWD Diesel AT', cc: 2184, mileage: 16.5, fuel: 'diesel', trans: 'automatic', seats: 7, price: { hourlyRate: 230, rate12Hour: 1500, rate24Hour: 2550 } },
  { brand: 'Mahindra', model: 'XUV700', variant: 'AX5 2.0 Turbo Petrol AT', cc: 1997, mileage: 13.0, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 195, rate12Hour: 1280, rate24Hour: 2200 } },
  { brand: 'Mahindra', model: 'XUV 3XO', variant: 'AX5L 1.2 Turbo Petrol AT', cc: 1197, mileage: 18.2, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 145, rate12Hour: 950, rate24Hour: 1650 } },
  { brand: 'Mahindra', model: 'Bolero Neo', variant: 'N10 (O) Multi-Terrain Tech', cc: 1493, mileage: 16.0, fuel: 'diesel', trans: 'manual', seats: 7, price: { hourlyRate: 140, rate12Hour: 900, rate24Hour: 1550 } },
  { brand: 'Mahindra', model: 'XUV400 EV', variant: 'EL Pro 39.4 kWh', cc: 39.4, mileage: 456.0, fuel: 'electric', trans: 'automatic', seats: 5, price: { hourlyRate: 180, rate12Hour: 1150, rate24Hour: 1950 } },
  // Tata
  { brand: 'Tata', model: 'Nexon', variant: 'Fearless Plus S 1.5 Diesel AMT', cc: 1497, mileage: 23.23, fuel: 'diesel', trans: 'automatic', seats: 5, price: { hourlyRate: 165, rate12Hour: 1080, rate24Hour: 1850 } },
  { brand: 'Tata', model: 'Nexon', variant: 'Creative Plus 1.2 Turbo DCA', cc: 1199, mileage: 17.01, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 155, rate12Hour: 1000, rate24Hour: 1750 } },
  { brand: 'Tata', model: 'Nexon', variant: 'Smart Plus 1.2 Turbo Manual', cc: 1199, mileage: 17.44, fuel: 'petrol', trans: 'manual', seats: 5, price: { hourlyRate: 135, rate12Hour: 900, rate24Hour: 1550 } },
  { brand: 'Tata', model: 'Nexon EV', variant: 'Empowered Plus Long Range 45 kWh', cc: 45.0, mileage: 489.0, fuel: 'electric', trans: 'automatic', seats: 5, price: { hourlyRate: 190, rate12Hour: 1250, rate24Hour: 2150 } },
  { brand: 'Tata', model: 'Nexon EV', variant: 'Fearless 40.5 kWh', cc: 40.5, mileage: 465.0, fuel: 'electric', trans: 'automatic', seats: 5, price: { hourlyRate: 175, rate12Hour: 1150, rate24Hour: 1950 } },
  { brand: 'Tata', model: 'Punch', variant: 'Creative Flagship 1.2 AMT', cc: 1199, mileage: 18.8, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 115, rate12Hour: 750, rate24Hour: 1300 } },
  { brand: 'Tata', model: 'Punch', variant: 'Adventure 1.2 Manual', cc: 1199, mileage: 20.09, fuel: 'petrol', trans: 'manual', seats: 5, price: { hourlyRate: 105, rate12Hour: 700, rate24Hour: 1200 } },
  { brand: 'Tata', model: 'Punch iCNG', variant: 'Accomplished Dazzle', cc: 1199, mileage: 26.99, fuel: 'cng', trans: 'manual', seats: 5, price: { hourlyRate: 115, rate12Hour: 750, rate24Hour: 1300 } },
  { brand: 'Tata', model: 'Punch EV', variant: 'Empowered Plus S 35 kWh', cc: 35.0, mileage: 421.0, fuel: 'electric', trans: 'automatic', seats: 5, price: { hourlyRate: 145, rate12Hour: 950, rate24Hour: 1650 } },
  { brand: 'Tata', model: 'Curvv', variant: 'Accomplished Plus A 1.5 Diesel DCA', cc: 1497, mileage: 22.4, fuel: 'diesel', trans: 'automatic', seats: 5, price: { hourlyRate: 195, rate12Hour: 1280, rate24Hour: 2200 } },
  { brand: 'Tata', model: 'Curvv EV', variant: 'Empowered Plus 55 kWh Long Range', cc: 55.0, mileage: 585.0, fuel: 'electric', trans: 'automatic', seats: 5, price: { hourlyRate: 230, rate12Hour: 1500, rate24Hour: 2550 } },
  { brand: 'Tata', model: 'Harrier', variant: 'Fearless Plus Dark Edition AT', cc: 1956, mileage: 16.8, fuel: 'diesel', trans: 'automatic', seats: 5, price: { hourlyRate: 220, rate12Hour: 1450, rate24Hour: 2450 } },
  { brand: 'Tata', model: 'Harrier', variant: 'Adventure Plus 6MT', cc: 1956, mileage: 16.8, fuel: 'diesel', trans: 'manual', seats: 5, price: { hourlyRate: 195, rate12Hour: 1280, rate24Hour: 2200 } },
  { brand: 'Tata', model: 'Safari', variant: 'Accomplished Plus 6-Seater AT', cc: 1956, mileage: 16.3, fuel: 'diesel', trans: 'automatic', seats: 7, price: { hourlyRate: 240, rate12Hour: 1580, rate24Hour: 2700 } },
  { brand: 'Tata', model: 'Safari', variant: 'Adventure Plus 7-Seater MT', cc: 1956, mileage: 16.3, fuel: 'diesel', trans: 'manual', seats: 7, price: { hourlyRate: 215, rate12Hour: 1400, rate24Hour: 2400 } },
  // Hyundai
  { brand: 'Hyundai', model: 'Creta', variant: 'SX (O) 1.5 Turbo DCT Auto', cc: 1482, mileage: 18.4, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 190, rate12Hour: 1250, rate24Hour: 2150 } },
  { brand: 'Hyundai', model: 'Creta', variant: 'SX (O) 1.5 CRDi Diesel AT', cc: 1493, mileage: 19.1, fuel: 'diesel', trans: 'automatic', seats: 5, price: { hourlyRate: 190, rate12Hour: 1250, rate24Hour: 2150 } },
  { brand: 'Hyundai', model: 'Creta', variant: 'SX Tech 1.5 Petrol IVT', cc: 1497, mileage: 17.7, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 170, rate12Hour: 1100, rate24Hour: 1900 } },
  { brand: 'Hyundai', model: 'Creta', variant: 'S(O) 1.5 Petrol Manual', cc: 1497, mileage: 17.4, fuel: 'petrol', trans: 'manual', seats: 5, price: { hourlyRate: 150, rate12Hour: 980, rate24Hour: 1700 } },
  { brand: 'Hyundai', model: 'Creta N Line', variant: 'N10 1.5 Turbo DCT', cc: 1482, mileage: 18.2, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 200, rate12Hour: 1300, rate24Hour: 2250 } },
  { brand: 'Hyundai', model: 'Venue', variant: 'SX (O) 1.0 Turbo DCT', cc: 998, mileage: 18.3, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 155, rate12Hour: 1000, rate24Hour: 1750 } },
  { brand: 'Hyundai', model: 'Venue', variant: 'S Plus 1.2 Kappa Manual', cc: 1197, mileage: 17.5, fuel: 'petrol', trans: 'manual', seats: 5, price: { hourlyRate: 135, rate12Hour: 900, rate24Hour: 1550 } },
  { brand: 'Hyundai', model: 'Exter', variant: 'SX (O) Connect 1.2 AMT', cc: 1197, mileage: 19.2, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 125, rate12Hour: 820, rate24Hour: 1400 } },
  { brand: 'Hyundai', model: 'Exter', variant: 'SX 1.2 Bi-Fuel CNG', cc: 1197, mileage: 27.1, fuel: 'cng', trans: 'manual', seats: 5, price: { hourlyRate: 120, rate12Hour: 800, rate24Hour: 1350 } },
  { brand: 'Hyundai', model: 'Alcazar', variant: 'Signature 1.5 Turbo DCT 6-Seater', cc: 1482, mileage: 17.5, fuel: 'petrol', trans: 'automatic', seats: 6, price: { hourlyRate: 210, rate12Hour: 1380, rate24Hour: 2350 } },
  { brand: 'Hyundai', model: 'Tucson', variant: 'Signature 2.0 Diesel AWD 8AT', cc: 1997, mileage: 15.38, fuel: 'diesel', trans: 'automatic', seats: 5, price: { hourlyRate: 320, rate12Hour: 2100, rate24Hour: 3600 } },
  { brand: 'Hyundai', model: 'Ioniq 5', variant: 'Long Range 72.6 kWh RWD', cc: 72.6, mileage: 631.0, fuel: 'electric', trans: 'automatic', seats: 5, price: { hourlyRate: 380, rate12Hour: 2500, rate24Hour: 4200 } },
  // Kia
  { brand: 'Kia', model: 'Seltos', variant: 'GTX Plus 1.5 Turbo DCT', cc: 1482, mileage: 17.9, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 195, rate12Hour: 1280, rate24Hour: 2200 } },
  { brand: 'Kia', model: 'Seltos', variant: 'X-Line 1.5 CRDi Diesel AT', cc: 1493, mileage: 19.1, fuel: 'diesel', trans: 'automatic', seats: 5, price: { hourlyRate: 200, rate12Hour: 1300, rate24Hour: 2250 } },
  { brand: 'Kia', model: 'Seltos', variant: 'HTX 1.5 Petrol IVT', cc: 1497, mileage: 17.7, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 170, rate12Hour: 1100, rate24Hour: 1900 } },
  { brand: 'Kia', model: 'Sonet', variant: 'GTX Plus 1.0 Turbo 7DCT', cc: 998, mileage: 19.2, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 155, rate12Hour: 1000, rate24Hour: 1750 } },
  { brand: 'Kia', model: 'Sonet', variant: 'HTX 1.5 Diesel 6AT', cc: 1493, mileage: 18.6, fuel: 'diesel', trans: 'automatic', seats: 5, price: { hourlyRate: 155, rate12Hour: 1000, rate24Hour: 1750 } },
  { brand: 'Kia', model: 'Carens', variant: 'Luxury Plus 1.5 Turbo 6-Seater', cc: 1482, mileage: 16.5, fuel: 'petrol', trans: 'automatic', seats: 6, price: { hourlyRate: 180, rate12Hour: 1150, rate24Hour: 1950 } },
  { brand: 'Kia', model: 'Carens', variant: 'Prestige 1.5 Diesel 7-Seater', cc: 1493, mileage: 21.0, fuel: 'diesel', trans: 'manual', seats: 7, price: { hourlyRate: 165, rate12Hour: 1080, rate24Hour: 1850 } },
  { brand: 'Kia', model: 'EV6', variant: 'GT-Line AWD 77.4 kWh', cc: 77.4, mileage: 708.0, fuel: 'electric', trans: 'automatic', seats: 5, price: { hourlyRate: 450, rate12Hour: 2900, rate24Hour: 4900 } },
  // Maruti Suzuki
  { brand: 'Maruti Suzuki', model: 'Brezza', variant: 'ZXi Plus 1.5 AT', cc: 1462, mileage: 19.8, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 145, rate12Hour: 950, rate24Hour: 1650 } },
  { brand: 'Maruti Suzuki', model: 'Brezza', variant: 'VXi S-CNG', cc: 1462, mileage: 25.51, fuel: 'cng', trans: 'manual', seats: 5, price: { hourlyRate: 135, rate12Hour: 900, rate24Hour: 1550 } },
  { brand: 'Maruti Suzuki', model: 'Fronx', variant: 'Alpha 1.0 Turbo 6AT', cc: 998, mileage: 20.01, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 140, rate12Hour: 920, rate24Hour: 1600 } },
  { brand: 'Maruti Suzuki', model: 'Grand Vitara', variant: 'Alpha Plus Strong Hybrid e-CVT', cc: 1490, mileage: 27.97, fuel: 'hybrid', trans: 'automatic', seats: 5, price: { hourlyRate: 190, rate12Hour: 1250, rate24Hour: 2150 } },
  { brand: 'Maruti Suzuki', model: 'Grand Vitara', variant: 'Alpha AllGrip 4x4 AWD', cc: 1462, mileage: 19.38, fuel: 'petrol', trans: 'manual', seats: 5, price: { hourlyRate: 175, rate12Hour: 1150, rate24Hour: 1950 } },
  { brand: 'Maruti Suzuki', model: 'Jimny', variant: 'Alpha 4x4 AllGrip Pro AT', cc: 1462, mileage: 16.39, fuel: 'petrol', trans: 'automatic', seats: 4, price: { hourlyRate: 160, rate12Hour: 1050, rate24Hour: 1800 } },
  // Toyota
  { brand: 'Toyota', model: 'Urban Cruiser Hyryder', variant: 'V Hybrid e-CVT', cc: 1490, mileage: 27.97, fuel: 'hybrid', trans: 'automatic', seats: 5, price: { hourlyRate: 190, rate12Hour: 1250, rate24Hour: 2150 } },
  { brand: 'Toyota', model: 'Innova Crysta', variant: 'ZX 2.4 Diesel 7-Seater', cc: 2393, mileage: 15.1, fuel: 'diesel', trans: 'manual', seats: 7, price: { hourlyRate: 230, rate12Hour: 1500, rate24Hour: 2550 } },
  { brand: 'Toyota', model: 'Innova Hycross', variant: 'ZX(O) Strong Hybrid Ottoman', cc: 1987, mileage: 23.24, fuel: 'hybrid', trans: 'automatic', seats: 7, price: { hourlyRate: 270, rate12Hour: 1750, rate24Hour: 2950 } },
  { brand: 'Toyota', model: 'Fortuner', variant: '4x4 Sigma 4 Diesel AT', cc: 2755, mileage: 14.4, fuel: 'diesel', trans: 'automatic', seats: 7, price: { hourlyRate: 380, rate12Hour: 2500, rate24Hour: 4200 } },
  { brand: 'Toyota', model: 'Fortuner Legender', variant: '4x4 Diesel AT', cc: 2755, mileage: 14.4, fuel: 'diesel', trans: 'automatic', seats: 7, price: { hourlyRate: 420, rate12Hour: 2700, rate24Hour: 4600 } },
  // MG
  { brand: 'MG', model: 'ZS EV', variant: 'Exclusive Plus 50.3 kWh', cc: 50.3, mileage: 461.0, fuel: 'electric', trans: 'automatic', seats: 5, price: { hourlyRate: 210, rate12Hour: 1380, rate24Hour: 2350 } },
  { brand: 'MG', model: 'Hector', variant: 'Savvy Pro 1.5 Turbo CVT', cc: 1451, mileage: 13.96, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 185, rate12Hour: 1200, rate24Hour: 2100 } },
  { brand: 'MG', model: 'Hector Plus', variant: 'Sharp Pro 2.0 Diesel 6-Seater', cc: 1956, mileage: 15.58, fuel: 'diesel', trans: 'manual', seats: 6, price: { hourlyRate: 200, rate12Hour: 1300, rate24Hour: 2250 } },
  { brand: 'MG', model: 'Comet EV', variant: 'Exclusive Fast Charge 17.3 kWh', cc: 17.3, mileage: 230.0, fuel: 'electric', trans: 'automatic', seats: 4, price: { hourlyRate: 90, rate12Hour: 600, rate24Hour: 999 } },
  { brand: 'MG', model: 'Gloster', variant: 'Savvy 4x4 Twin Turbo 7-Seater', cc: 1996, mileage: 12.04, fuel: 'diesel', trans: 'automatic', seats: 7, price: { hourlyRate: 350, rate12Hour: 2300, rate24Hour: 3900 } },
  // VW & Skoda & Jeep
  { brand: 'Volkswagen', model: 'Taigun', variant: 'GT Plus Edge 1.5 TSI DSG', cc: 1498, mileage: 17.88, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 195, rate12Hour: 1280, rate24Hour: 2200 } },
  { brand: 'Skoda', model: 'Kushaq', variant: 'Monte Carlo 1.5 TSI DSG', cc: 1498, mileage: 17.88, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 195, rate12Hour: 1280, rate24Hour: 2200 } },
  { brand: 'Jeep', model: 'Compass', variant: 'Model S 4x4 9AT Diesel', cc: 1956, mileage: 15.3, fuel: 'diesel', trans: 'automatic', seats: 5, price: { hourlyRate: 250, rate12Hour: 1650, rate24Hour: 2800 } },
  { brand: 'Jeep', model: 'Meridian', variant: 'Overland 4x4 7-Seater', cc: 1956, mileage: 15.0, fuel: 'diesel', trans: 'automatic', seats: 7, price: { hourlyRate: 290, rate12Hour: 1900, rate24Hour: 3200 } },
  // Luxury SUVs
  { brand: 'BMW', model: 'X1', variant: 'sDrive18d M Sport', cc: 1995, mileage: 20.37, fuel: 'diesel', trans: 'automatic', seats: 5, price: { hourlyRate: 450, rate12Hour: 2900, rate24Hour: 4900 } },
  { brand: 'BMW', model: 'X5', variant: 'xDrive40i M Sport', cc: 2998, mileage: 12.0, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 850, rate12Hour: 5500, rate24Hour: 9500 } },
  { brand: 'Mercedes-Benz', model: 'GLA', variant: '200 AMG Line', cc: 1332, mileage: 17.4, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 460, rate12Hour: 3000, rate24Hour: 5100 } },
  { brand: 'Mercedes-Benz', model: 'GLC', variant: '300 4MATIC Mild Hybrid', cc: 1999, mileage: 14.72, fuel: 'hybrid', trans: 'automatic', seats: 5, price: { hourlyRate: 650, rate12Hour: 4200, rate24Hour: 7200 } },
  { brand: 'Audi', model: 'Q3', variant: '40 TFSI Quattro Technology', cc: 1984, mileage: 14.93, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 440, rate12Hour: 2850, rate24Hour: 4800 } },
  { brand: 'Audi', model: 'Q7', variant: '55 TFSI Quattro Matrix 7-Seater', cc: 2995, mileage: 11.21, fuel: 'petrol', trans: 'automatic', seats: 7, price: { hourlyRate: 800, rate12Hour: 5200, rate24Hour: 8900 } },
  { brand: 'Land Rover', model: 'Defender 110', variant: '2.0 SE 4x4 Off-Roader', cc: 1997, mileage: 11.5, fuel: 'petrol', trans: 'automatic', seats: 7, price: { hourlyRate: 950, rate12Hour: 6200, rate24Hour: 10500 } },
  // Additional Popular New Launches & EVs
  { brand: 'Mahindra', model: 'Thar Roxx', variant: 'AX7L 4x4 2.2L Diesel AT', cc: 2184, mileage: 14.5, fuel: 'diesel', trans: 'automatic', seats: 5, price: { hourlyRate: 260, rate12Hour: 1700, rate24Hour: 2900 } },
  { brand: 'Mahindra', model: 'XUV 3XO', variant: 'AX7L 1.2 TGDi Turbo AT', cc: 1197, mileage: 18.2, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 165, rate12Hour: 1080, rate24Hour: 1850 } },
  { brand: 'Force', model: 'Gurkha', variant: '5-Door 4x4 2.6L CRDe Diesel', cc: 2596, mileage: 12.0, fuel: 'diesel', trans: 'manual', seats: 7, price: { hourlyRate: 240, rate12Hour: 1550, rate24Hour: 2650 } },
  { brand: 'Hyundai', model: 'Creta N Line', variant: 'N8 1.5 Turbo 7-Speed DCT', cc: 1482, mileage: 18.4, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 205, rate12Hour: 1350, rate24Hour: 2300 } },
  { brand: 'Tata', model: 'Curvv EV', variant: 'Empowered Plus A 55 kWh', cc: 55.0, mileage: 502.0, fuel: 'electric', trans: 'automatic', seats: 5, price: { hourlyRate: 220, rate12Hour: 1450, rate24Hour: 2450 } },
  { brand: 'Tata', model: 'Curvv', variant: 'Accomplished Plus 1.2 Hyperion GDi DCA', cc: 1199, mileage: 16.8, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 180, rate12Hour: 1180, rate24Hour: 2000 } },
  { brand: 'BYD', model: 'Atto 3', variant: 'Superior 60.48 kWh Extended Range', cc: 60.48, mileage: 521.0, fuel: 'electric', trans: 'automatic', seats: 5, price: { hourlyRate: 280, rate12Hour: 1800, rate24Hour: 3100 } },
  { brand: 'BYD', model: 'Seal', variant: 'Performance AWD Dual Motor 82.5 kWh', cc: 82.56, mileage: 580.0, fuel: 'electric', trans: 'automatic', seats: 5, price: { hourlyRate: 480, rate12Hour: 3100, rate24Hour: 5300 } },
  { brand: 'Hyundai', model: 'Ioniq 5', variant: 'Long Range RWD 72.6 kWh', cc: 72.6, mileage: 631.0, fuel: 'electric', trans: 'automatic', seats: 5, price: { hourlyRate: 490, rate12Hour: 3200, rate24Hour: 5400 } },
  { brand: 'Kia', model: 'EV6', variant: 'GT-Line AWD Dual Motor 77.4 kWh', cc: 77.4, mileage: 708.0, fuel: 'electric', trans: 'automatic', seats: 5, price: { hourlyRate: 520, rate12Hour: 3400, rate24Hour: 5800 } },
  { brand: 'Citroen', model: 'eC3', variant: 'Shine 29.2 kWh', cc: 29.2, mileage: 320.0, fuel: 'electric', trans: 'automatic', seats: 5, price: { hourlyRate: 110, rate12Hour: 720, rate24Hour: 1250 } },
  { brand: 'Citroen', model: 'Basalt', variant: 'Max 1.2 Turbo AT Coupe SUV', cc: 1199, mileage: 18.7, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 170, rate12Hour: 1100, rate24Hour: 1900 } },
  { brand: 'Citroen', model: 'Aircross', variant: 'Max 1.2 Turbo 7-Seater AT', cc: 1199, mileage: 17.6, fuel: 'petrol', trans: 'automatic', seats: 7, price: { hourlyRate: 185, rate12Hour: 1200, rate24Hour: 2050 } },
  { brand: 'Toyota', model: 'Hilux', variant: 'High 4x4 2.8L Diesel AT Adventure', cc: 2755, mileage: 13.0, fuel: 'diesel', trans: 'automatic', seats: 5, price: { hourlyRate: 450, rate12Hour: 2950, rate24Hour: 5000 } },
  { brand: 'Isuzu', model: 'D-Max V-Cross', variant: 'Z-Prestige 4x4 1.9L Diesel AT', cc: 1898, mileage: 14.2, fuel: 'diesel', trans: 'automatic', seats: 5, price: { hourlyRate: 320, rate12Hour: 2100, rate24Hour: 3600 } },
  { brand: 'Nissan', model: 'Magnite', variant: 'XV Premium Turbo CVT', cc: 999, mileage: 17.7, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 140, rate12Hour: 920, rate24Hour: 1550 } },
  { brand: 'Renault', model: 'Kiger', variant: 'RXZ Turbo X-Tronic CVT', cc: 999, mileage: 18.24, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 140, rate12Hour: 920, rate24Hour: 1550 } },
  { brand: 'Tata', model: 'Safari', variant: 'Accomplished Plus 2.0L Diesel AT 6S', cc: 1956, mileage: 14.5, fuel: 'diesel', trans: 'automatic', seats: 6, price: { hourlyRate: 260, rate12Hour: 1700, rate24Hour: 2900 } },
  { brand: 'Toyota', model: 'Urban Cruiser Taisor', variant: 'V 1.0L Turbo AT Dual Tone', cc: 998, mileage: 20.01, fuel: 'petrol', trans: 'automatic', seats: 5, price: { hourlyRate: 160, rate12Hour: 1050, rate24Hour: 1800 } },
  { brand: 'Mahindra', model: 'Scorpio Classic', variant: 'S11 2.2L mHawk Diesel', cc: 2184, mileage: 14.4, fuel: 'diesel', trans: 'manual', seats: 7, price: { hourlyRate: 210, rate12Hour: 1380, rate24Hour: 2350 } },
  { brand: 'Hyundai', model: 'Alcazar', variant: 'Signature 1.5 Turbo DCT 6S', cc: 1482, mileage: 18.0, fuel: 'petrol', trans: 'automatic', seats: 6, price: { hourlyRate: 230, rate12Hour: 1500, rate24Hour: 2550 } },
  { brand: 'Kia', model: 'Carens', variant: 'Luxury Plus 1.5 Turbo DCT 6S', cc: 1482, mileage: 16.5, fuel: 'petrol', trans: 'automatic', seats: 6, price: { hourlyRate: 200, rate12Hour: 1300, rate24Hour: 2200 } },
  { brand: 'Toyota', model: 'Rumion', variant: 'V 1.5L Automatic', cc: 1462, mileage: 20.11, fuel: 'petrol', trans: 'automatic', seats: 7, price: { hourlyRate: 170, rate12Hour: 1100, rate24Hour: 1900 } },
  { brand: 'Maruti Suzuki', model: 'Invicto', variant: 'Alpha Plus 2.0L Strong Hybrid e-CVT', cc: 1987, mileage: 23.24, fuel: 'hybrid', trans: 'automatic', seats: 7, price: { hourlyRate: 280, rate12Hour: 1850, rate24Hour: 3100 } },
  { brand: 'Volvo', model: 'XC40 Recharge', variant: 'Ultimate Single Motor 69 kWh', cc: 69.0, mileage: 475.0, fuel: 'electric', trans: 'automatic', seats: 5, price: { hourlyRate: 480, rate12Hour: 3100, rate24Hour: 5300 } },
  { brand: 'Volvo', model: 'XC60', variant: 'B5 Ultimate AWD Mild Hybrid', cc: 1969, mileage: 12.4, fuel: 'hybrid', trans: 'automatic', seats: 5, price: { hourlyRate: 750, rate12Hour: 4900, rate24Hour: 8300 } }
];

suvs.forEach(s => {
  addModel({
    brand: s.brand, model: s.model, variant: s.variant,
    categorySlug: 'suvs', vehicleType: 'four_wheeler', fuelType: s.fuel, transmission: s.trans,
    seatingCapacity: s.seats || 5, engineCapacity: s.cc, fuelEconomyValue: s.mileage,
    fuelEconomyUnit: s.fuel === 'electric' ? 'km/charge' : s.fuel === 'cng' ? 'km/kg' : 'km/l',
    features: ['High Ground Clearance (200mm+)', 'Touchscreen with Navigation & Wireless Phone Projection', 'Hill Descent & Hill Hold Control', 'Panoramic Sunroof', 'Dual / 6 Airbags', 'All-Wheel Drive / 4x4 Available'],
    specs: { fuelTankCapacityLiters: s.fuel === 'electric' ? null : 50, batteryCapacityKwh: s.fuel === 'electric' ? s.cc : null, maxPowerBhp: s.fuel === 'electric' ? 140 : 150 },
    pricing: s.price,
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'
  });
});

console.log(`Added ${suvs.length} SUVs & MPVs.`);

// Check total count
console.log(`====================================================`);
console.log(`TOTAL UNIQUE VEHICLE MODELS COMPILED: ${allVehicles.length}`);
console.log(`====================================================`);

const outputPath = path.join(dataDir, 'vehicle-catalog.json');
fs.writeFileSync(outputPath, JSON.stringify(allVehicles, null, 2), 'utf-8');
console.log(`Saved master dataset to: ${outputPath}`);
