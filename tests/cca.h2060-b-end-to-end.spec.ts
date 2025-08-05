import { test, expect } from '@playwright/test';
import { SearchMemberBySubscriberID, SearchForm, TakeRetakeRestartAssessment } from '../helper-cca';
import { getRegion } from '../utils';

const targetSystemUrl = `https://ccar${getRegion()}.cfhp.com/customlogin/winsso/Default.aspx`;

// Data that drives the test
[
  { subscriberId: 'A0100426200', formId: 'H2060-B'},
  { subscriberId: 'A0118679300', formId: 'H2060-B'},
  { subscriberId: 'A0000706601', formId: 'H2060-b'},
  { subscriberId: 'A0002948700', formId: 'H2060-B'},
  { subscriberId: '728590748', formId: 'h2060-B'},
  { subscriberId: 'A0064191203', formId: 'h2060-b'},
  { subscriberId: '521292623', formId: 'h2060-b'},
   { subscriberId: '518996392', formId: 'h2060-b'}
].forEach(( { subscriberId, formId }) => {

  test(`CCA - ${formId} End-To-End for Subscriber ${subscriberId}`, {
    tag: ['@end-to-end', '@cca', '@h2060-b']
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

    // page - General Information
    // Required question
    await page1.locator('#cphBody_cphContent_HRAWizard1_500573_P_1_q_5_ctrlQuestion_txt_5').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500573_P_1_q_5_ctrlQuestion_txt_5').fill(`Test Automation ${subscriberId}`);
    // not requred, if we add a value here path will be less for one step
    await page1.locator('#cphBody_cphContent_HRAWizard1_500573_P_1_q_6_ctrlQuestion_txt_6').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500573_P_1_q_6_ctrlQuestion_txt_6').clear();
    // await page1.locator('#cphBody_cphContent_HRAWizard1_500573_P_1_q_6_ctrlQuestion_txt_6').fill(`Test Automation - ${subscriberId}`);
    // Required question, can be randomized
    await page1.getByRole('img', { name: '...' }).click();
    await page1.getByTitle('Today').click();
    // Required question, can be randomized
    await page1.locator('#cphBody_cphContent_HRAWizard1_500573_P_1_q_8_ddl_8').selectOption('2');
    // Required question, can be randomized
    await page1.locator('#cphBody_cphContent_HRAWizard1_500573_P_1_q_9_ddl_9').selectOption('1');
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
    
    // page - Assessment
    await page1.locator('#cphBody_cphContent_HRAWizard1_500573_P_2_q_10_ctrlQuestion_txt_10').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500573_P_2_q_10_ctrlQuestion_txt_10').fill('B91 - Sequelae of poliomyelitis, C71.1-C71.9 - Malignant neoplasms of various brain regions');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500573_P_2_q_11_ddl_11').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500573_P_2_q_12_ddl_12').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500573_P_2_q_13_ddl_13').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500573_P_2_q_14_ddl_14').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500573_P_2_q_15_ddl_15').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500573_P_2_q_16_ddl_16').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500573_P_2_q_16_q_27_ctrlQuestion_txt_27').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500573_P_2_q_16_q_27_ctrlQuestion_txt_27').fill('I experience heightened anxiety or alertness. I may check the weather frequently and feel uneasy until the storm passes. However, I also find a strange comfort in the sound of thunder and rain, which can inspire deep thoughts or creative bursts.');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500573_P_2_q_17_ddl_17').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500573_P_2_q_18_ddl_18').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500573_P_2_q_18_q_29_ddl_29').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500573_P_2_q_18_q_29_q_30_ctrlQuestion_txt_30').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500573_P_2_q_18_q_29_q_30_ctrlQuestion_txt_30').fill('As a senior with a lifetime of experience, I am eager to continue contributing to my community through meaningful work or volunteer service. I bring reliability, patience, and a strong sense of responsibility to any role I take on. I enjoy helping others, staying active, and sharing the knowledge I’ve gained over the years. I believe that age is not a barrier to making a difference, and I am ready to offer my time and skills wherever they are needed.');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500573_P_2_q_19_ddl_19').selectOption('2');
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
    
    // page - Additional Comments
    await page1.locator('#cphBody_cphContent_HRAWizard1_500573_P_3_q_20_ctrlQuestion_txt_20').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500573_P_3_q_20_ctrlQuestion_txt_20').fill(`Test Automation: Additional Comments ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500573_P_3_q_21_ctrlQuestion_txt_21').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500573_P_3_q_21_ctrlQuestion_txt_21').fill(`ASSESSING SC ${new Date().toISOString()}`);
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - Summary

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
