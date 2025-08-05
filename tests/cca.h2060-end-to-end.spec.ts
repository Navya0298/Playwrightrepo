import { test, expect } from '@playwright/test';
import { SearchMemberBySubscriberID, SearchForm, TakeRetakeRestartAssessment } from '../helper-cca';
import { getRegion } from '../utils';

/* Note!
    We can make the script more smart in terms of data population based on goals and profiles
    That will potential open opportunities to generate any kind of data for the form and make testing effort more efficient 
    data population happens thru UI like a user interaction and each component of the CCA system can be validated, 
    e.g. we can search member, we able to interact with a database data via UI, we can save data, etc.
    
    More important fact that this script can be run manually or as a part of CI/CD process on dayly or hourly basis to validate the current state of the system.
    Key benefits:
      mimic user actions
      faster and can be run/executed at any time
      easy to manage (to reduce cognitive load the script contains bare minimum and straght forward implementation)
      can be scaled
      data-driven

    TODO:
      make script smart (based on flag populate all avaialble fileds or random populate data across the form)
      do not forget to review steps to make the script more robust (do it for each iteration)
*/

const targetSystemUrl = `https://ccar${getRegion()}.cfhp.com/customlogin/winsso/Default.aspx`;

// Data that drives the test
[
  { subscriberId: 'A0100426200', formId: 'H2060' },
  { subscriberId: 'A0118679300', formId: 'H2060' },
  { subscriberId: 'A0101530900', formId: 'H2060' },
  { subscriberId: '611241121' , formId: 'H2060'},
  { subscriberId: 'A0109935500', formId: 'H2060' },
  { subscriberId: 'A0000706601', formId: 'H2060' },
  { subscriberId: 'A0002948700', formId: 'H2060'},
  { subscriberId: '728590748', formId: 'h2060'},
  { subscriberId: 'A0064191203', formId: 'h2060'},
  { subscriberId: '736149431', formId: 'h2060'},
  { subscriberId: '708731586', formId: 'h2060' }
].forEach(( { subscriberId, formId }) => {

  test(`CCA - ${formId} End-To-End for Subscriber ${subscriberId}`, {
    tag: ['@end-to-end', '@cca', '@h2060']
  }, async ({ page }) => {
    expect(targetSystemUrl, 'Missing Target System URL').toBeDefined();
    expect(subscriberId, 'SubscriberId is missing').toBeDefined();
    expect(formId, 'FormId is missing').toBeDefined();
    test.setTimeout(130_000);

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

    // page - Demographic
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_1_q_4_ctrlQuestion_txt_4').focus();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_1_q_4_ctrlQuestion_txt_4').clear();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_1_q_4_ctrlQuestion_txt_4').fill(subscriberId);
    await page1.getByRole('img', { name: '...' }).click();
    await page1.getByTitle('Today').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_1_q_6_ctrlQuestion_txt_6').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_1_q_6_ctrlQuestion_txt_6').fill('TST123456');
    // await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_1_q_7_ctrlQuestion_txt_7').click();       // For some reason we have an issue here
    // await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_1_q_7_ctrlQuestion_txt_7').fill('123456');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_1_q_8_ctrlQuestion_txt_8').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_1_q_8_ctrlQuestion_txt_8').fill(`Test Automation: Demografic ${subscriberId} ${new Date().toISOString()}`);
  
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
    
    // page - Functional Assessment
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - 01 Bathing
    await page1.getByRole('checkbox', { name: 'Drawing water' }).check();
    await page1.getByRole('checkbox', { name: 'Laying out supplies' }).check();
    await page1.getByRole('checkbox', { name: 'Standby assistance for safety' }).check();
    await page1.getByRole('cell', { name: 'Tub/shower bathing Sponge bathing Bed bathing Drying Extensive assistance in/out of tub or shower', exact: true }).getByLabel('Tub/shower bathing').check();
    await page1.getByRole('checkbox', { name: 'Sponge bathing' }).check();
    await page1.getByRole('cell', { name: 'Tub/shower bathing', exact: true }).getByLabel('Tub/shower bathing').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_3_q_12_ddl_12').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_3_q_13_ddl_13').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_3_q_14_ddl_14').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_3_q_15_ctrlQuestion_txt_15').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_3_q_15_ctrlQuestion_txt_15').fill('35');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_3_q_16_ctrlQuestion_txt_16').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_3_q_16_ctrlQuestion_txt_16').fill('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_3_q_18_ctrlQuestion_txt_18').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_3_q_18_ctrlQuestion_txt_18').fill(`Test Automation: Bathing ${subscriberId} ${new Date().toISOString()}`);
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
    
    // page - 02 Dressing
    await page1.getByRole('checkbox', { name: 'Reminding or monitoring' }).check();
    await page1.getByRole('checkbox', { name: 'May require occasional help' }).check();
    await page1.getByRole('checkbox', { name: 'Laying out clothing' }).check();
    await page1.getByRole('checkbox', { name: 'Requires assistance getting' }).check();
    await page1.getByRole('checkbox', { name: 'Always requires assistance' }).check();
    await page1.getByRole('checkbox', { name: 'Total assistance with dressing' }).check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_4_q_22_ddl_22').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_4_q_23_ddl_23').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_4_q_24_ctrlQuestion_txt_24').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_4_q_24_ctrlQuestion_txt_24').fill('20');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_4_q_25_ctrlQuestion_txt_25').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_4_q_25_ctrlQuestion_txt_25').fill('7');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_4_q_27_ctrlQuestion_txt_27').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_4_q_27_ctrlQuestion_txt_27').fill(`Test Automation: Dressing ${subscriberId} ${new Date().toISOString()}`);

    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
    
    // page - 03 Exercise
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_5_q_28_ddl_28').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_5_q_29_ctrlQuestion_txt_29').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_5_q_29_ctrlQuestion_txt_29').fill('20');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_5_q_30_ctrlQuestion_txt_30').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_5_q_30_ctrlQuestion_txt_30').fill('3');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_5_q_32_ctrlQuestion_txt_32').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_5_q_32_ctrlQuestion_txt_32').fill(`Test Automation: Exercise ${subscriberId} ${new Date().toISOString()}`);

    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
    
    // page - 04 Feeding
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_6_q_33_ddl_33').selectOption('1');
    await page1.getByRole('checkbox', { name: 'Verbal reminders/encouragement' }).check();
    await page1.getByRole('checkbox', { name: 'Standby Assistance' }).check();
    await page1.getByRole('checkbox', { name: 'Applying adaptive devices' }).check();
    await page1.getByRole('checkbox', { name: 'Spoon feeding' }).check();
    await page1.locator('span').filter({ hasText: 'Bottle feeding' }).click();
    await page1.getByRole('checkbox', { name: 'Total help with feeding' }).check();
    await page1.locator('#divHraQuestions').getByRole('cell').filter({ hasText: 'C=Caregiver P=Purchased S=' }).click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_6_q_37_ddl_37').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_6_q_38_ctrlQuestion_txt_38').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_6_q_38_ctrlQuestion_txt_38').fill('15');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_6_q_39_ctrlQuestion_txt_39').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_6_q_39_ctrlQuestion_txt_39').fill('21');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_6_q_42_ctrlQuestion_txt_42').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_6_q_42_ctrlQuestion_txt_42').fill(`Test Automation: Feeding ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // apge - 05 Grooming
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_7_q_43_ddl_43').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_7_q_44_chk_44_0').click();
    await page1.getByRole('checkbox', { name: 'Shaving', exact: true }).check();
    await page1.getByRole('checkbox', { name: 'Brushing teeth' }).check();
    await page1.getByRole('checkbox', { name: 'Shaving legs, underarms' }).check();
    await page1.getByRole('checkbox', { name: 'Caring for nails' }).check();
    await page1.getByRole('checkbox', { name: 'Total help with grooming' }).check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_7_q_47_ctrlQuestion_txt_47').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_7_q_47_ctrlQuestion_txt_47').fill('10');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_7_q_48_ctrlQuestion_txt_48').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_7_q_48_ctrlQuestion_txt_48').fill('3');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_7_q_50_chk_50_0').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_7_q_50_chk_50_1').click();
    await page1.getByRole('checkbox', { name: 'Combing/brushing hair' }).check();
    await page1.getByRole('checkbox', { name: 'Applying non-prescription lotion to skin' }).check();
    await page1.getByRole('checkbox', { name: 'Washing hair' }).check();
    await page1.getByRole('checkbox', { name: 'Drying hair' }).check();
    await page1.getByRole('checkbox', { name: 'Setting/rolling/braiding hair' }).check();
    await page1.getByRole('checkbox', { name: 'Total help with routine hair' }).check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_7_q_53_ddl_53').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_7_q_54_ctrlQuestion_txt_54').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_7_q_54_ctrlQuestion_txt_54').fill('5');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_7_q_55_ctrlQuestion_txt_55').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_7_q_55_ctrlQuestion_txt_55').fill('4');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_7_q_57_ctrlQuestion_txt_57').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_7_q_57_ctrlQuestion_txt_57').fill(`Test Automation: Grooming ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - 06-07 Toileting and Hygiene
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_8_q_58_ddl_58').selectOption('1');
    await page1.getByRole('checkbox', { name: 'Preparing toileting supplies/' }).check();
    await page1.getByRole('checkbox', { name: 'Assisting with clothing' }).check();
    await page1.getByRole('checkbox', { name: 'Occasional help with cleaning' }).check();
    await page1.getByRole('checkbox', { name: 'Assisting on/off bedpan' }).check();
    await page1.getByRole('checkbox', { name: 'Assisting with the use of' }).check();
    await page1.getByRole('checkbox', { name: 'Assisting with toileting' }).check();
    await page1.getByRole('checkbox', { name: 'Assisting with feminine' }).check();
    await page1.getByRole('checkbox', { name: 'Changing diapers' }).check();
    await page1.getByRole('checkbox', { name: 'Total help with toileting' }).check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_8_q_62_ddl_62').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_8_q_64_ctrlQuestion_txt_64').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_8_q_64_ctrlQuestion_txt_64').fill('5');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_8_q_65_ctrlQuestion_txt_65').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_8_q_65_ctrlQuestion_txt_65').fill('5');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_8_q_67_ctrlQuestion_txt_67').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_8_q_67_ctrlQuestion_txt_67').fill(`Test Automation: Toileting ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_8_q_68_ddl_68').selectOption('1');
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - 08 Transfer
    await page1.getByRole('checkbox', { name: 'Helping with positioning (' }).check();
    await page1.getByRole('checkbox', { name: 'Minimal assistance in rising' }).check();
    await page1.getByRole('checkbox', { name: 'Standby assistance' }).check();
    await page1.getByRole('checkbox', { name: 'Non-ambulatory movement from' }).check();
    await page1.getByRole('checkbox', { name: 'Hands-on assistance with' }).check();
    await page1.getByRole('checkbox', { name: 'Total assistance with' }).check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_9_q_77_ddl_77').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_9_q_78_ddl_78').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_9_q_80_ctrlQuestion_txt_80').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_9_q_80_ctrlQuestion_txt_80').fill('15');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_9_q_181_ctrlQuestion_txt_181').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_9_q_181_ctrlQuestion_txt_181').fill('3');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_9_q_83_ctrlQuestion_txt_83').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_9_q_83_ctrlQuestion_txt_83').fill(`Test Automation: Transfer ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - 09 Walking (Ambulation)
    await page1.getByRole('checkbox', { name: 'Standby assistance with' }).check();
    await page1.getByRole('checkbox', { name: 'Assistance with putting on' }).check();
    await page1.getByRole('checkbox', { name: 'Steadying in walking/using' }).check();
    await page1.getByRole('checkbox', { name: 'Assistance with wheelchair ambulation', exact: true }).check();
    await page1.getByRole('checkbox', { name: 'Total assistance with' }).check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_10_q_87_ddl_87').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_10_q_88_ddl_88').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_10_q_89_ctrlQuestion_txt_89').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_10_q_89_ctrlQuestion_txt_89').fill('15');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_10_q_90_ctrlQuestion_txt_90').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_10_q_90_ctrlQuestion_txt_90').fill('4');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_10_q_92_ctrlQuestion_txt_92').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_10_q_92_ctrlQuestion_txt_92').fill(`Test Automation: Walking ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page -  10 Cleaning
    await page1.getByRole('checkbox', { name: 'Minimal assistance with' }).check();
    await page1.getByRole('checkbox', { name: 'Make bed' }).check();
    await page1.getByRole('checkbox', { name: 'Cleaning up after personal' }).check();
    await page1.getByRole('checkbox', { name: 'Cleaning bathroom' }).check();
    await page1.getByRole('checkbox', { name: 'Changing bed linens' }).check();
    await page1.getByRole('checkbox', { name: 'Cleaning stove top, counters' }).check();
    await page1.getByRole('checkbox', { name: 'Total assistance cleaning' }).check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_11_q_96_ddl_96').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_11_q_97_ddl_97').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_11_q_98_ctrlQuestion_txt_98').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_11_q_98_ctrlQuestion_txt_98').fill('15');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_11_q_99_ctrlQuestion_txt_99').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_11_q_99_ctrlQuestion_txt_99').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_11_q_101_ctrlQuestion_txt_101').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_11_q_101_ctrlQuestion_txt_101').fill(`Test Automation: Cleaning ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - 11 Laundry
    await page1.getByRole('checkbox', { name: 'Minimal Assistance' }).check();
    await page1.getByRole('checkbox', { name: 'Light hand washing' }).check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_12_q_103_ddl_103').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_12_q_104_ddl_104').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_12_q_105_ddl_105').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_12_q_106_ddl_106').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_12_q_107_ctrlQuestion_txt_107').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_12_q_107_ctrlQuestion_txt_107').fill('4');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_12_q_107_ctrlQuestion_txt_107').dblclick();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_12_q_107_ctrlQuestion_txt_107').fill('15');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_12_q_108_ctrlQuestion_txt_108').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_12_q_108_ctrlQuestion_txt_108').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_12_q_110_ctrlQuestion_txt_110').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_12_q_110_ctrlQuestion_txt_110').fill(`Test Automation: Laundry ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - 12 Meal Preparation
    await page1.getByRole('checkbox', { name: 'Yes, meals are purchased' }).check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_233_ctrlQuestion_txt_233').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_233_ctrlQuestion_txt_233').fill('10');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_234_ctrlQuestion_txt_234').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_234_ctrlQuestion_txt_234').fill('7');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_236_ctrlQuestion_rdo236_0').focus();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_236_ctrlQuestion_rdo236_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_237_ctrlQuestion_txt_237').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_237_ctrlQuestion_txt_237').fill('15');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_238_ctrlQuestion_txt_238').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_238_ctrlQuestion_txt_238').fill('7');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_240_ctrlQuestion_rdo240_0').focus();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_240_ctrlQuestion_rdo240_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_241_ctrlQuestion_txt_241').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_241_ctrlQuestion_txt_241').fill('10');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_242_ctrlQuestion_txt_242').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_242_ctrlQuestion_txt_242').fill('6');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_244_ctrlQuestion_rdo244_0').focus();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_244_ctrlQuestion_rdo244_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_245_ctrlQuestion_txt_245').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_245_ctrlQuestion_txt_245').fill('5');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_246_ctrlQuestion_txt_246').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_246_ctrlQuestion_txt_246').fill('3');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_246_ctrlQuestion_txt_246').press('Enter');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_248_ctrlQuestion_rdo248_0').focus();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_248_ctrlQuestion_rdo248_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_248_q_249_q_250_ctrlQuestion_txt_250').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_248_q_249_q_250_ctrlQuestion_txt_250').fill('15');
    await page1.getByRole('checkbox', { name: 'Warming, cutting, serving' }).check();
    await page1.getByRole('checkbox', { name: 'Meal planning' }).check();
    await page1.getByRole('checkbox', { name: 'Helping prepare meals' }).check();
    await page1.getByRole('checkbox', { name: 'Lunch' }).check();
    await page1.getByRole('checkbox', { name: 'Breakfast', exact: true }).check();
    await page1.getByRole('checkbox', { name: 'Supper' }).check();
    await page1.getByRole('checkbox', { name: 'Cooking full meal. Indicate' }).check();
    await page1.getByRole('checkbox', { name: 'Total assistance with meal' }).check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_115_ddl_115').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_116_ddl_116').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_201_ctrlQuestion_txt_201').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_201_ctrlQuestion_txt_201').fill('30');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_119_ctrlQuestion_txt_119').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_119_ctrlQuestion_txt_119').fill('21');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_121_ctrlQuestion_txt_121').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_121_ctrlQuestion_txt_121').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_13_q_121_ctrlQuestion_txt_121').fill(`Test Automation: Meal Prep ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - 13 Escort
    await page1.getByRole('checkbox', { name: 'Arrange for transportation' }).check();
    await page1.getByRole('checkbox', { name: 'Accompanying individual to' }).check();
    await page1.getByRole('checkbox', { name: 'Waiting with the individual' }).check();
    await page1.getByRole('checkbox', { name: 'Accompanying individual to' }).uncheck();
    await page1.getByRole('checkbox', { name: 'Waiting with the individual' }).uncheck();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_14_q_262_q_263_ddl_263').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_14_q_124_ctrlQuestion_txt_124').fill('45');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_14_q_125_ctrlQuestion_txt_125').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_14_q_125_ctrlQuestion_txt_125').fill('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_14_q_127_ctrlQuestion_txt_127').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_14_q_127_ctrlQuestion_txt_127').fill(`Test Automation: Escort ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
    
    // page - 14 Shopping
    await page1.getByRole('checkbox', { name: 'Preparing a shopping list' }).check();
    await page1.getByRole('checkbox', { name: 'Picking up extra items' }).check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_15_q_129_cphBody_cphContent_HRAWizard1_500575_P_15_q_129_chk_129 div').filter({ hasText: 'Going to the store and' }).click();
    await page1.getByRole('checkbox', { name: 'Picking up medications' }).check();
    await page1.getByRole('checkbox', { name: 'Total assistance with shopping' }).check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_15_q_131_ddl_131').selectOption('0');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_15_q_132_ddl_132').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_15_q_133_ctrlQuestion_txt_133').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_15_q_133_ctrlQuestion_txt_133').fill('30');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_15_q_134_ctrlQuestion_txt_134').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_15_q_134_ctrlQuestion_txt_134').fill('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_15_q_136_ctrlQuestion_txt_136').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_15_q_134_ctrlQuestion_txt_134').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_15_q_134_ctrlQuestion_txt_134').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_15_q_134_q_224_ctrlQuestion_txt_224').dblclick();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_15_q_136_ctrlQuestion_txt_136').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_15_q_136_ctrlQuestion_txt_136').fill(`Test Automation: Shopping ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - 15 Assistance with Medications
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_16_q_137_ddl_137').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_16_q_138_ddl_138').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_16_q_139_ddl_139').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_16_q_143_ctrlQuestion_txt_143').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_16_q_143_ctrlQuestion_txt_143').fill(`Test Automation: Assistance with Meds ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - 16 Trim Nails
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_17_q_144_ddl_144').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_17_q_145_ddl_145').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_17_q_146_ctrlQuestion_txt_146').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_17_q_146_ctrlQuestion_txt_146').fill(`Test Automation: Trim Nails ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - 17 Balance
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_18_q_147_ddl_147').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_18_q_148_ddl_148').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_18_q_149_ctrlQuestion_txt_149').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_18_q_149_ctrlQuestion_txt_149').fill(`Test Automation: Balance ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - 18 Open Jars, etc.
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_19_q_150_ddl_150').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_19_q_151_ddl_151').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_19_q_152_ctrlQuestion_txt_152').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_19_q_152_ctrlQuestion_txt_152').fill(`Test Automation: Jar ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - 19 Telephone
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_20_q_153_ddl_153').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_20_q_154_ddl_154').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_20_q_155_ctrlQuestion_txt_155').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_20_q_155_ctrlQuestion_txt_155').fill(`Test Automation Telephone ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - Additional PAS Questions
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_21_q_156_ddl_156').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_21_q_157_ddl_157').focus();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_21_q_157_ddl_157').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_21_q_157_q_206_ddl_206').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_21_q_157_q_207_ddl_207').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_21_q_157_q_208_ddl_208').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_21_q_157_q_209_ddl_209').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_21_q_194_ddl_194').selectOption('0');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_21_q_195_ddl_195').selectOption('0');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_21_q_196_ddl_196').selectOption('0');
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - Summary - PAS
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_26_q_215_q_228_q_229_ctrlQuestion_txt_229').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_26_q_215_q_228_q_229_ctrlQuestion_txt_229').fill('30');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_26_q_218_ddl_218').selectOption('1');
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page -  A&A
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_22_q_166_ctrlQuestion_txt_166').focus();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_22_q_166_ctrlQuestion_txt_166').fill('250');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_22_q_166_ctrlQuestion_txt_166').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_22_q_204_ctrlQuestion_txt_204').focus();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_22_q_204_ctrlQuestion_txt_204').fill('4');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_22_q_166_ctrlQuestion_txt_166').focus();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_22_q_204_q_231_q_232_ctrlQuestion_txt_232').focus();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_22_q_204_q_231_q_232_ctrlQuestion_txt_232').fill('15');
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - Additional Comments
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_23_q_169_ctrlQuestion_txt_169').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_23_q_169_ctrlQuestion_txt_169').fill(`Test Automation: ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_23_q_170_ctrlQuestion_txt_170').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_23_q_170_ctrlQuestion_txt_170').fill('Baur Urazalinov');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_23_q_171_ctrlQuestion_txt_171').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_23_q_171_ctrlQuestion_txt_171').fill('BU');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_23_q_171_ctrlQuestion_txt_171').press('Tab');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_23_q_172_ctrlQuestion_txt_172').fill('IP');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_23_q_172_ctrlQuestion_txt_172').press('Tab');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_23_q_173_ctrlQuestion_txt_173').fill('IP');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_23_q_172_ctrlQuestion_txt_172').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500575_P_23_q_172_ctrlQuestion_txt_172').fill('Imran');
    await page1.getByRole('checkbox', { name: 'Email OK' }).check();
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - Stop for Review and Approval
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
