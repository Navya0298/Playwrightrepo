import { test, expect } from '@playwright/test';
import { getRegion } from '../utils';

const targetSystemUrl = `https://qnxtreg${getRegion()}.cfhp.com/QNXTALL/QNXT/master/LaunchQnxt.aspx`;

[
  { searchText: 'Claims', pageTitle: 'Claims' , navigate: true , checkTitle: true },
  { searchText: 'Claim Estimate', pageTitle: 'Claim Estimate', navigate: false , checkTitle: true },
  { searchText: 'Mass Adjudication', pageTitle: 'Mass Adjudication', navigate: false , checkTitle: true },
  { searchText: 'Members', pageTitle: 'Member', navigate: true , checkTitle: true },
  { searchText: 'Predetermination', pageTitle: 'Predetermination', navigate: false, checkTitle: true },
  { searchText: 'Providers', pageTitle: 'Providers', navigate: true, checkTitle: true},
  { searchText: 'Sponsors', pageTitle: 'Sponsors', navigate: true, checkTitle: true },
  { searchText: 'Case Manager', pageTitle: 'Case Manager', navigate: false, checkTitle: true },
  { searchText: 'Case Referrer', pageTitle: 'Case Referrer', navigate: false, checkTitle: true },
  { searchText: 'Case Supervisor', pageTitle: 'Case Supervisor', navigate: false, checkTitle: true },
  { searchText: 'Utilization Management', pageTitle: 'Utilization Management', navigate: false, checkTitle: false }, // <-- fail because web element is different
  { searchText: 'Appeals and Grievance', pageTitle: 'Appeals and Grievance', navigate: false, checkTitle: true }, // <-- fail because a link is not clickable
  { searchText: 'Call Tracking', pageTitle: 'Call Tracking', navigate: false, checkTitle: true },
  { searchText: 'QNXT Analytics', pageTitle: 'QNXT Analytics', navigate: true, checkTitle: true },
  { searchText: 'Reporting Services', pageTitle: 'Reporting Services', navigate: true, checkTitle: true },
  { searchText: 'Configuration', pageTitle: 'Configuration', navigate: false, checkTitle: true }, // <-- fail because there are three links on a page after search
  { searchText: 'User Security', pageTitle: 'User Security', navigate: false, checkTitle: true },
  { searchText: 'Benefit Plans', pageTitle: 'Benefit Plans', navigate: true, checkTitle: true },
  { searchText: 'Carriers/ Programs', pageTitle: 'Carriers/ Programs', navigate: false, checkTitle: true },
  { searchText: 'Case Management', pageTitle: 'Case Management', navigate: false, checkTitle: true },
  { searchText: 'Claim Finance Codes', pageTitle: 'Claim Finance Codes', navigate: true, checkTitle: true },
  { searchText: 'Contracts', pageTitle: 'Contracts', navigate: true, checkTitle: true },
  { searchText: 'External Claim Editing', pageTitle: 'External Claim Editing', navigate: true, checkTitle: true },
  { searchText: 'Fee Tables', pageTitle: 'Fee Tables', navigate: false, checkTitle: true },
  { searchText: 'Medical Codes', pageTitle: 'Medical Codes', navigate: false, checkTitle: true },
  { searchText: 'Medical Policy', pageTitle: 'Medical Policy', navigate: false, checkTitle: true },
  { searchText: 'Payment Bundling Administration', pageTitle: 'Payment Bundling Administration', navigate: false, checkTitle: true },
  { searchText: 'Policy Administrator', pageTitle: 'Policy Administrator', navigate: false, checkTitle: true },
  { searchText: 'Pricer', pageTitle: 'Pricer', navigate: false, checkTitle: true },
  { searchText: 'Rules', pageTitle: 'Rules', navigate: false, checkTitle: true },
  { searchText: 'A/R Account', pageTitle: 'A/R Account', navigate: false, checkTitle: true },
  { searchText: 'A/R Configuration', pageTitle: 'A/R Configuration', navigate: false, checkTitle: true },
  { searchText: 'A/R Past Due', pageTitle: 'A/R Past Due', navigate: false, checkTitle: true },
  { searchText: 'A/R Payment Application', pageTitle: 'A/R Payment Application', navigate: false, checkTitle: true },
  { searchText: 'A/R Payment Entry', pageTitle: 'A/R Payment Entry', navigate: false, checkTitle: true },
  { searchText: 'Workflow Configuration', pageTitle: 'Workflow Configuration', navigate: true, checkTitle: false },
  { searchText: 'Workflow Dashboard', pageTitle: 'Workflow Dashboard', navigate: true, checkTitle: false },
  { searchText: 'Payment Manager', pageTitle: 'Payment Manager', navigate: false, checkTitle: false },
  { searchText: 'Premium Billing', pageTitle: 'Premium Billing', navigate: false, checkTitle: false },
  { searchText: 'Auto-Adjust', pageTitle: 'Auto-Adjust', navigate: false, checkTitle: false },
  { searchText: 'Claim Pre-Archive Tool', pageTitle: 'Claim Pre-Archive Tool', navigate: true, checkTitle: true },
  { searchText: 'Claim Reconciliation', pageTitle: 'Claim Reconciliation', navigate: false, checkTitle: true },
  { searchText: 'Claim Stamper', pageTitle: 'Claim Stamper', navigate: false, checkTitle: true },
  { searchText: 'Claim Troubleshooter', pageTitle: 'Claim Troubleshooter', navigate: false, checkTitle: true },
  { searchText: 'Dependents Age Max', pageTitle: 'Dependents Age Max', navigate: false, checkTitle: true },
  { searchText: 'EDI Manager', pageTitle: 'EDI Manager', navigate: true, checkTitle: true },
  { searchText: 'Mass Benefit Update', pageTitle: 'Mass Benefit Update', navigate: false, checkTitle: false },
  { searchText: 'Member Troubleshooter', pageTitle: 'Member Troubleshooter', navigate: false, checkTitle: true },
  { searchText: 'Payment Troubleshooter', pageTitle: 'Payment Troubleshooter', navigate: false, checkTitle: true },
  { searchText: 'PCP Assignment', pageTitle: 'PCP Assignment', navigate: false, checkTitle: true },
  { searchText: 'Process Log Browser', pageTitle: 'Process Log Browser', navigate: true, checkTitle: true },
  { searchText: 'Product Usage', pageTitle: 'Product Usage', navigate: false, checkTitle: true },
  { searchText: 'Provider Credentialing', pageTitle: 'Provider Credentialing', navigate: false, checkTitle: true },
  { searchText: 'Provider Relations Copy', pageTitle: 'Provider Relations Copy', navigate: false, checkTitle: true },
  { searchText: 'Provider Troubleshooter', pageTitle: 'Provider Troubleshooter', navigate: false, checkTitle: true },
  { searchText: 'Scheduler', pageTitle: 'Scheduler', navigate: true, checkTitle: true },
  { searchText: 'Service Transaction', pageTitle: 'Service Transaction', navigate: false, checkTitle: true },
  { searchText: 'TriZetto RPA', pageTitle: 'TriZetto RPA', navigate: true, checkTitle: false },
  { searchText: 'Bionic Ops Product Health', pageTitle: 'Bionic Ops Product Health', navigate: false, checkTitle: false },
  { searchText: 'Bionic Ops Digital Analysis', pageTitle: 'Bionic Ops Digital Analysis', navigate: false, checkTitle: false },
].forEach(({ searchText, pageTitle, navigate, checkTitle }) => {

  test(`QNXT - Navigate to ${searchText}`, {
    tag: ['@smoke', '@qnxt']
  }, async ({ page }) => {
    expect(targetSystemUrl, 'Missing Target System URL').toBeDefined();
    expect(searchText, 'SearchText value is missing').toBeDefined();
    expect(pageTitle, 'PageTitle value is missing').toBeDefined();
    expect(navigate, 'Navigate value is missing').toBeDefined();
    expect(checkTitle, 'CheckTitle value is missing').toBeDefined();

    await page.goto(targetSystemUrl);
    await page.locator('input#searchInput').click();
    await page.locator('input#searchInput').pressSequentially(searchText);
    await page.getByRole('link', { name: `${searchText} call_made` }).click();
 
    // can we navigate (do we have access to this page/section)
    if (navigate) {
      const page1Promise = page.waitForEvent('popup');
      const page1 = await page1Promise;
    
      // Make sure that we are on targeted page page
      if (checkTitle) {
        const title = await page1.locator('span.new-page-title').innerText();
        expect(title).toBe(pageTitle);
      }

      await page1.close();
    }
 
    await page.close();
  });
});
