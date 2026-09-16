/**
 * RentRide Anti-Collision Overlap Algorithm Unit Test Suite
 * Mathematical verification of zero-overlap guarantee
 */

function checkIntervalOverlap(existingStart, existingEnd, requestedStart, requestedEnd) {
  const eStart = new Date(existingStart).getTime();
  const eEnd = new Date(existingEnd).getTime();
  const rStart = new Date(requestedStart).getTime();
  const rEnd = new Date(requestedEnd).getTime();

  // Overlap Formula: (existingStart < requestedEnd) && (existingEnd > requestedStart)
  return eStart < rEnd && eEnd > rStart;
}

const testCases = [
  {
    name: '1. Exact Identical Interval [10:00 - 20:00] vs [10:00 - 20:00]',
    existing: ['2026-09-01T10:00:00Z', '2026-09-01T20:00:00Z'],
    requested: ['2026-09-01T10:00:00Z', '2026-09-01T20:00:00Z'],
    expectOverlap: true
  },
  {
    name: '2. User Scenario: Online [10:00 - 20:00] vs Offline Walk-in [17:00 - 22:00]',
    existing: ['2026-09-01T10:00:00Z', '2026-09-01T20:00:00Z'],
    requested: ['2026-09-01T17:00:00Z', '2026-09-01T22:00:00Z'],
    expectOverlap: true
  },
  {
    name: '3. Reverse Scenario: Offline Walk-in [10:00 - 20:00] vs Online [17:00 - 22:00]',
    existing: ['2026-09-01T10:00:00Z', '2026-09-01T20:00:00Z'],
    requested: ['2026-09-01T17:00:00Z', '2026-09-01T22:00:00Z'],
    expectOverlap: true
  },
  {
    name: '4. Overlapping Head [10:00 - 20:00] vs [08:00 - 12:00]',
    existing: ['2026-09-01T10:00:00Z', '2026-09-01T20:00:00Z'],
    requested: ['2026-09-01T08:00:00Z', '2026-09-01T12:00:00Z'],
    expectOverlap: true
  },
  {
    name: '5. Interior Subset [10:00 - 20:00] vs [13:00 - 16:00]',
    existing: ['2026-09-01T10:00:00Z', '2026-09-01T20:00:00Z'],
    requested: ['2026-09-01T13:00:00Z', '2026-09-01T16:00:00Z'],
    expectOverlap: true
  },
  {
    name: '6. Exterior Superset [12:00 - 15:00] vs [10:00 - 20:00]',
    existing: ['2026-09-01T12:00:00Z', '2026-09-01T15:00:00Z'],
    requested: ['2026-09-01T10:00:00Z', '2026-09-01T20:00:00Z'],
    expectOverlap: true
  },
  {
    name: '7. Non-overlapping Before [10:00 - 20:00] vs [06:00 - 09:00]',
    existing: ['2026-09-01T10:00:00Z', '2026-09-01T20:00:00Z'],
    requested: ['2026-09-01T06:00:00Z', '2026-09-01T09:00:00Z'],
    expectOverlap: false
  },
  {
    name: '8. Non-overlapping After [10:00 - 20:00] vs [20:05 - 23:00]',
    existing: ['2026-09-01T10:00:00Z', '2026-09-01T20:00:00Z'],
    requested: ['2026-09-01T20:05:00Z', '2026-09-01T23:00:00Z'],
    expectOverlap: false
  },
  {
    name: '9. Exact Boundary Touch [10:00 - 20:00] vs [20:00 - 23:00] (Abutting)',
    existing: ['2026-09-01T10:00:00Z', '2026-09-01T20:00:00Z'],
    requested: ['2026-09-01T20:00:00Z', '2026-09-01T23:00:00Z'],
    expectOverlap: false
  }
];

console.log('=================================================================');
console.log('🧪 RENTRIDE ANTI-COLLISION FORMULA VERIFICATION SUITE');
console.log('Formula: (existingStart < requestedEnd) && (existingEnd > requestedStart)');
console.log('=================================================================\n');

let passedCount = 0;

for (const tc of testCases) {
  const isOverlap = checkIntervalOverlap(
    tc.existing[0],
    tc.existing[1],
    tc.requested[0],
    tc.requested[1]
  );

  const status = isOverlap === tc.expectOverlap ? '✅ PASS' : '❌ FAIL';
  if (isOverlap === tc.expectOverlap) passedCount++;

  console.log(`${status} | ${tc.name}`);
  console.log(`       Existing:  ${tc.existing[0]} -> ${tc.existing[1]}`);
  console.log(`       Requested: ${tc.requested[0]} -> ${tc.requested[1]}`);
  console.log(`       Result:    Overlap Detected = ${isOverlap} (Expected: ${tc.expectOverlap})\n`);
}

console.log('=================================================================');
console.log(`🏁 RESULT: ${passedCount}/${testCases.length} Tests Passed Cleanly`);
console.log('=================================================================');

if (passedCount !== testCases.length) {
  process.exit(1);
}
