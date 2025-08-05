import { test, expect } from '@playwright/test';
import { SearchMemberBySubscriberID, SearchForm, TakeRetakeRestartAssessment } from '../helper-cca';
import { getRandomInt, getFutureDate, getRegion } from '../utils';

const targetSystemUrl = `https://ccar${getRegion()}.cfhp.com/customlogin/winsso/Default.aspx`;

// Data that drives the test
[
  { subscriberId: 'A0000580301', formId: 'H1700-2' },
  { subscriberId: 'A0100426200', formId: 'H1700-2' },
  { subscriberId: '616790286', formId: 'H1700-2' },
  { subscriberId: '524583320', formId: 'H1700-2' },
  { subscriberId: 'A0063829902', formId: 'H1700-2' },
  { subscriberId: 'A0000162111', formId: 'H1700-2' },
].forEach(( { subscriberId, formId }) => {

  test(`CCA - ${formId} End-To-End for Subscriber ${subscriberId}`, {
    tag: ['@end-to-end', '@caa', '@h1700-2']
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

    // page - Demographics
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_1_q_1_dt1').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_1_q_1_dt1').fill(`${getFutureDate(1)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_1_q_2_dt2').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_1_q_2_dt2').fill(`${getFutureDate(90)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_1_q_3_dt3').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_1_q_3_dt3').fill(`${getFutureDate(82)}`);
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
    
    // page - Medical Information
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_2_q_11_ddl_11').selectOption(`${getRandomInt(1,30)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_2_q_12_ctrlQuestion_txt_12').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_2_q_12_ctrlQuestion_txt_12').fill(`Test Automation: Rationale ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_2_q_13_ddl_13').selectOption(`${getRandomInt(1,30)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_2_q_14_ctrlQuestion_txt_14').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_2_q_14_ctrlQuestion_txt_14').fill(`Test Automation: Rationale 2 ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_2_q_15_ddl_15').selectOption(`${getRandomInt(1,30)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_2_q_16_ctrlQuestion_txt_16').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_2_q_16_ctrlQuestion_txt_16').fill(`Test Automation: Rationale 3 ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_2_q_17_ddl_17').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_2_q_17_q_18_ddl_18').selectOption(`${getRandomInt(1,30)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_2_q_17_q_19_ctrlQuestion_txt_19').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_2_q_17_q_19_ctrlQuestion_txt_19').fill(`Test Automation: Rationale 4 ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_2_q_24_ddl_24').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_2_q_31_ddl_31').selectOption('2');
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - Goals
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_3_q_42_ctrlQuestion_txt_42').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_3_q_42_ctrlQuestion_txt_42').fill(`Test Automation: Individualized goals ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_3_q_43_ctrlQuestion_txt_43').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_3_q_43_ctrlQuestion_txt_43').fill(`Test Automation: Individualized goals 2 ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_3_q_44_ctrlQuestion_txt_44').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_3_q_45_ddl_45').selectOption('2');
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - Support System - N/A
    await page1.getByRole('radio', { name: 'N/A' }).check();

    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - Additional Information
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_5_q_165_ctrlQuestion_rdo165_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_5_q_165_q_273_ctrlQuestion_txt_273').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_5_q_165_q_273_ctrlQuestion_txt_273').fill(`Test Automation: Resource ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_5_q_165_q_274_ctrlQuestion_txt_274').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_5_q_165_q_274_ctrlQuestion_txt_274').fill(`Test Automation: Policy ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_5_q_165_q_275_ctrlQuestion_txt_275').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_5_q_165_q_275_ctrlQuestion_txt_275').fill(`Test Automation: Service ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_5_q_165_q_276_ctrlQuestion_txt_276').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_5_q_165_q_276_ctrlQuestion_txt_276').fill('1');
    await page1.getByRole('radio', { name: 'No' }).check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_5_q_181_ctrlQuestion_rdo181_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_5_q_182_ctrlQuestion_rdo182_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_5_q_183_ctrlQuestion_rdo183_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_5_q_184_ctrlQuestion_rdo184_1').check();
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - Emergency Plan
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_6_q_82_ctrlQuestion_txt_82').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_6_q_82_ctrlQuestion_txt_82').fill(`Test Automation: Emergency plan ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_6_q_84_ctrlQuestion_txt_84').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_6_q_84_ctrlQuestion_txt_84').fill(`Test Automation: Emergency plan 3 ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_6_q_89_ctrlQuestion_txt_89').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_6_q_89_ctrlQuestion_txt_89').fill(`Test Automation: Emergency Contact ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_6_q_90_ctrlQuestion_txt_90').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_6_q_90_ctrlQuestion_txt_90').fill(`Test Automation: Emergency Relationship ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_6_q_91_ctrlQuestion_txt_91').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_6_q_91_ctrlQuestion_txt_91').fill('123-456-7890');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_6_q_98_ddl_98').selectOption('2');

    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - Follow-Up Schedule
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_7_q_108_ctrlQuestion_txt_108').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_7_q_108_ctrlQuestion_txt_108').fill(`Test Automation: Service Coordinator ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_7_q_109_ctrlQuestion_txt_109').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_7_q_109_ctrlQuestion_txt_109').fill(`Test Automation: Service Coordinator Schedule ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_7_q_111_ddl_111').selectOption('2');
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - Additional Comments
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_8_q_120_ctrlQuestion_txt_120').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500578_P_8_q_120_ctrlQuestion_txt_120').fill(`Test Automation: Additional Comments ${subscriberId} ${new Date().toISOString()}`);
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - Final Page
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // Save Report as PDF
    await page1.getByRole('link', { name: 'View History' }).click();
    await page1.locator('#ctl00_ctl00_cphBody_cphList_HRAHistoryListGrid_ctl00__0').getByRole('cell', { name: 'Completed Completed' }).click();
    await page1.getByRole('link', { name: 'View Report' }).click();

    const page2Promise = page1.waitForEvent('popup');
    const page2 = await page2Promise;
    await page2.getByRole('cell', { name: '▼ VII. Additional Comments' }).click();
    await page2.pdf({path: `./pdfs/CCA_${formId}_${subscriberId}_${Date.now()}.pdf`, format: 'A4'});
    
    // Close tabs and browser session
    await page2.close();
    await page1.close();
    await page.close();
  });
});
