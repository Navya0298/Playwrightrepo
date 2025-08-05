import { test, expect } from '@playwright/test';
import { SearchMemberBySubscriberID, SearchForm, TakeRetakeRestartAssessment } from '../helper-cca';
import { getFutureDate, getRegion } from '../utils';

const targetSystemUrl = `https://ccar${getRegion()}.cfhp.com/customlogin/winsso/Default.aspx`;

// Data that drives the test
[
  { subscriberId: 'A0000580301', formId: '2605' },
  { subscriberId: 'A0100426200', formId: '2605' },
  { subscriberId: '616790286', formId: '2605' },
  { subscriberId: '524583320', formId: '2605' },
  { subscriberId: '529953611', formId: '2605' },
].forEach(( { subscriberId, formId }) => {

  test(`CCA - ${formId} End-To-End for Subscriber ${subscriberId}`, {
    tag: ['@end-to-end', '@cca', '@ltss2605']
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

    // page - Member SK-SAI MDCP Review Signature
    await page1.locator('#cphBody_cphContent_HRAWizard1_500553_P_1_q_7_ctrlQuestion_txt_7').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500553_P_1_q_7_ctrlQuestion_txt_7').fill('Automation');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500553_P_1_q_8_ctrlQuestion_txt_8').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500553_P_1_q_8_ctrlQuestion_txt_8').fill('Test');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500553_P_1_q_10_ctrlQuestion_txt_10').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500553_P_1_q_10_ctrlQuestion_txt_10').fill('N/A');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500553_P_1_q_11_dt11').fill(`${getFutureDate(0)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500553_P_1_q_13_ctrlQuestion_rdo13_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500553_P_1_q_26_ctrlQuestion_txt_26').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500553_P_1_q_26_ctrlQuestion_txt_26').fill(`Test Automation Feedback ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500553_P_1_q_27_ctrlQuestion_txt_27').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500553_P_1_q_27_ctrlQuestion_txt_27').fill(`Test Automation Nurse Feedback ${subscriberId}`);
    await page1.getByRole('checkbox', { name: 'Printed hard copy sent' }).check();
    await page1.getByRole('checkbox', { name: 'Electronic copy sent through' }).check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500553_P_1_q_28_q_29_ctrlQuestion_txt_29').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500553_P_1_q_28_q_29_ctrlQuestion_txt_29').fill('12238 Silicon Drive Suite 100 San Antonio, TX 78249');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500553_P_1_q_28_q_30_ctrlQuestion_txt_30').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500553_P_1_q_28_q_30_ctrlQuestion_txt_30').fill(`test_automation${subscriberId}@gmail.com`);
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
    
    // page - Signature Page
    await page1.locator('#cphBody_cphContent_HRAWizard1_500553_P_2_q_15_ctrlQuestion_txt_15').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500553_P_2_q_15_ctrlQuestion_txt_15').fill(`Test Automation Member Signature ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500553_P_2_q_16_ctrlQuestion_txt_16').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500553_P_2_q_16_ctrlQuestion_txt_16').fill('TAMS');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500553_P_2_q_17_dt17').fill(`${getFutureDate(1)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500553_P_2_q_18_ctrlQuestion_txt_18').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500553_P_2_q_18_ctrlQuestion_txt_18').fill(`Test Automation Nurse Signature ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500553_P_2_q_19_ctrlQuestion_txt_19').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500553_P_2_q_19_ctrlQuestion_txt_19').fill('TANS');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500553_P_2_q_32_dt32').fill(`${getFutureDate(1)}`);

    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
    
    // page - Summary
    
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
