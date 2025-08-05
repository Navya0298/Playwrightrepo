import { test, expect } from '@playwright/test';
import { getRegion } from '../utils';

const targetSystemUrl = `https://ccar${getRegion()}.cfhp.com/customlogin/winsso/Default.aspx`;

test('CCA', { tag: ['@smoke', '@cca'] }, async ({ page }) => {
  expect(targetSystemUrl, 'Missing Target System URL').toBeDefined();
  
  console.log(targetSystemUrl); // for debugging

  // Initiate browser, navigate to CCA and authentificate
  await page.goto(targetSystemUrl);
  
  // Search member by name
  await page.locator('iframe[name="topPanelFrame"]').contentFrame().getByRole('button', { name: '' }).click();
  await page.locator('iframe[name="searchFilterFrame"]').contentFrame().getByRole('textbox', { name: 'First Name' }).click();
  await page.locator('iframe[name="searchFilterFrame"]').contentFrame().getByRole('textbox', { name: 'First Name' }).fill('allison');
  await page.locator('iframe[name="searchFilterFrame"]').contentFrame().getByRole('textbox', { name: 'First Name' }).press('Enter');
  
  // Select forth row and open all member's assesments
  await page.locator('iframe[name="RightPanel"]').contentFrame().locator('#RadGridMemberSearch_ctl00__3').getByRole('cell', { name: 'ALLISON' }).click();
  await page.getByText('Care Management').click();
  await page.getByText('Assessments').click();
  const page1Promise = page.waitForEvent('popup');
  const page1 = await page1Promise;
  // TODO

  // Close tabs and browser session
  await page1.close();
  await page.close();
});
