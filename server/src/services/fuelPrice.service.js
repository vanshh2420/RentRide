import { FuelPrice } from '../models/fuelPrice.model.js';
import { ApiError } from '../utils/ApiError.js';

// Standard baseline fuel prices for Madhya Pradesh hubs
const DEFAULT_REGIONAL_PRICES = {
  Indore: {
    petrol: { price: 108.66, unit: 'L' },
    diesel: { price: 93.92, unit: 'L' },
    cng: { price: 86.50, unit: 'kg' },
    electric: { price: 8.50, unit: 'kWh' }
  },
  Bhopal: {
    petrol: { price: 108.65, unit: 'L' },
    diesel: { price: 93.90, unit: 'L' },
    cng: { price: 86.20, unit: 'kg' },
    electric: { price: 8.50, unit: 'kWh' }
  },
  Gwalior: {
    petrol: { price: 108.58, unit: 'L' },
    diesel: { price: 93.84, unit: 'L' },
    cng: { price: 85.90, unit: 'kg' },
    electric: { price: 8.20, unit: 'kWh' }
  },
  Bangalore: {
    petrol: { price: 102.86, unit: 'L' },
    diesel: { price: 88.94, unit: 'L' },
    cng: { price: 82.50, unit: 'kg' },
    electric: { price: 7.80, unit: 'kWh' }
  }
};

export class FuelPriceService {
  /**
   * Fetch active price for a specific city and fuel type
   * Falls back gracefully to regional default if not yet stored or stale
   */
  static async getFuelPrice(city = 'Indore', fuelType = 'petrol') {
    const normalizedCity = (city || 'Indore').trim();
    const normalizedFuel = (fuelType || 'petrol').toLowerCase();

    // Map hybrid to petrol pricing
    const lookupType = normalizedFuel === 'hybrid' ? 'petrol' : normalizedFuel;

    try {
      const record = await FuelPrice.findOne({
        city: new RegExp(`^${normalizedCity}$`, 'i'),
        fuelType: lookupType,
        isActive: true
      });

      if (record) {
        return {
          city: record.city,
          state: record.state,
          fuelType: record.fuelType,
          price: record.price,
          unit: record.unit,
          currency: record.currency,
          lastUpdated: record.lastUpdated,
          source: record.source,
          isConfigured: true
        };
      }
    } catch (err) {
      console.warn('[FuelPriceService] DB query failed, using fallback:', err.message);
    }

    // Default regional fallback
    const cityDefaults = DEFAULT_REGIONAL_PRICES[normalizedCity] || DEFAULT_REGIONAL_PRICES['Indore'];
    const typeDefault = cityDefaults[lookupType] || cityDefaults['petrol'];

    return {
      city: normalizedCity,
      state: 'Madhya Pradesh',
      fuelType: lookupType,
      price: typeDefault.price,
      unit: typeDefault.unit,
      currency: 'INR',
      lastUpdated: new Date(),
      source: 'IOCL / State Petroleum Board (Standard Regional Benchmark)',
      isConfigured: false
    };
  }

  /**
   * Get all active fuel prices for a city
   */
  static async getAllPricesForCity(city = 'Indore') {
    const normalizedCity = (city || 'Indore').trim();

    try {
      const records = await FuelPrice.find({
        city: new RegExp(`^${normalizedCity}$`, 'i'),
        isActive: true
      });

      if (records && records.length > 0) {
        return records;
      }
    } catch (err) {
      console.warn('[FuelPriceService] Failed fetching city prices:', err.message);
    }

    // Return synthesized defaults
    const cityDefaults = DEFAULT_REGIONAL_PRICES[normalizedCity] || DEFAULT_REGIONAL_PRICES['Indore'];
    return Object.entries(cityDefaults).map(([fuelType, data]) => ({
      city: normalizedCity,
      state: 'Madhya Pradesh',
      fuelType,
      price: data.price,
      unit: data.unit,
      currency: 'INR',
      lastUpdated: new Date(),
      source: 'IOCL Benchmark Default'
    }));
  }

  /**
   * Admin: Update or configure city fuel price
   */
  static async updateFuelPrice({ city, fuelType, price, unit, source }) {
    if (!city || !fuelType || price == null) {
      throw new ApiError(400, 'City, fuelType, and price are required');
    }

    const normalizedCity = city.trim();
    const normalizedFuel = fuelType.toLowerCase();

    const record = await FuelPrice.findOneAndUpdate(
      { city: normalizedCity, fuelType: normalizedFuel },
      {
        city: normalizedCity,
        fuelType: normalizedFuel,
        price: Number(price),
        unit: unit || (normalizedFuel === 'cng' ? 'kg' : normalizedFuel === 'electric' ? 'kWh' : 'L'),
        lastUpdated: new Date(),
        source: source || 'Admin Configured',
        isActive: true
      },
      { upsert: true, new: true, runValidators: true }
    );

    return record;
  }

  /**
   * Seed initial benchmark fuel prices on startup
   */
  static async seedInitialFuelPrices() {
    try {
      const count = await FuelPrice.countDocuments();
      if (count > 0) return;

      console.log('[FuelPriceService] Seeding initial city fuel prices...');
      const seedDocs = [];

      for (const [cityName, fuels] of Object.entries(DEFAULT_REGIONAL_PRICES)) {
        for (const [fuelType, data] of Object.entries(fuels)) {
          seedDocs.push({
            city: cityName,
            state: cityName === 'Bangalore' ? 'Karnataka' : 'Madhya Pradesh',
            fuelType,
            price: data.price,
            unit: data.unit,
            currency: 'INR',
            source: 'State Petroleum Board & Discom Baseline',
            isActive: true
          });
        }
      }

      await FuelPrice.insertMany(seedDocs);
      console.log(`[FuelPriceService] Seeded ${seedDocs.length} city fuel prices successfully.`);
    } catch (err) {
      console.warn('[FuelPriceService] Seeding skipped/failed:', err.message);
    }
  }
}
