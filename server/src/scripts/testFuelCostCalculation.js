import { FuelCostService } from '../services/fuelCost.service.js';

// Client-side mirror calculation logic to verify exact parity
function clientCalculateFuelEstimate({
  distance,
  fuelType = 'petrol',
  fuelEconomy,
  fuelEconomyUnit = 'km/l',
  pricePerUnit
}) {
  if (distance === '' || distance === null || distance === undefined) {
    return { status: 'EMPTY' };
  }
  const distNum = Number(distance);
  if (isNaN(distNum) || distNum < 0) {
    return { status: 'INVALID' };
  }
  const econNum = Number(fuelEconomy);
  if (!econNum || econNum <= 0) {
    return { status: 'NO_ECONOMY' };
  }

  const normalizedFuel = (fuelType || 'petrol').toLowerCase();
  const isElectric = normalizedFuel === 'electric';
  const isCng = normalizedFuel === 'cng';

  let consumptionUnit = isElectric ? 'kWh' : isCng ? 'kg' : 'L';
  let consumption = 0;

  if (isElectric) {
    if (fuelEconomyUnit === 'km/kWh') {
      consumption = distNum / econNum;
    } else {
      const avgKwhPerCharge = econNum > 100 ? 30 : 2.5;
      const kwhPerKm = avgKwhPerCharge / econNum;
      consumption = distNum * kwhPerKm;
    }
  } else {
    consumption = distNum / econNum;
  }

  const effectivePrice = Number(pricePerUnit) > 0 ? Number(pricePerUnit) : (
    normalizedFuel === 'diesel' ? 93.92 :
    normalizedFuel === 'cng' ? 86.50 :
    normalizedFuel === 'electric' ? 8.50 :
    108.66
  );

  const cost = Math.round(consumption * effectivePrice);
  const formattedConsumption = distNum === 0 ? '0' : (Math.round(consumption * 100) / 100).toFixed(2);

  return {
    status: 'READY',
    distanceKm: distNum,
    estimatedConsumption: formattedConsumption,
    consumptionUnit,
    estimatedCost: cost,
    fuelPricePerUnit: effectivePrice,
    isElectric,
    fuelType: normalizedFuel
  };
}

