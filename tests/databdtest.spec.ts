// tests/sqlOutput.test.ts
import { test, expect } from '@playwright/test';
import { getPaidServiceSummary } from '../dbUtils';


test('Validate paid service summary from SQL', async () => {
  const memberId = '527829859';
  const summary = await getPaidServiceSummary(memberId);

  console.log('🧾 SQL Output:\n', JSON.stringify(summary, null, 2));

  // ✅ Optional: Add assertions to verify output
  expect(Array.isArray(summary)).toBe(true);
  expect(summary.length).toBeGreaterThan(0); // expects at least one result
});
