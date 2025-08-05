import { test, expect } from '@playwright/test';
import { SearchMemberBySubscriberID, SearchForm } from '../helper-cca';
import { getRegion } from '../utils';

const targetSystemUrl = `https://ccar${getRegion()}.cfhp.com/customlogin/winsso/Default.aspx`;

// Data that will drive the test
[
  { subscriberId: 'A0118679300', formId: '2060' },
  { subscriberId: '523836896', formId: '2060' },
  { subscriberId: '602917887', formId: '2060' },
  { subscriberId: '701468893', formId: '2060' },
].forEach(( { subscriberId, formId }) => {

  test(`CCA - End-To-End for Subscriber ${subscriberId}`, {
    tag: ['@end-to-end', '@sample', '@cca']
  }, async ({ page }) => {
    expect(targetSystemUrl, 'Missing Target System URL').toBeDefined();
    expect(subscriberId, 'SubscriberId is missing').toBeDefined();
    expect(formId, 'FormId is missing').toBeDefined();

    // Initiate browser, navigate to CCA and authentificate
    await page.goto(targetSystemUrl);
  
    await SearchMemberBySubscriberID(page, subscriberId);
  
    // Select first record and open all member's assesments
    await page.locator('iframe[name="RightPanel"]').contentFrame().locator('#RadGridMemberSearch_ctl00').click();
    await page.getByText('Care Management').click();
    await page.getByText('Assessments').click();
    
    const page1Promise = page.waitForEvent('popup');
    const page1 = await page1Promise;
  
    await SearchForm(page1, formId);
    
    // TODO
  
    // Close tabs and browser session
    await page1.close();
    await page.close();
  });
});
