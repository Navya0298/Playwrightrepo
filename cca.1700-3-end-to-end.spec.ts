import { test, expect } from '@playwright/test';
import { SearchMemberBySubscriberID, SearchForm, TakeRetakeRestartAssessment } from '../helper-cca';
import { getFutureDate , getRegion} from '../utils';

const targetSystemUrl = `https://ccar${getRegion()}.cfhp.com/customlogin/winsso/Default.aspx`;

// Data that drives the test
[
  { subscriberId: 'A0000580301', formId: 'H1700-3' },
  { subscriberId: 'A0100426200', formId: 'H1700-3' },
  { subscriberId: '616790286', formId: 'H1700-3' },
  { subscriberId: '524583320', formId: 'H1700-3' },
  { subscriberId: 'A0113436500', formId: 'H1700-3' },
].forEach(( { subscriberId, formId }) => {

  test(`CCA - ${formId} End-To-End for Subscriber ${subscriberId}`, {
    tag: ['@end-to-end', '@cca', '@h1700-3']
  }, async ({ page }) => {
    expect(targetSystemUrl, 'Missing Target System URL').toBeDefined();
    expect(subscriberId, 'SubscriberId is missing').toBeDefined();
    expect(formId, 'FormId is missing').toBeDefined();
    test.setTimeout(120_000);

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
    
    await TakeRetakeRestartAssessment(page1);

    // page - Member Information
    await page1.locator('#cphBody_cphContent_HRAWizard1_500570_P_1_q_1_dt1').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500570_P_1_q_1_dt1').fill(`${getFutureDate(0)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500570_P_1_q_2_dt2').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500570_P_1_q_2_dt2').fill(`${getFutureDate(180)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500570_P_1_q_3_dt3').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500570_P_1_q_3_dt3').fill(`${getFutureDate(165)}`);
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
    
    // page - Signature Page
    await page1.locator('#cphBody_cphContent_HRAWizard1_500570_P_2_q_9_chk_9_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500570_P_2_q_10_chk_10_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500570_P_2_q_11_ctrlQuestion_txt_11').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500570_P_2_q_11_ctrlQuestion_txt_11').fill(`Test Automation Member ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500570_P_2_q_12_ctrlQuestion_txt_12').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500570_P_2_q_12_ctrlQuestion_txt_12').fill('TAM');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500570_P_2_q_13_dt13').fill(`${getFutureDate(0)}`);;
    await page1.locator('#cphBody_cphContent_HRAWizard1_500570_P_2_q_14_ctrlQuestion_txt_14').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500570_P_2_q_14_ctrlQuestion_txt_14').fill(`Test Automation Witness ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500570_P_2_q_15_ctrlQuestion_txt_15').fill('TAW');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500570_P_2_q_16_dt16').fill(`${getFutureDate(0)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500570_P_2_q_17_ctrlQuestion_txt_17').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500570_P_2_q_17_ctrlQuestion_txt_17').fill(`Test Automationn Service Coordinator ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500570_P_2_q_18_ctrlQuestion_txt_18').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500570_P_2_q_18_ctrlQuestion_txt_18').fill('TASC');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500570_P_2_q_19_dt19').fill(`${getFutureDate(0)}`);

    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
    
    // page - Final Page
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
    
    // Save Report as PDF
    await page1.getByRole('link', { name: 'View History' }).click();
    await page1.locator('#ctl00_ctl00_cphBody_cphList_HRAHistoryListGrid_ctl00__0').getByRole('cell', { name: 'Completed Completed' }).click();
    await page1.getByRole('link', { name: 'View Report' }).click();

    const page2Promise = page1.waitForEvent('popup');
    const page2 = await page2Promise;
    await page2.getByRole('cell', { name: '▼ Final' }).click();
    await page2.pdf({path: `./pdfs/CCA_${formId}_${subscriberId}_${Date.now()}.pdf`, format: 'A4'});
    
    // Close tabs and browser session
    await page2.close();
    await page1.close();
    await page.close();
  });
});