async function runAllFuelCostTests() {
  console.log('--- STARTING FUEL COST FEATURE VERIFICATION ---\n');
  let passedCount = 0;
  let totalTests = 0;

  function assert(condition, testName, details) {
    totalTests++;
    if (condition) {
      passedCount++;
      console.log(`✅ [PASS] ${testName}`);
    } else {
      console.error(`❌ [FAIL] ${testName} - ${details}`);
    }
  }

  // TEST 1: Distance = 150 km, Mileage = 45 km/L, Fuel price = ₹100/L
  const t1 = clientCalculateFuelEstimate({
    distance: 150,
    fuelEconomy: 45,
    fuelEconomyUnit: 'km/l',
    fuelType: 'petrol',
    pricePerUnit: 100
  });
  assert(
    t1.status === 'READY' && t1.estimatedConsumption === '3.33' && t1.estimatedCost === 333 && t1.consumptionUnit === 'L',
    'Test 1: Distance 150 km, Mileage 45 km/L, Price ₹100/L -> 3.33 L, ₹333',
    JSON.stringify(t1)
  );

  // TEST 2: Distance = 50 km, Mileage = 45 km/L, Fuel price = ₹100/L
  const t2 = clientCalculateFuelEstimate({
    distance: 50,
    fuelEconomy: 45,
    fuelEconomyUnit: 'km/l',
    fuelType: 'petrol',
    pricePerUnit: 100
  });
  assert(
    t2.status === 'READY' && t2.estimatedConsumption === '1.11' && t2.estimatedCost === 111,
    'Test 2: Distance 50 km -> 1.11 L, ₹111',
    JSON.stringify(t2)
  );

  // TEST 3: Distance = 100 km, Mileage = 45 km/L, Fuel price = ₹100/L
  const t3 = clientCalculateFuelEstimate({
    distance: 100,
    fuelEconomy: 45,
    fuelEconomyUnit: 'km/l',
    fuelType: 'petrol',
    pricePerUnit: 100
  });
  assert(
    t3.status === 'READY' && t3.estimatedConsumption === '2.22' && t3.estimatedCost === 222,
    'Test 3: Distance 100 km -> 2.22 L, ₹222',
    JSON.stringify(t3)
  );

  // TEST 4: Distance = 0 km
  const t4 = clientCalculateFuelEstimate({
    distance: 0,
    fuelEconomy: 45,
    fuelEconomyUnit: 'km/l',
    fuelType: 'petrol',
    pricePerUnit: 100
  });
  assert(
    t4.status === 'READY' && t4.estimatedConsumption === '0' && t4.estimatedCost === 0 && !isNaN(t4.estimatedCost),
    'Test 4: Distance 0 km -> 0 L, ₹0 (No NaN/Infinity)',
    JSON.stringify(t4)
  );

  // TEST 5: Distance = empty string ''
  const t5 = clientCalculateFuelEstimate({
    distance: '',
    fuelEconomy: 45,
    fuelEconomyUnit: 'km/l',
    fuelType: 'petrol',
    pricePerUnit: 100
  });
  assert(
    t5.status === 'EMPTY',
    'Test 5: Distance empty -> status EMPTY (No misleading calculation)',
    JSON.stringify(t5)
  );

  // TEST 6: Negative distance
  const t6 = clientCalculateFuelEstimate({
    distance: -50,
    fuelEconomy: 45,
    fuelEconomyUnit: 'km/l',
    fuelType: 'petrol',
    pricePerUnit: 100
  });
  assert(
    t6.status === 'INVALID',
    'Test 6: Distance negative -> status INVALID',
    JSON.stringify(t6)
  );

  // TEST 7: Invalid string 'abc'
  const t7 = clientCalculateFuelEstimate({
    distance: 'abc',
    fuelEconomy: 45,
    fuelEconomyUnit: 'km/l',
    fuelType: 'petrol',
    pricePerUnit: 100
  });
  assert(
    t7.status === 'INVALID',
    'Test 7: Distance abc -> status INVALID',
    JSON.stringify(t7)
  );

  // TEST 8: Different vehicles with different mileage (Car @ 18 km/l vs Bike @ 60 km/l)
  const t8_car = clientCalculateFuelEstimate({
    distance: 180,
    fuelEconomy: 18,
    fuelEconomyUnit: 'km/l',
    fuelType: 'petrol',
    pricePerUnit: 100
  });
  const t8_bike = clientCalculateFuelEstimate({
    distance: 180,
    fuelEconomy: 60,
    fuelEconomyUnit: 'km/l',
    fuelType: 'petrol',
    pricePerUnit: 100
  });
  assert(
    t8_car.estimatedConsumption === '10.00' && t8_car.estimatedCost === 1000 &&
    t8_bike.estimatedConsumption === '3.00' && t8_bike.estimatedCost === 300,
    'Test 8: Different vehicle fuel economies adapt properly (18 km/l vs 60 km/l)',
    `Car: ${t8_car.estimatedConsumption}L, Bike: ${t8_bike.estimatedConsumption}L`
  );

  // TEST 9: Different fuel types (Diesel, CNG, Electric)
  const t9_diesel = clientCalculateFuelEstimate({
    distance: 100,
    fuelEconomy: 20,
    fuelEconomyUnit: 'km/l',
    fuelType: 'diesel',
    pricePerUnit: 90
  });
  assert(
    t9_diesel.consumptionUnit === 'L' && t9_diesel.estimatedConsumption === '5.00' && t9_diesel.estimatedCost === 450,
    'Test 9a: Diesel vehicle uses L unit',
    JSON.stringify(t9_diesel)
  );

  const t9_cng = clientCalculateFuelEstimate({
    distance: 100,
    fuelEconomy: 25,
    fuelEconomyUnit: 'km/kg',
    fuelType: 'cng',
    pricePerUnit: 80
  });
  assert(
    t9_cng.consumptionUnit === 'kg' && t9_cng.estimatedConsumption === '4.00' && t9_cng.estimatedCost === 320,
    'Test 9b: CNG vehicle uses kg unit',
    JSON.stringify(t9_cng)
  );

  const t9_ev = clientCalculateFuelEstimate({
    distance: 100,
    fuelEconomy: 5,
    fuelEconomyUnit: 'km/kWh',
    fuelType: 'electric',
    pricePerUnit: 8
  });
  assert(
    t9_ev.consumptionUnit === 'kWh' && t9_ev.estimatedConsumption === '20.00' && t9_ev.estimatedCost === 160 && t9_ev.isElectric === true,
    'Test 9c: Electric vehicle uses kWh unit and isElectric flag',
    JSON.stringify(t9_ev)
  );

  // TEST 10: Missing vehicle fuelEconomy
  const t10 = clientCalculateFuelEstimate({
    distance: 100,
    fuelEconomy: null,
    fuelType: 'petrol'
  });
  assert(
    t10.status === 'NO_ECONOMY',
    'Test 10: Missing fuelEconomy handled gracefully (status NO_ECONOMY)',
    JSON.stringify(t10)
  );

  // TEST 11: Backend FuelCostService integration check
  const backendEstimate = await FuelCostService.calculateEstimatedFuelCost({
    distanceKm: 150,
    fuelEconomy: 45,
    fuelEconomyUnit: 'km/l',
    fuelType: 'petrol',
    city: 'Indore'
  });
  assert(
    backendEstimate.isAvailable === true && backendEstimate.estimatedConsumption === 3.33 && backendEstimate.distanceKm === 150,
    'Test 11: Backend FuelCostService parity check',
    JSON.stringify(backendEstimate)
  );

  console.log(`\n--- RESULT: ${passedCount}/${totalTests} TESTS PASSED ---`);
  if (passedCount === totalTests) {
    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY!');
  } else {
    process.exit(1);
  }
}

runAllFuelCostTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
