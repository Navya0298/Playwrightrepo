import { test, expect } from '@playwright/test';
import { SearchMemberBySubscriberID, SearchForm, TakeRetakeRestartAssessment } from '../helper-cca';
import { getRandomInt, getFutureDate, getRegion } from '../utils';

const targetSystemUrl = `https://ccar${getRegion()}.cfhp.com/customlogin/winsso/Default.aspx`;

// Data that drives the test
[
  { subscriberId: 'A0100426200', formId: 'H1700-1' },
  { subscriberId: 'A0064191203', formId: 'H1700-1'},
  { subscriberId: '728590748', formId: 'h1700-1'},
  { subscriberId: '706544650', formId: 'H1700-1' },

].forEach(( { subscriberId, formId }) => {
  // Baseline test for H1700-1, only a few selections
  test(`CCA - ${formId} End-To-End for Subscriber ${subscriberId}`, {
    tag: ['@end-to-end', '@cca', '@h1700-1']
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
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_1_q_7_dt7_PU_TG').click();
    await page1.getByTitle('Today').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_1_q_8_dt8_PU_TG').click();
    await page1.getByTitle('Today').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_1_q_9_dt9').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_1_q_9_dt9').fill(`${getFutureDate(65)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_1_q_12_ctrlQuestion_txt_12').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_1_q_12_ctrlQuestion_txt_12').fill('Bexar');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_1_q_13_ddl_13').selectOption(`${getRandomInt(1, 4)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_1_q_14_ddl_14').selectOption(`${getRandomInt(1, 3)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_1_q_15_ddl_15').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_1_q_16_ctrlQuestion_txt_16').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_1_q_16_ctrlQuestion_txt_16').fill(`RUG ${getRandomInt(1,100)}`);
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - Services, Costs, and Rates
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_17_ddl_17').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_17_q_18_ddl_18').selectOption(`${getRandomInt(1,2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_17_q_19_ctrlQuestion_txt_19').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_17_q_19_ctrlQuestion_txt_19').fill(`${getRandomInt(111111, 999999)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_17_q_20_ctrlQuestion_txt_20').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_17_q_20_ctrlQuestion_txt_20').fill('12');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_17_q_198_ctrlQuestion_txt_198').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_17_q_233_ctrlQuestion_txt_233').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_17_q_233_ctrlQuestion_txt_233').fill('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_17_q_198_ctrlQuestion_txt_198').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_17_q_233_q_234_ctrlQuestion_txt_234').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_23_ddl_23').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_23_q_24_ddl_24').selectOption(`${getRandomInt(1,2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_23_q_25_ctrlQuestion_txt_25').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_23_q_25_ctrlQuestion_txt_25').fill(`${getRandomInt(111111, 999999)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_23_q_26_ctrlQuestion_txt_26').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_23_q_26_ctrlQuestion_txt_26').fill('12');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_23_q_200_ctrlQuestion_txt_200').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_23_q_27_ctrlQuestion_txt_27').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_23_q_27_ctrlQuestion_txt_27').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_29_ddl_29').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_35_ddl_35').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_41_ddl_41').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_47_ddl_47').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_53_ddl_53').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_59_ddl_59').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_65_ddl_65').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_69_ddl_69').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_73_ddl_73').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_77_ddl_77').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_83_ddl_83').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_89_ddl_89').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_95_ddl_95').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_101_ddl_101').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_107_ddl_107').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_113_ddl_113').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_119_ddl_119').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_125_ddl_125').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_131_ddl_131').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_137_ddl_137').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_143_ddl_143').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_149_ddl_149').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_155_ddl_155').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_161_ddl_161').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_167_ddl_167').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_173_ddl_173').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_179_ddl_179').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_185_ddl_185').selectOption('2');
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - Summary: Services, Costs and Rates
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_4_q_236_ddl_236').selectOption(`${getRandomInt(1,3)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_4_q_237_ctrlQuestion_txt_237').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_4_q_237_ctrlQuestion_txt_237').fill(`Test Automation ${getRandomInt(1,3)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_4_q_238_ctrlQuestion_txt_238').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_4_q_238_ctrlQuestion_txt_238').fill(getRandomInt(15000, 30000).toString());
    await page1.getByRole('radio', { name: 'Community First' }).check();
    await page1.getByRole('radio', { name: 'English' }).check();
    await page1.getByRole('checkbox', { name: 'Yes' }).check();
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page -  Final Page

    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
  //  await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();


    const continuebtn = page1.locator('#cphBody_cphButtonsBottom_btnContinue2');
    // const continuebtn1 = page1.locator('#cphBody_cphButtonsBottom_btnContinue2');
    // const continuebtn2 = page1.locator('#cphBody_cphButtonsBottom_btnContinue2');

    if (await continuebtn.isVisible()) {
      await continuebtn.click();
    }; 
    

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
