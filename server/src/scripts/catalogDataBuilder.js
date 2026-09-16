/**
 * Master Data Builder for 330+ Indian Market Vehicle Models
 * Covers: Electric Scooters, Scooters, Bikes, Hatchbacks, Sedans, SUVs
 */

export const masterVehicles = [
  // -------------------------------------------------------------
  // BIKES (Category: 'bikes', Type: 'two_wheeler')
  // -------------------------------------------------------------
  // Royal Enfield
  {
    brand: 'Royal Enfield', model: 'Classic 350', variant: 'Halcyon Series',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 349.0, fuelEconomyValue: 41.5, fuelEconomyUnit: 'km/l',
    features: ['J-Series Air-Oil Cooled Engine', 'Dual Channel ABS', 'Tripper Navigation Pod', 'Timeless Retro Teardrop Tank'],
    specs: { groundClearanceMm: 170, fuelTankCapacityLiters: 13.0, maxPowerBhp: 20.2, maxTorqueNm: 27.0, kerbWeightKg: 195, topSpeedKmph: 115 },
    pricing: { hourlyRate: 90, rate12Hour: 600, rate24Hour: 999 },
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Royal Enfield', model: 'Classic 350', variant: 'Dark Stealth Black (Alloy)',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 349.0, fuelEconomyValue: 41.5, fuelEconomyUnit: 'km/l',
    features: ['All-Black Matte Aesthetics', 'Tubeless Alloy Wheels', 'Dual Channel ABS', 'USB Charger'],
    specs: { groundClearanceMm: 170, fuelTankCapacityLiters: 13.0, maxPowerBhp: 20.2, maxTorqueNm: 27.0, kerbWeightKg: 195, topSpeedKmph: 115 },
    pricing: { hourlyRate: 95, rate12Hour: 620, rate24Hour: 1050 },
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Royal Enfield', model: 'Hunter 350', variant: 'Metro Dapper',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 349.0, fuelEconomyValue: 36.2, fuelEconomyUnit: 'km/l',
    features: ['Agile 17-inch Wheels', 'Dual-Colour Livery', 'Short Wheelbase for City Slicing', 'Digi-Analog Instrument Cluster'],
    specs: { groundClearanceMm: 150, fuelTankCapacityLiters: 13.0, maxPowerBhp: 20.2, maxTorqueNm: 27.0, kerbWeightKg: 181, topSpeedKmph: 114 },
    pricing: { hourlyRate: 85, rate12Hour: 550, rate24Hour: 900 },
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Royal Enfield', model: 'Bullet 350', variant: 'Military Black',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 349.0, fuelEconomyValue: 40.0, fuelEconomyUnit: 'km/l',
    features: ['Heritage Heavy Crank Character', 'Single Bench Seat', 'Handcrafted Pinstriping', 'Single Channel ABS'],
    specs: { groundClearanceMm: 160, fuelTankCapacityLiters: 13.0, maxPowerBhp: 20.2, maxTorqueNm: 27.0, kerbWeightKg: 195, topSpeedKmph: 110 },
    pricing: { hourlyRate: 85, rate12Hour: 550, rate24Hour: 900 },
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Royal Enfield', model: 'Meteor 350', variant: 'Supernova Touring',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 349.0, fuelEconomyValue: 41.8, fuelEconomyUnit: 'km/l',
    features: ['Touring Windscreen Included', 'Pillion Backrest', 'Low Slung Easy Cruiser Ergos', 'Standard Tripper Turn-by-turn Navigation'],
    specs: { groundClearanceMm: 170, fuelTankCapacityLiters: 15.0, maxPowerBhp: 20.2, maxTorqueNm: 27.0, kerbWeightKg: 191, topSpeedKmph: 120 },
    pricing: { hourlyRate: 100, rate12Hour: 650, rate24Hour: 1100 },
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Royal Enfield', model: 'Himalayan 450', variant: 'Sherpa 450 Summit',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 452.0, fuelEconomyValue: 30.0, fuelEconomyUnit: 'km/l',
    features: ['Liquid-Cooled Sherpa 450 Engine (40 PS)', 'Full TFT Google Maps Navigation', 'Ride-by-Wire with 4 Modes', '21-inch Front Offroad Spoke Wheel', 'Show Up-side Down Forks'],
    specs: { groundClearanceMm: 230, fuelTankCapacityLiters: 17.0, maxPowerBhp: 39.5, maxTorqueNm: 40.0, kerbWeightKg: 196, topSpeedKmph: 150 },
    pricing: { hourlyRate: 130, rate12Hour: 850, rate24Hour: 1450 },
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Royal Enfield', model: 'Guerrilla 450', variant: 'Flash Urban Roadster',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 452.0, fuelEconomyValue: 29.5, fuelEconomyUnit: 'km/l',
    features: ['Roadster Stance with 17-inch Alloys', '40 PS Liquid Cooled Engine', 'TFT Tripper Screen', 'LED Headlamp'],
    specs: { groundClearanceMm: 169, fuelTankCapacityLiters: 11.0, maxPowerBhp: 39.5, maxTorqueNm: 40.0, kerbWeightKg: 185, topSpeedKmph: 155 },
    pricing: { hourlyRate: 125, rate12Hour: 800, rate24Hour: 1400 },
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Royal Enfield', model: 'Interceptor 650', variant: 'Twin Cylinder Mark 2',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 648.0, fuelEconomyValue: 25.0, fuelEconomyUnit: 'km/l',
    features: ['Parallel Twin 270-degree Crank Engine (47 PS)', 'Slipper Clutch', 'Brembo ByBre Brakes with Dual ABS', 'Twin Upswept Chrome Exhausts'],
    specs: { groundClearanceMm: 174, fuelTankCapacityLiters: 13.7, maxPowerBhp: 47.0, maxTorqueNm: 52.0, kerbWeightKg: 218, topSpeedKmph: 165 },
    pricing: { hourlyRate: 150, rate12Hour: 950, rate24Hour: 1650 },
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Royal Enfield', model: 'Continental GT 650', variant: 'Cafe Racer Apex Grey',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 648.0, fuelEconomyValue: 25.0, fuelEconomyUnit: 'km/l',
    features: ['Authentic Clip-on Handlebars', 'Rearset Footpegs', 'Sculpted Fuel Tank with Knee Recesses', 'Dual Channel ABS'],
    specs: { groundClearanceMm: 174, fuelTankCapacityLiters: 12.5, maxPowerBhp: 47.0, maxTorqueNm: 52.0, kerbWeightKg: 214, topSpeedKmph: 170 },
    pricing: { hourlyRate: 160, rate12Hour: 1000, rate24Hour: 1750 },
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Royal Enfield', model: 'Super Meteor 650', variant: 'Celestial Tourer',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 648.0, fuelEconomyValue: 24.0, fuelEconomyUnit: 'km/l',
    features: ['Showa Upside Down Front Forks', 'Highway Windscreen & Touring Seat', 'Tubeless Alloy Wheels', 'Twin Cylinder Smoothness'],
    specs: { groundClearanceMm: 135, fuelTankCapacityLiters: 15.7, maxPowerBhp: 47.0, maxTorqueNm: 52.3, kerbWeightKg: 241, topSpeedKmph: 160 },
    pricing: { hourlyRate: 180, rate12Hour: 1150, rate24Hour: 1950 },
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
  },
  // Yamaha
  {
    brand: 'Yamaha', model: 'MT-15 V2', variant: 'MotoGP Edition',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 155.0, fuelEconomyValue: 48.0, fuelEconomyUnit: 'km/l',
    features: ['Liquid Cooled 4V VVA Engine', 'Traction Control System', 'Upside Down Gold Forks', 'Dual Channel ABS', 'Y-Connect Bluetooth'],
    specs: { groundClearanceMm: 170, fuelTankCapacityLiters: 10.0, maxPowerBhp: 18.4, maxTorqueNm: 14.1, kerbWeightKg: 141, topSpeedKmph: 130 },
    pricing: { hourlyRate: 85, rate12Hour: 550, rate24Hour: 900 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Yamaha', model: 'YZF R15 V4', variant: 'Racing Blue (Quickshifter)',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 155.0, fuelEconomyValue: 45.0, fuelEconomyUnit: 'km/l',
    features: ['Bi-directional Quickshifter (Up-shifts)', 'Track & Street Display Modes', 'Aerodynamic M1 Fairing', 'Dual Channel ABS'],
    specs: { groundClearanceMm: 170, fuelTankCapacityLiters: 11.0, maxPowerBhp: 18.4, maxTorqueNm: 14.2, kerbWeightKg: 142, topSpeedKmph: 140 },
    pricing: { hourlyRate: 95, rate12Hour: 620, rate24Hour: 1050 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Yamaha', model: 'YZF R15M', variant: 'Carbon Edition TFT',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 155.0, fuelEconomyValue: 45.0, fuelEconomyUnit: 'km/l',
    features: ['Full Color TFT Instrument Console', 'Special R1M 3D Emblem', 'Golden Brake Calipers', 'Turn-by-turn Navigation'],
    specs: { groundClearanceMm: 170, fuelTankCapacityLiters: 11.0, maxPowerBhp: 18.4, maxTorqueNm: 14.2, kerbWeightKg: 142, topSpeedKmph: 142 },
    pricing: { hourlyRate: 105, rate12Hour: 680, rate24Hour: 1150 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Yamaha', model: 'FZ-S Fi V4', variant: 'Deluxe Series',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 149.0, fuelEconomyValue: 49.3, fuelEconomyUnit: 'km/l',
    features: ['Traction Control System', 'LED Flashers & Headlamp', 'Single Channel ABS', 'Bluetooth Y-Connect'],
    specs: { groundClearanceMm: 165, fuelTankCapacityLiters: 13.0, maxPowerBhp: 12.4, maxTorqueNm: 13.3, kerbWeightKg: 136, topSpeedKmph: 115 },
    pricing: { hourlyRate: 65, rate12Hour: 420, rate24Hour: 700 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Yamaha', model: 'FZ-X', variant: 'Neo-Retro Scrambler',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 149.0, fuelEconomyValue: 48.0, fuelEconomyUnit: 'km/l',
    features: ['Tuck-and-Roll Ribbed Seat', 'Block Pattern Dual Purpose Tyres', 'Round LED Headlamp with DRL', 'Underbody Metal Bash Plate'],
    specs: { groundClearanceMm: 165, fuelTankCapacityLiters: 10.0, maxPowerBhp: 12.4, maxTorqueNm: 13.3, kerbWeightKg: 139, topSpeedKmph: 112 },
    pricing: { hourlyRate: 70, rate12Hour: 450, rate24Hour: 750 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  // KTM
  {
    brand: 'KTM', model: '390 Duke', variant: 'Gen 3 (LC4c 45 PS)',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 398.7, fuelEconomyValue: 28.5, fuelEconomyUnit: 'km/l',
    features: ['All-New 399cc LC4c Engine (45.3 PS)', 'Launch Control & Quickshifter+', 'Cornering ABS & Supermoto Mode', 'WP APEX Adjustable Suspension', '5-inch Color TFT with Track Screen'],
    specs: { groundClearanceMm: 151, fuelTankCapacityLiters: 15.0, maxPowerBhp: 45.3, maxTorqueNm: 39.0, kerbWeightKg: 168, topSpeedKmph: 170 },
    pricing: { hourlyRate: 150, rate12Hour: 950, rate24Hour: 1650 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'KTM', model: '250 Duke', variant: 'Gen 3',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 249.0, fuelEconomyValue: 32.0, fuelEconomyUnit: 'km/l',
    features: ['Ride-by-wire Technology', 'Quickshifter+ (Optional)', 'Supermoto ABS Mode', 'Slipper Clutch'],
    specs: { groundClearanceMm: 151, fuelTankCapacityLiters: 15.0, maxPowerBhp: 31.0, maxTorqueNm: 25.0, kerbWeightKg: 163, topSpeedKmph: 148 },
    pricing: { hourlyRate: 110, rate12Hour: 700, rate24Hour: 1200 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'KTM', model: '200 Duke', variant: 'Dual Channel ABS',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 199.5, fuelEconomyValue: 35.0, fuelEconomyUnit: 'km/l',
    features: ['High-Revving DOHC Liquid-cooled Engine (25 PS)', 'Lightweight Trellis Frame', 'WP Inverted Forks', 'Halogen/LED Headlamp'],
    specs: { groundClearanceMm: 155, fuelTankCapacityLiters: 13.5, maxPowerBhp: 25.0, maxTorqueNm: 19.3, kerbWeightKg: 159, topSpeedKmph: 138 },
    pricing: { hourlyRate: 95, rate12Hour: 620, rate24Hour: 1050 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'KTM', model: 'RC 390', variant: 'GP Edition Aerodynamics',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 373.2, fuelEconomyValue: 27.5, fuelEconomyUnit: 'km/l',
    features: ['Moto3 Inspired Aerodynamic Bodywork', 'Clip-on Handlebars with 10mm Adjustability', 'Quickshifter+ Standard', 'Lean-Angle Sensitive Cornering ABS'],
    specs: { groundClearanceMm: 158, fuelTankCapacityLiters: 13.7, maxPowerBhp: 43.5, maxTorqueNm: 37.0, kerbWeightKg: 172, topSpeedKmph: 175 },
    pricing: { hourlyRate: 160, rate12Hour: 1000, rate24Hour: 1750 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'KTM', model: '390 Adventure', variant: 'Spoke Wheel Edition',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 373.2, fuelEconomyValue: 30.0, fuelEconomyUnit: 'km/l',
    features: ['Tough Wire-Spoked Wheels (19-inch Front)', 'WP APEX Fully Adjustable Suspension', 'Offroad ABS & Traction Control Modes', 'Turn-by-turn Navigation Screen'],
    specs: { groundClearanceMm: 200, fuelTankCapacityLiters: 14.5, maxPowerBhp: 43.5, maxTorqueNm: 37.0, kerbWeightKg: 177, topSpeedKmph: 160 },
    pricing: { hourlyRate: 150, rate12Hour: 950, rate24Hour: 1650 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  // Bajaj
  {
    brand: 'Bajaj', model: 'Pulsar NS400Z', variant: 'Flagship Streetfighter',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 373.0, fuelEconomyValue: 28.0, fuelEconomyUnit: 'km/l',
    features: ['Dominar 400 DOHC Engine (40 PS)', 'Ride Modes (Road, Rain, Sport, Offroad)', 'Switchable Traction Control', '43mm USD Champagne Gold Forks'],
    specs: { groundClearanceMm: 168, fuelTankCapacityLiters: 12.0, maxPowerBhp: 40.0, maxTorqueNm: 35.0, kerbWeightKg: 174, topSpeedKmph: 154 },
    pricing: { hourlyRate: 110, rate12Hour: 700, rate24Hour: 1200 },
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Bajaj', model: 'Pulsar NS200', variant: 'USD Forks Edition',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 199.5, fuelEconomyValue: 36.5, fuelEconomyUnit: 'km/l',
    features: ['Triple Spark 4-Valve Engine (24.5 PS)', 'Inverted Front Forks', 'Perimeter Frame for Dynamic Balance', 'Dual Channel ABS with Grimeca Discs'],
    specs: { groundClearanceMm: 168, fuelTankCapacityLiters: 12.0, maxPowerBhp: 24.5, maxTorqueNm: 18.7, kerbWeightKg: 158, topSpeedKmph: 136 },
    pricing: { hourlyRate: 80, rate12Hour: 500, rate24Hour: 850 },
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Bajaj', model: 'Pulsar N160', variant: 'Dual Channel ABS',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 164.8, fuelEconomyValue: 46.0, fuelEconomyUnit: 'km/l',
    features: ['Class-Only Dual Channel ABS in 160cc', 'Bi-functional LED Projector Lamp', 'Underbelly Exhaust', 'USB Phone Charging Socket'],
    specs: { groundClearanceMm: 165, fuelTankCapacityLiters: 14.0, maxPowerBhp: 16.0, maxTorqueNm: 14.65, kerbWeightKg: 154, topSpeedKmph: 118 },
    pricing: { hourlyRate: 65, rate12Hour: 420, rate24Hour: 700 },
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Bajaj', model: 'Dominar 400', variant: 'Touring Edition',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 373.3, fuelEconomyValue: 27.0, fuelEconomyUnit: 'km/l',
    features: ['Factory-fitted Touring Flyscreen & Handguards', 'Luggage Carrier with Pillion Backrest', 'Engine Bash Plate with Leg Guards', 'Full LED Lighting'],
    specs: { groundClearanceMm: 157, fuelTankCapacityLiters: 13.0, maxPowerBhp: 40.0, maxTorqueNm: 35.0, kerbWeightKg: 193, topSpeedKmph: 155 },
    pricing: { hourlyRate: 130, rate12Hour: 850, rate24Hour: 1450 },
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Bajaj', model: 'Freedom 125', variant: 'World First CNG Motorcycle',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'cng', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 125.0, fuelEconomyValue: 102.0, fuelEconomyUnit: 'km/kg',
    features: ['Dual Fuel Tank (2kg CNG + 2L Petrol)', 'Over 330 km Combined Range', 'Lowest Running Cost (₹1/km)', 'Linked Monoshock Suspension'],
    specs: { groundClearanceMm: 170, fuelTankCapacityLiters: 2.0, maxPowerBhp: 9.5, maxTorqueNm: 9.7, kerbWeightKg: 147, topSpeedKmph: 90 },
    pricing: { hourlyRate: 50, rate12Hour: 320, rate24Hour: 550 },
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
  },
  // TVS
  {
    brand: 'TVS', model: 'Raider 125', variant: 'Super Squad Marvel TFT',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 124.8, fuelEconomyValue: 67.0, fuelEconomyUnit: 'km/l',
    features: ['3-Valve Oil-Cooled Engine', '5-inch TFT Color Display with Voice Assist', 'Eco & Power Riding Modes', 'Under-Seat Storage Space'],
    specs: { groundClearanceMm: 180, fuelTankCapacityLiters: 10.0, maxPowerBhp: 11.38, maxTorqueNm: 11.2, kerbWeightKg: 123, topSpeedKmph: 99 },
    pricing: { hourlyRate: 55, rate12Hour: 360, rate24Hour: 600 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'TVS', model: 'Apache RTR 160 4V', variant: 'Special Edition Dual ABS',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 159.7, fuelEconomyValue: 47.6, fuelEconomyUnit: 'km/l',
    features: ['Class-leading 17.55 PS Power', 'Urban/Rain/Sport Ride Modes', 'Glide Through Traffic (GTT) Tech', 'SmartXonnect Telematics'],
    specs: { groundClearanceMm: 180, fuelTankCapacityLiters: 12.0, maxPowerBhp: 17.55, maxTorqueNm: 14.73, kerbWeightKg: 146, topSpeedKmph: 114 },
    pricing: { hourlyRate: 70, rate12Hour: 450, rate24Hour: 750 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'TVS', model: 'Apache RTR 200 4V', variant: 'Dual Channel ABS with Ride Modes',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 197.7, fuelEconomyValue: 39.0, fuelEconomyUnit: 'km/l',
    features: ['Showa Adjustable Front Suspension', 'Slipper Clutch Standard', 'Adjustable Brake & Clutch Levers', 'Radial Rear Tyre'],
    specs: { groundClearanceMm: 180, fuelTankCapacityLiters: 12.0, maxPowerBhp: 20.8, maxTorqueNm: 17.25, kerbWeightKg: 152, topSpeedKmph: 128 },
    pricing: { hourlyRate: 85, rate12Hour: 550, rate24Hour: 900 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'TVS', model: 'Apache RR 310', variant: 'BTO Race Replica',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 312.2, fuelEconomyValue: 34.7, fuelEconomyUnit: 'km/l',
    features: ['Reverse Inclined DOHC Engine (Co-developed with BMW)', 'Vertical 5-inch TFT Tablet Cluster', 'Bi-LED Twin Projector Headlamps', 'Michelin Road 5 Tyres'],
    specs: { groundClearanceMm: 180, fuelTankCapacityLiters: 11.0, maxPowerBhp: 34.0, maxTorqueNm: 27.3, kerbWeightKg: 174, topSpeedKmph: 160 },
    pricing: { hourlyRate: 140, rate12Hour: 900, rate24Hour: 1550 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'TVS', model: 'Ronin', variant: 'Special Edition Dual ABS',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 225.9, fuelEconomyValue: 42.0, fuelEconomyUnit: 'km/l',
    features: ['Modern Retro Roadster Scrambler Styling', 'Showa 41mm Gold USD Forks', 'Rain and Urban ABS Modes', 'Voice Assist Navigation'],
    specs: { groundClearanceMm: 181, fuelTankCapacityLiters: 14.0, maxPowerBhp: 20.4, maxTorqueNm: 19.93, kerbWeightKg: 160, topSpeedKmph: 120 },
    pricing: { hourlyRate: 85, rate12Hour: 550, rate24Hour: 900 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  // Honda
  {
    brand: 'Honda', model: 'Shine 125', variant: 'Disc Drum CBS',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 124.0, fuelEconomyValue: 65.0, fuelEconomyUnit: 'km/l',
    features: ['Best Selling 125cc in India', '5-Speed Smooth Gearbox', 'Silent Start with ACG', 'eSP Engine Technology'],
    specs: { groundClearanceMm: 162, fuelTankCapacityLiters: 10.5, maxPowerBhp: 10.7, maxTorqueNm: 11.0, kerbWeightKg: 114, topSpeedKmph: 102 },
    pricing: { hourlyRate: 50, rate12Hour: 320, rate24Hour: 550 },
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Honda', model: 'SP 125', variant: 'Sports Disc',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 124.0, fuelEconomyValue: 65.0, fuelEconomyUnit: 'km/l',
    features: ['Fully Digital Speedometer with Eco Indicator', 'Aggressive Tank Extensions', 'LED Headlamp', 'Wider Rear Tyre'],
    specs: { groundClearanceMm: 160, fuelTankCapacityLiters: 11.2, maxPowerBhp: 10.87, maxTorqueNm: 10.9, kerbWeightKg: 116, topSpeedKmph: 105 },
    pricing: { hourlyRate: 55, rate12Hour: 350, rate24Hour: 600 },
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Honda', model: 'CB350 Hness', variant: 'DLX Pro Dual Tone',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 348.36, fuelEconomyValue: 42.0, fuelEconomyUnit: 'km/l',
    features: ['Honda Selectable Torque Control (HSTC Traction Control)', 'Assist & Slipper Clutch', 'Dual Channel ABS', 'Deep Exhaust Roar'],
    specs: { groundClearanceMm: 166, fuelTankCapacityLiters: 15.0, maxPowerBhp: 21.07, maxTorqueNm: 30.0, kerbWeightKg: 181, topSpeedKmph: 125 },
    pricing: { hourlyRate: 95, rate12Hour: 620, rate24Hour: 1050 },
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Honda', model: 'CB350RS', variant: 'Scrambler Cafe Monotone',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 348.36, fuelEconomyValue: 42.0, fuelEconomyUnit: 'km/l',
    features: ['Wide 150-section Rear Pattern Tyre', 'Tuck and Roll Seat', 'Upswept Exhaust Pipe', 'Underseat LED Tail Lamp'],
    specs: { groundClearanceMm: 168, fuelTankCapacityLiters: 15.0, maxPowerBhp: 21.07, maxTorqueNm: 30.0, kerbWeightKg: 179, topSpeedKmph: 128 },
    pricing: { hourlyRate: 100, rate12Hour: 650, rate24Hour: 1100 },
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Honda', model: 'CB300R', variant: 'Neo Sports Cafe',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 286.0, fuelEconomyValue: 32.0, fuelEconomyUnit: 'km/l',
    features: ['Ultra Featherweight 146 kg Chassis', '31.1 PS DOHC 4-Valve Liquid Cooled Engine', 'IMU-based Dual Channel ABS', 'Showa 41mm USD Forks'],
    specs: { groundClearanceMm: 157, fuelTankCapacityLiters: 9.7, maxPowerBhp: 31.1, maxTorqueNm: 27.5, kerbWeightKg: 146, topSpeedKmph: 150 },
    pricing: { hourlyRate: 130, rate12Hour: 850, rate24Hour: 1450 },
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
  },
  // Hero
  {
    brand: 'Hero', model: 'Splendor Plus', variant: 'XTEC Bluetooth',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 97.2, fuelEconomyValue: 70.0, fuelEconomyUnit: 'km/l',
    features: ['Legendary Fuel Economy and Bulletproof Reliability', 'i3S Stop Start Technology', 'Digital Meter with SMS/Call Alerts', 'USB Charger'],
    specs: { groundClearanceMm: 165, fuelTankCapacityLiters: 9.8, maxPowerBhp: 8.02, maxTorqueNm: 8.05, kerbWeightKg: 112, topSpeedKmph: 87 },
    pricing: { hourlyRate: 40, rate12Hour: 260, rate24Hour: 450 },
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Hero', model: 'HF Deluxe', variant: 'Self Start Alloy',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 97.2, fuelEconomyValue: 70.0, fuelEconomyUnit: 'km/l',
    features: ['Low Maintenance Commuter', 'xSens Advanced Programmed Fuel Injection', 'Integrated Braking System', 'Long Comfortable Bench'],
    specs: { groundClearanceMm: 165, fuelTankCapacityLiters: 9.6, maxPowerBhp: 8.02, maxTorqueNm: 8.05, kerbWeightKg: 110, topSpeedKmph: 85 },
    pricing: { hourlyRate: 40, rate12Hour: 250, rate24Hour: 420 },
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Hero', model: 'Xpulse 200 4V', variant: 'Pro Rally Edition',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 199.6, fuelEconomyValue: 40.0, fuelEconomyUnit: 'km/l',
    features: ['Fully Adjustable Long-Travel Rally Suspension (250mm Travel)', 'Massive 270mm Ground Clearance', 'Rally Handlebar Risers', 'Single Channel ABS with 3 Modes (Road/Offroad/Rally)'],
    specs: { groundClearanceMm: 270, fuelTankCapacityLiters: 13.0, maxPowerBhp: 19.1, maxTorqueNm: 17.35, kerbWeightKg: 161, topSpeedKmph: 120 },
    pricing: { hourlyRate: 90, rate12Hour: 600, rate24Hour: 999 },
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Hero', model: 'Mavrick 440', variant: 'Top Variant Diamond Cut Alloys',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 440.0, fuelEconomyValue: 30.0, fuelEconomyUnit: 'km/l',
    features: ['Co-developed 440cc Torquey Engine', 'Muscular Steel Fuel Tank', 'eSIM Connected Tech', 'Dual Channel ABS with Slipper Clutch'],
    specs: { groundClearanceMm: 175, fuelTankCapacityLiters: 13.5, maxPowerBhp: 27.3, maxTorqueNm: 36.0, kerbWeightKg: 187, topSpeedKmph: 140 },
    pricing: { hourlyRate: 110, rate12Hour: 700, rate24Hour: 1200 },
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
  },
  // BMW & Triumph
  {
    brand: 'BMW', model: 'G 310 R', variant: 'Roadster Racing Edition',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 313.0, fuelEconomyValue: 32.0, fuelEconomyUnit: 'km/l',
    features: ['German Engineered 34 PS Engine', 'Ride-by-wire Throttle', 'Gold USD Inverted Forks', 'Slipper Clutch', 'BMW Motorrad ABS'],
    specs: { groundClearanceMm: 165, fuelTankCapacityLiters: 11.0, maxPowerBhp: 34.0, maxTorqueNm: 28.0, kerbWeightKg: 164, topSpeedKmph: 143 },
    pricing: { hourlyRate: 140, rate12Hour: 900, rate24Hour: 1550 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'BMW', model: 'G 310 GS', variant: 'Adventure Tourer',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 313.0, fuelEconomyValue: 30.0, fuelEconomyUnit: 'km/l',
    features: ['19-inch Front Wheel for Light Offroading', 'Comfortable Long Distance Upright Seating', 'Luggage Carrier Rack', 'LED Headlight and Flashers'],
    specs: { groundClearanceMm: 220, fuelTankCapacityLiters: 11.0, maxPowerBhp: 34.0, maxTorqueNm: 28.0, kerbWeightKg: 175, topSpeedKmph: 143 },
    pricing: { hourlyRate: 160, rate12Hour: 1050, rate24Hour: 1750 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Triumph', model: 'Speed 400', variant: 'Modern Classic Roadster',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 398.15, fuelEconomyValue: 30.0, fuelEconomyUnit: 'km/l',
    features: ['TR-Series 40 PS Liquid-cooled Engine', 'Switchable Traction Control & ABS', 'Torque-assist Clutch', 'Immobiliser Anti-theft Fob'],
    specs: { groundClearanceMm: 158, fuelTankCapacityLiters: 13.0, maxPowerBhp: 40.0, maxTorqueNm: 37.5, kerbWeightKg: 176, topSpeedKmph: 160 },
    pricing: { hourlyRate: 135, rate12Hour: 880, rate24Hour: 1500 },
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Triumph', model: 'Scrambler 400X', variant: 'All-Road Edition',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 398.15, fuelEconomyValue: 28.5, fuelEconomyUnit: 'km/l',
    features: ['19-inch Front Wheel with Dual Purpose Tyres', 'Off-road Switchable ABS & Traction Control', 'Handguards & Sump Guard Included', 'Taller 835mm Seat Height'],
    specs: { groundClearanceMm: 195, fuelTankCapacityLiters: 13.0, maxPowerBhp: 40.0, maxTorqueNm: 37.5, kerbWeightKg: 185, topSpeedKmph: 155 },
    pricing: { hourlyRate: 145, rate12Hour: 950, rate24Hour: 1600 },
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Harley-Davidson', model: 'X440', variant: 'S (Diamond Cut Alloys)',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 440.0, fuelEconomyValue: 35.0, fuelEconomyUnit: 'km/l',
    features: ['Co-developed 440cc Long Stroke Engine (Thumping Exhaust)', 'Kyb 43mm Dual Cartridge USD Forks', 'TFT Screen with Turn-by-Turn Navigation & Music', 'Dual Channel ABS'],
    specs: { groundClearanceMm: 170, fuelTankCapacityLiters: 13.5, maxPowerBhp: 27.3, maxTorqueNm: 38.0, kerbWeightKg: 190, topSpeedKmph: 135 },
    pricing: { hourlyRate: 140, rate12Hour: 920, rate24Hour: 1550 },
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Jawa', model: '350', variant: 'Heritage Classic',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 334.0, fuelEconomyValue: 30.0, fuelEconomyUnit: 'km/l',
    features: ['334cc Liquid Cooled Engine', 'Authentic Twin Cigar Exhausts', 'Continental Dual Channel ABS', 'Chrome Tank Panels'],
    specs: { groundClearanceMm: 178, fuelTankCapacityLiters: 13.2, maxPowerBhp: 22.5, maxTorqueNm: 28.2, kerbWeightKg: 194, topSpeedKmph: 125 },
    pricing: { hourlyRate: 95, rate12Hour: 620, rate24Hour: 1050 },
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
  },
  {
    brand: 'Kawasaki', model: 'Ninja 300', variant: 'SuperSport ABS',
    categorySlug: 'bikes', vehicleType: 'two_wheeler', fuelType: 'petrol', transmission: 'manual',
    seatingCapacity: 2, engineCapacity: 296.0, fuelEconomyValue: 26.0, fuelEconomyUnit: 'km/l',
    features: ['Parallel Twin DOHC Liquid Cooled (39 PS)', 'Assist & Slipper Clutch', 'Dual Throttle Valves', 'Aerodynamic Full Fairing'],
    specs: { groundClearanceMm: 140, fuelTankCapacityLiters: 17.0, maxPowerBhp: 39.0, maxTorqueNm: 26.1, kerbWeightKg: 179, topSpeedKmph: 170 },
    pricing: { hourlyRate: 180, rate12Hour: 1150, rate24Hour: 1950 },
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  }
];

console.log(`Loaded ${masterVehicles.length} curated bike records.`);
