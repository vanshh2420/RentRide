import { FuelPriceService } from './fuelPrice.service.js';

export class FuelCostService {
  /**
   * Extensible calculation abstraction for fuel & energy cost estimation
   * Distance ÷ Vehicle Fuel Economy = Estimated Consumption
   * Estimated Consumption × Current City Fuel/Energy Price = Estimated Fuel/Energy Cost
   */
  static async calculateEstimatedFuelCost({
    distanceKm = 0,
    fuelType = 'petrol',
    fuelEconomy = null,
    fuelEconomyUnit = 'km/l',
    city = 'Indore'
  }) {
    const validDistance = Math.max(0, Number(distanceKm) || 0);
    const validEconomy = Number(fuelEconomy);

    if (!validEconomy || validEconomy <= 0) {
      return {
        isAvailable: false,
        reason: 'Vehicle fuel economy / certified mileage not specified',
        distanceKm: validDistance,
        estimatedCost: null,
        isEstimate: true
      };
    }

    const normalizedFuel = (fuelType || 'petrol').toLowerCase();
    const cityPrice = await FuelPriceService.getFuelPrice(city, normalizedFuel);

    let estimatedConsumption = 0;
    let consumptionUnit = cityPrice.unit || 'L';

    if (normalizedFuel === 'electric') {
      if (fuelEconomyUnit === 'km/kWh') {
        estimatedConsumption = validDistance / validEconomy;
        consumptionUnit = 'kWh';
      } else {
        // km/charge fallback: convert typical 2.5kWh two-wheeler / 30kWh four-wheeler battery
        const avgKwhPerCharge = validEconomy > 100 ? 30 : 2.5;
        const kwhPerKm = avgKwhPerCharge / validEconomy;
        estimatedConsumption = validDistance * kwhPerKm;
        consumptionUnit = 'kWh';
      }
    } else if (normalizedFuel === 'cng') {
      estimatedConsumption = validDistance / validEconomy;
      consumptionUnit = 'kg';
    } else {
      // Petrol, Diesel, Hybrid
      estimatedConsumption = validDistance / validEconomy;
      consumptionUnit = 'L';
    }

    const estimatedCost = Math.round(estimatedConsumption * cityPrice.price);

    return {
      isAvailable: true,
      distanceKm: Math.round(validDistance * 10) / 10,
      fuelType: normalizedFuel,
      fuelEconomy: validEconomy,
      fuelEconomyUnit,
      estimatedConsumption: Math.round(estimatedConsumption * 100) / 100,
      consumptionUnit,
      fuelPricePerUnit: cityPrice.price,
      estimatedCost,
      currency: cityPrice.currency || 'INR',
      city: cityPrice.city,
      isEstimate: true
    };
  }
}
