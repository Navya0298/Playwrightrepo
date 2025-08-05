import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://communityfirsthealthplans.com/find-provider/');
  await page.getByRole('link', { name: 'Find A Provider' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.locator('.et_pb_with_border.et_pb_module.et_pb_cta_9 > .et_pb_button_wrapper > .et_pb_button').click();
  const page1 = await page1Promise;
  await page1.locator('#post-246710 iframe').contentFrame().getByLabel('Provider Type:').selectOption('PCP');
  await page1.locator('#post-246710 iframe').contentFrame().getByLabel('Specialty:').selectOption('Family Practice General Practice');
  await page1.locator('#post-246710 iframe').contentFrame().getByRole('button', { name: 'Search' }).click();
  await page1.locator('#post-246710 iframe').contentFrame().locator('td:nth-child(3)').first().click();
  await page1.locator('#post-246710 iframe').contentFrame().locator('tr:nth-child(5) > td:nth-child(3)').first().click();
  await page1.locator('#post-246710 iframe').contentFrame().getByRole('cell', { name: '430 W SUNSET BLVD STE 105 SAN ANTONIO, TX 78209', exact: true }).click();
   await page.goto('https://cfhpbeta.healthtrioconnect.com/app/index.page');
  await page.getByRole('textbox', { name: 'Enter username' }).click();
  await page.getByRole('textbox', { name: 'Enter username' }).fill('CFHPTestProviderRKaushik');
  await page.getByRole('textbox', { name: 'Enter password' }).click();
  await page.getByRole('textbox', { name: 'Enter password' }).fill('COMMUNITYfirst210)');
  await page.getByRole('button', { name: 'Sign in' }).click();


    // Close tabs and browser session
    // await page1.close();
    // await page.close();


});