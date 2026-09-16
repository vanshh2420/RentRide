async function testCatalogApis() {
  const base = 'http://localhost:5000/api/catalog';
  console.log('=== SECTION 9: CATALOG API VERIFICATION ===\n');

  // 1. GET /api/catalog (Pagination & Search)
  const res1 = await fetch(`${base}?page=1&limit=5&search=Thar`);
  const d1 = await res1.json();
  console.log('[1] GET /api/catalog?search=Thar:');
  console.log(`  - HTTP Status: ${res1.status}`);
  console.log(`  - Response Structure: success=${d1.success}, statusCode=${d1.statusCode}`);
  console.log(`  - Total Matching Models: ${d1.data?.pagination?.total}`);
  console.log(`  - Returned Models: ${d1.data?.models?.length}`);
  console.log(`  - First Result: ${d1.data?.models?.[0]?.brand} ${d1.data?.models?.[0]?.model} (${d1.data?.models?.[0]?.catalogKey})`);

  // 1b. GET /api/catalog (Filtering by category & fuelType)
  const res1b = await fetch(`${base}?fuelType=electric&limit=3`);
  const d1b = await res1b.json();
  console.log('\n[1b] GET /api/catalog?fuelType=electric:');
  console.log(`  - HTTP Status: ${res1b.status}`);
  console.log(`  - Total Electric Models: ${d1b.data?.pagination?.total}`);
  console.log(`  - Sample EV: ${d1b.data?.models?.[0]?.brand} ${d1b.data?.models?.[0]?.model} -> Economy: ${JSON.stringify(d1b.data?.models?.[0]?.fuelEconomy)}`);

  // 2. GET /api/catalog/brands
  const res2 = await fetch(`${base}/brands`);
  const d2 = await res2.json();
  console.log('\n[2] GET /api/catalog/brands:');
  console.log(`  - HTTP Status: ${res2.status}`);
  console.log(`  - Brands Count: ${d2.data?.length}`);
  console.log(`  - Sample Brands: ${d2.data?.slice(0, 8).join(', ')}`);

  // 3. GET /api/catalog/brands/:brand/models
  const testBrand = 'Tata';
  const res3 = await fetch(`${base}/brands/${testBrand}/models`);
  const d3 = await res3.json();
  console.log(`\n[3] GET /api/catalog/brands/${testBrand}/models:`);
  console.log(`  - HTTP Status: ${res3.status}`);
  console.log(`  - Total Models Returned: ${d3.data?.length}`);
  console.log(`  - Sample Trims: ${d3.data?.slice(0, 3).map(m => m.model + ' ' + m.variant).join(' | ')}`);

  // 4. GET /api/catalog/key/:key
  const testKey = 'tata-curvv-ev-empowered-plus-a-55-kwh';
  const res4 = await fetch(`${base}/key/${testKey}`);
  const d4 = await res4.json();
  console.log(`\n[4] GET /api/catalog/key/${testKey}:`);
  console.log(`  - HTTP Status: ${res4.status}`);
  console.log(`  - Brand & Model: ${d4.data?.brand} ${d4.data?.model} (${d4.data?.variant})`);
  console.log(`  - Seating: ${d4.data?.seatingCapacity}, Transmission: ${d4.data?.transmission}`);
  console.log(`  - Fuel Economy: ${JSON.stringify(d4.data?.fuelEconomy)}`);

  // 5. GET /api/catalog/:id
  const testId = d4.data?._id;
  const res5 = await fetch(`${base}/${testId}`);
  const d5 = await res5.json();
  console.log(`\n[5] GET /api/catalog/${testId}:`);
  console.log(`  - HTTP Status: ${res5.status}`);
  console.log(`  - ID Lookup Match: ${d5.data?._id === testId}`);

  // 6. Error handling: Nonexistent key
  const res6 = await fetch(`${base}/key/non-existent-vehicle-key-12345`);
  const d6 = await res6.json();
  console.log('\n[6] GET /api/catalog/key/non-existent-vehicle-key-12345 (404 Test):');
  console.log(`  - HTTP Status: ${res6.status}`);
  console.log(`  - Error Message: "${d6.message}"`);

  // 7. Error handling: Malformed ObjectId
  const res7 = await fetch(`${base}/malformed-id-999`);
  const d7 = await res7.json();
  console.log('\n[7] GET /api/catalog/malformed-id-999 (Invalid ID Test):');
  console.log(`  - HTTP Status: ${res7.status}`);
  console.log(`  - Error Message: "${d7.message}"`);

  // 8. Admin Route Protection: POST /api/catalog without Auth
  const res8 = await fetch(`${base}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brand: 'Test' })
  });
  const d8 = await res8.json();
  console.log('\n[8] POST /api/catalog without auth (401 RBAC Guard Test):');
  console.log(`  - HTTP Status: ${res8.status}`);
  console.log(`  - Error Message: "${d8.message}"`);
}

testCatalogApis().catch(console.error);
