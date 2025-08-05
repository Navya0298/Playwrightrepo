import { test, expect } from '@playwright/test';
import { SearchMemberBySubscriberID, SearchForm, TakeRetakeRestartAssessment } from '../helper-cca';
import { getRegion } from '../utils';

const targetSystemUrl = `https://ccar${getRegion()}.cfhp.com/customlogin/winsso/Default.aspx`;

// Data that drives the test
[
  { subscriberId: 'A0100426200', formId: 'LTSS 2604'},
  { subscriberId: '602917887', formId: 'LTSS 2604'},
  { subscriberId: '824459733', formId: 'LTSS 2604'},
  { subscriberId: 'A0087324800', formId: 'LTSS 2604'},
  { subscriberId: '519383026', formId: 'LTSS 2604' }
].forEach(( { subscriberId, formId }) => {

  test(`CCA - ${formId} End-To-End for Subscriber ${subscriberId}`, {
    tag: ['@end-to-end', '@cca', '@ltss2604']
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

    // page - STAR Kids Individual Service Plan - Service Tracking Tool
    await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_6_ctrlQuestion_txt_6').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_6_ctrlQuestion_txt_6').fill('12');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_7_ctrlQuestion_txt_7').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_7_ctrlQuestion_txt_7').fill('15');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_143_ctrlQuestion_rdo143_0').check();
    await page1.getByRole('radio', { name: 'Initial (New)' }).check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_9_ddl_9').selectOption('3');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_11_ctrlQuestion_rdo11_0').check();
    await page1.getByRole('radio', { name: 'Agency' }).check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_11_q_12_q_13_ddl_13').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_11_q_12_q_155_ctrlQuestion_txt_155').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_11_q_12_q_155_ctrlQuestion_txt_155').fill('10');
    await page1.locator('#divNq_154').getByRole('cell').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_24_ctrlQuestion_rdo24_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_29_ctrlQuestion_rdo29_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_43_ctrlQuestion_rdo43_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_53_ctrlQuestion_rdo53_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_63_ctrlQuestion_rdo63_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_66_ctrlQuestion_rdo66_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_79_ctrlQuestion_rdo79_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_189_ctrlQuestion_rdo189_1').check();
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - STAR Kids Individual Service Plan - Continued
    await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_3_q_138_ctrlQuestion_txt_138').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_3_q_138_ctrlQuestion_txt_138').fill('test automation');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_3_q_139_ddl_139').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_3_q_140_ctrlQuestion_txt_140').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_3_q_140_ctrlQuestion_txt_140').fill('test');
    await page1.getByRole('radio', { name: 'No' }).check();

    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - Final 
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
