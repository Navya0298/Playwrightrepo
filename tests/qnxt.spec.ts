import { test, expect} from '@playwright/test';
import { getRegion } from '../utils';

const targetSystemUrl = `https://qnxtreg${getRegion()}.cfhp.com/QNXTALL`;

test('QNXT - Members', { tag: ['@smoke', '@qnxt'] }, async ({ page }) => {
  expect(targetSystemUrl, 'Missing Target System URL').toBeDefined();

  // Initiate browser, navigate to QNXT and authentificate
  await page.goto(targetSystemUrl);

  // Goto Members page
  await page.locator('.content-box.Members').click();
  await page.getByRole('link', { name: 'OPEN' }).click();
  const page1Promise = page.waitForEvent('popup');
  const page1 = await page1Promise;

  // Make sure that we are on Members page
  const title = await page1.locator('span.new-page-title').innerText();
  expect(title).toBe('Member');
  
  // Try to search john - no results
  await page1.locator('#fraMain').contentFrame().locator('#txtFullName').click();
  await page1.locator('#fraMain').contentFrame().locator('#txtFullName').fill('john');
  await page1.locator('#fraMain').contentFrame().locator('#txtFullName').press('Enter');
  await page1.getByRole('button', { name: 'OK' }).click();
  
  // Try to search john a - no results
  await page1.locator('#fraMain').contentFrame().locator('#txtFullName').click();
  await page1.locator('#fraMain').contentFrame().locator('#txtFullName').fill('john a');
  await page1.locator('#fraMain').contentFrame().locator('#txtFullName').press('Enter');
  await page1.getByRole('button', { name: 'OK' }).click();
  
  // Try to search john b - no results
  await page1.locator('#fraMain').contentFrame().locator('#txtFullName').click();
  await page1.locator('#fraMain').contentFrame().locator('#txtFullName').fill('john b');
  await page1.locator('#fraMain').contentFrame().locator('#txtFullName').press('Enter');
  await page1.getByRole('button', { name: 'OK' }).click();
  
  // Try to search allison and choose Allison Ambrosia, then go to eligibility and open details
  await page1.locator('#fraMain').contentFrame().locator('#txtFullName').click();
  await page1.locator('#fraMain').contentFrame().locator('#txtFullName').fill('allison');
  await page1.locator('#fraMain').contentFrame().locator('#txtFullName').press('Enter');
  await page1.locator('#fraMain').contentFrame().getByRole('row', { name: 'ALLISON, AMBROSIA MEM000001944626 01/01/1900', exact: true }).locator('#MemSearch').click();
  await page1.getByText('Eligibility').click();
  await page1.getByText('Details').click();await page1.getByText('Benefits').click();

  // Close tabs and browser session
  await page1.close();
  await page.close();
});

test('QNXT - Providers', { tag: ['@smoke', '@qnxt'] }, async ({ page }) => {
  expect(targetSystemUrl, 'Missing Target System URL').toBeDefined();

  // Initiate browser, navigate to QNXT and authentificate
  await page.goto(targetSystemUrl);

  // Goto Providers page
  await page.locator('.content-box.Providers').click();
  await page.getByRole('link', { name: 'OPEN' }).click();
  const page1Promise = page.waitForEvent('popup');
  const page1 = await page1Promise;
  
  // Make sure that we are on Providers page
  const title = await page1.locator('span.new-page-title').innerText();
  expect(title).toBe('Providers');

  // Try to search provider/s
  await page1.locator('#fraMain').contentFrame().locator('#txtFullName').click();
  await page1.locator('#fraMain').contentFrame().locator('#txtFullName').fill('test');
  await page1.locator('#fraMain').contentFrame().locator('#txtFullName').press('Enter');
  
  // Close tabs and browser session
  await page1.close();
  await page.close();
});

test('QNXT - Claims', { tag: ['@smoke', '@qnxt'] }, async ({ page }) => {
  expect(targetSystemUrl, 'Missing Target System URL').toBeDefined();

  // Initiate browser, navigate to QNXT and authentificate
  await page.goto(targetSystemUrl);

  // Goto Claims page
  await page.locator('.content-box.Claims').click();
  await page.getByRole('link', { name: 'OPEN' }).click();
  const page1Promise = page.waitForEvent('popup');
  const page1 = await page1Promise;
  
  // Make sure that we are on Claims page
  const title = await page1.locator('span.new-page-title').innerText();
  expect(title).toBe('Claims');
  
  // 
  await page1.locator('#fraMain').contentFrame().locator('#txtClaimNo').click();
  await page1.locator('#fraMain').contentFrame().locator('#txtClaimNo').fill('123456');
  await page1.locator('#fraMain').contentFrame().locator('#txtClaimNo').press('Enter');

  // Close tabs and browser session
  await page1.close();
  await page.close();
});
