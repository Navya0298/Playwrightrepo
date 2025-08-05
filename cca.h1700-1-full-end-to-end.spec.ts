import { test, expect } from '@playwright/test';
import { SearchMemberBySubscriberID, SearchForm, TakeRetakeRestartAssessment } from '../helper-cca';
import { getRandomInt, getFutureDate, getRegion } from '../utils';

const targetSystemUrl = `https://ccar${getRegion()}.cfhp.com/customlogin/winsso/Default.aspx`;

// Data that drives the test
[
  { subscriberId: 'A0100426200', formId: 'H1700-1' },
  { subscriberId: 'A0064191203', formId: 'H1700-1'},
  { subscriberId: '728590748', formId: 'h1700-1'},
  { subscriberId: 'A0118679300', formId: 'H1700-1'},
  { subscriberId: '526178307', formId: 'H1700-1'},
  { subscriberId: '270501401', formId: 'H1700-1'},

].forEach(( { subscriberId, formId }) => {
  // That test will select all possible selections for form H1700-1
  test(`CCA - ${formId} full End-To-End for Subscriber ${subscriberId}`, {
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
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_1_q_9_dt9').fill(`${getFutureDate(90)}`);
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
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_29_ddl_29').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_29_q_30_ddl_30').selectOption(`${getRandomInt(1,2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_29_q_31_ctrlQuestion_txt_31').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_29_q_31_ctrlQuestion_txt_31').fill(`${getRandomInt(111111, 999999)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_29_q_32_ctrlQuestion_txt_32').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_29_q_32_ctrlQuestion_txt_32').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_29_q_33_ctrlQuestion_txt_33').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_29_q_33_ctrlQuestion_txt_33').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_29_q_31_ctrlQuestion_txt_31').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_29_q_33_q_208_ctrlQuestion_txt_208').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_35_ddl_35').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_35_q_36_ddl_36').selectOption(`${getRandomInt(1,2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_35_q_37_ctrlQuestion_txt_37').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_35_q_37_ctrlQuestion_txt_37').fill(`${getRandomInt(111111, 999999)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_35_q_38_ctrlQuestion_txt_38').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_35_q_38_ctrlQuestion_txt_38').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_35_q_39_ctrlQuestion_txt_39').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_35_q_39_ctrlQuestion_txt_39').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_35_q_37_ctrlQuestion_txt_37').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_41_ddl_41').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_41_ddl_41').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_41_q_42_ddl_42').selectOption(`${getRandomInt(1,2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_41_q_43_ctrlQuestion_txt_43').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_41_q_43_ctrlQuestion_txt_43').fill(`${getRandomInt(111111, 999999)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_41_q_44_ctrlQuestion_txt_44').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_41_q_44_ctrlQuestion_txt_44').fill('12');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_41_q_45_ctrlQuestion_txt_45').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_41_q_45_ctrlQuestion_txt_45').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_41_q_43_ctrlQuestion_txt_43').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_47_ddl_47').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_47_ddl_47').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_47_q_48_ddl_48').selectOption(`${getRandomInt(1,2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_47_q_49_ctrlQuestion_txt_49').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_47_q_49_ctrlQuestion_txt_49').fill(`${getRandomInt(111111, 999999)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_47_q_50_ctrlQuestion_txt_50').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_47_q_50_ctrlQuestion_txt_50').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_47_q_51_ctrlQuestion_txt_51').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_47_q_51_ctrlQuestion_txt_51').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_47_q_49_ctrlQuestion_txt_49').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_53_ddl_53').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_53_ddl_53').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_53_q_54_ddl_54').selectOption(`${getRandomInt(1,2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_53_q_55_ctrlQuestion_txt_55').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_53_q_55_ctrlQuestion_txt_55').fill(`${getRandomInt(111111, 999999)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_53_q_56_ctrlQuestion_txt_56').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_53_q_56_ctrlQuestion_txt_56').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_53_q_57_ctrlQuestion_txt_57').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_53_q_57_ctrlQuestion_txt_57').fill('1');
     await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_53_q_55_ctrlQuestion_txt_55').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_59_ddl_59').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_59_ddl_59').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_59_q_60_ddl_60').selectOption(`${getRandomInt(1,2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_59_q_61_ctrlQuestion_txt_61').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_59_q_61_ctrlQuestion_txt_61').fill(`${getRandomInt(111111, 999999)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_59_q_62_ctrlQuestion_txt_62').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_59_q_62_ctrlQuestion_txt_62').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_59_q_63_ctrlQuestion_txt_63').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_59_q_63_ctrlQuestion_txt_63').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_59_q_61_ctrlQuestion_txt_61').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_65_ddl_65').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_65_ddl_65').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_65_q_66_ddl_66').selectOption(`${getRandomInt(1,2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_65_q_67_ctrlQuestion_txt_67').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_65_q_67_ctrlQuestion_txt_67').fill(`${getRandomInt(111111, 999999)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_65_q_68_ctrlQuestion_txt_68').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_65_q_68_ctrlQuestion_txt_68').fill('200');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_69_ddl_69').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_69_q_70_ddl_70').selectOption(`${getRandomInt(1,2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_69_q_71_ctrlQuestion_txt_71').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_69_q_71_ctrlQuestion_txt_71').fill(`${getRandomInt(111111, 999999)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_69_q_72_ctrlQuestion_txt_72').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_69_q_72_ctrlQuestion_txt_72').fill('200');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_73_ddl_73').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_73_q_74_ddl_74').selectOption(`${getRandomInt(1,2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_73_q_75_ctrlQuestion_txt_75').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_73_q_75_ctrlQuestion_txt_75').fill(`${getRandomInt(111111, 999999)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_73_q_76_ctrlQuestion_txt_76').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_73_q_76_ctrlQuestion_txt_76').fill('200');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_77_ddl_77').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_77_q_78_ddl_78').selectOption(`${getRandomInt(1,2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_77_q_79_ctrlQuestion_txt_79').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_77_q_79_ctrlQuestion_txt_79').fill(`${getRandomInt(111111, 999999)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_77_q_80_ctrlQuestion_txt_80').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_77_q_80_ctrlQuestion_txt_80').fill('12');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_77_q_201_ctrlQuestion_txt_201').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_77_q_81_ctrlQuestion_txt_81').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_77_q_81_ctrlQuestion_txt_81').fill('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_77_q_79_ctrlQuestion_txt_79').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_83_ddl_83').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_83_ddl_83').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_83_q_84_ddl_84').selectOption(`${getRandomInt(1,2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_83_q_85_ctrlQuestion_txt_85').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_83_q_85_ctrlQuestion_txt_85').fill(`${getRandomInt(111111, 999999)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_83_q_86_ctrlQuestion_txt_86').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_83_q_86_ctrlQuestion_txt_86').fill('12');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_83_q_202_ctrlQuestion_txt_202').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_83_q_87_ctrlQuestion_txt_87').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_83_q_87_ctrlQuestion_txt_87').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_83_q_85_ctrlQuestion_txt_85').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_89_ddl_89').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_89_ddl_89').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_89_q_90_ddl_90').selectOption(`${getRandomInt(1,2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_89_q_91_ctrlQuestion_txt_91').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_89_q_91_ctrlQuestion_txt_91').fill(`${getRandomInt(111111, 999999)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_89_q_92_ctrlQuestion_txt_92').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_89_q_92_ctrlQuestion_txt_92').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_89_q_203_ctrlQuestion_txt_203').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_89_q_93_ctrlQuestion_txt_93').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_89_q_93_ctrlQuestion_txt_93').fill('1');
     await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_89_q_91_ctrlQuestion_txt_91').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_95_ddl_95').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_95_ddl_95').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_95_q_96_ddl_96').selectOption(`${getRandomInt(1,2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_95_q_97_ctrlQuestion_txt_97').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_95_q_97_ctrlQuestion_txt_97').fill(`${getRandomInt(111111, 999999)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_95_q_98_ctrlQuestion_txt_98').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_95_q_98_ctrlQuestion_txt_98').fill('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_95_q_204_ctrlQuestion_txt_204').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_95_q_99_ctrlQuestion_txt_99').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_95_q_99_ctrlQuestion_txt_99').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_95_q_97_ctrlQuestion_txt_97').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_101_ddl_101').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_101_ddl_101').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_101_q_102_ddl_102').selectOption(`${getRandomInt(1,2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_101_q_103_ctrlQuestion_txt_103').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_101_q_103_ctrlQuestion_txt_103').fill(`${getRandomInt(111111, 999999)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_101_q_104_ctrlQuestion_txt_104').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_101_q_104_ctrlQuestion_txt_104').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_101_q_205_ctrlQuestion_txt_205').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_101_q_105_ctrlQuestion_txt_105').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_101_q_105_ctrlQuestion_txt_105').fill('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_101_q_103_ctrlQuestion_txt_103').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_107_ddl_107').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_107_ddl_107').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_107_q_108_ddl_108').selectOption(`${getRandomInt(1,2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_107_q_109_ctrlQuestion_txt_109').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_107_q_109_ctrlQuestion_txt_109').fill(`${getRandomInt(111111, 999999)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_107_q_110_ctrlQuestion_txt_110').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_107_q_110_ctrlQuestion_txt_110').fill('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_107_q_111_ctrlQuestion_txt_111').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_107_q_111_ctrlQuestion_txt_111').fill('4');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_107_q_109_ctrlQuestion_txt_109').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_113_ddl_113').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_113_ddl_113').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_113_q_114_ddl_114').selectOption(`${getRandomInt(1,2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_113_q_115_ctrlQuestion_txt_115').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_113_q_115_ctrlQuestion_txt_115').fill(`${getRandomInt(111111, 999999)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_113_q_116_ctrlQuestion_txt_116').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_113_q_116_ctrlQuestion_txt_116').fill('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_113_q_117_ctrlQuestion_txt_117').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_113_q_117_ctrlQuestion_txt_117').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_113_q_115_ctrlQuestion_txt_115').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_119_ddl_119').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_119_ddl_119').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_119_q_120_ddl_120').selectOption(`${getRandomInt(1,2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_119_q_121_ctrlQuestion_txt_121').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_119_q_121_ctrlQuestion_txt_121').fill(`${getRandomInt(111111, 999999)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_119_q_122_ctrlQuestion_txt_122').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_119_q_122_ctrlQuestion_txt_122').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_119_q_123_ctrlQuestion_txt_123').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_119_q_123_ctrlQuestion_txt_123').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_119_q_121_ctrlQuestion_txt_121').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_125_ddl_125').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_125_ddl_125').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_125_q_126_ddl_126').selectOption(`${getRandomInt(1,2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_125_q_127_ctrlQuestion_txt_127').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_125_q_127_ctrlQuestion_txt_127').fill(`${getRandomInt(111111, 999999)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_125_q_128_ctrlQuestion_txt_128').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_125_q_128_ctrlQuestion_txt_128').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_125_q_129_ctrlQuestion_txt_129').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_125_q_129_ctrlQuestion_txt_129').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_125_q_127_ctrlQuestion_txt_127').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_131_ddl_131').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_131_ddl_131').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_131_q_132_ddl_132').selectOption(`${getRandomInt(1,2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_131_q_133_ctrlQuestion_txt_133').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_131_q_133_ctrlQuestion_txt_133').fill(`${getRandomInt(111111, 999999)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_131_q_134_ctrlQuestion_txt_134').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_131_q_134_ctrlQuestion_txt_134').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_131_q_135_ctrlQuestion_txt_135').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_131_q_135_ctrlQuestion_txt_135').fill('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_131_q_133_ctrlQuestion_txt_133').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_137_ddl_137').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_137_ddl_137').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_137_q_138_ddl_138').selectOption(`${getRandomInt(1,2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_137_q_139_ctrlQuestion_txt_139').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_137_q_139_ctrlQuestion_txt_139').fill(`${getRandomInt(111111, 999999)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_137_q_140_ctrlQuestion_txt_140').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_137_q_140_ctrlQuestion_txt_140').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_137_q_141_ctrlQuestion_txt_141').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_137_q_141_ctrlQuestion_txt_141').fill('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_137_q_139_ctrlQuestion_txt_139').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_143_ddl_143').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_143_ddl_143').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_143_q_144_ddl_144').selectOption(`${getRandomInt(1,2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_143_q_145_ctrlQuestion_txt_145').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_143_q_145_ctrlQuestion_txt_145').fill(`${getRandomInt(111111, 999999)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_143_q_146_ctrlQuestion_txt_146').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_143_q_146_ctrlQuestion_txt_146').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_143_q_147_ctrlQuestion_txt_147').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_143_q_147_ctrlQuestion_txt_147').fill('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_143_q_145_ctrlQuestion_txt_145').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_149_ddl_149').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_149_ddl_149').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_149_q_150_ddl_150').selectOption(`${getRandomInt(1,2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_149_q_151_ctrlQuestion_txt_151').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_149_q_151_ctrlQuestion_txt_151').fill(`${getRandomInt(111111, 999999)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_149_q_152_ctrlQuestion_txt_152').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_149_q_152_ctrlQuestion_txt_152').fill('12');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_149_q_153_ctrlQuestion_txt_153').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_149_q_153_ctrlQuestion_txt_153').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_149_q_151_ctrlQuestion_txt_151').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_155_ddl_155').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_155_ddl_155').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_155_q_156_ddl_156').selectOption(`${getRandomInt(1,2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_155_q_157_ctrlQuestion_txt_157').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_155_q_157_ctrlQuestion_txt_157').fill(`${getRandomInt(111111, 999999)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_155_q_158_ctrlQuestion_txt_158').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_155_q_158_ctrlQuestion_txt_158').fill('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_155_q_159_ctrlQuestion_txt_159').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_155_q_159_ctrlQuestion_txt_159').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_155_q_157_ctrlQuestion_txt_157').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_161_ddl_161').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_161_ddl_161').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_161_q_162_ddl_162').selectOption(`${getRandomInt(1,2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_161_q_163_ctrlQuestion_txt_163').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_161_q_163_ctrlQuestion_txt_163').fill(`${getRandomInt(111111, 999999)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_161_q_164_ctrlQuestion_txt_164').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_161_q_164_ctrlQuestion_txt_164').fill('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_161_q_165_ctrlQuestion_txt_165').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_161_q_165_ctrlQuestion_txt_165').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_161_q_163_ctrlQuestion_txt_163').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_167_ddl_167').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_167_ddl_167').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_167_q_168_ddl_168').selectOption(`${getRandomInt(1,2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_167_q_169_ctrlQuestion_txt_169').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_167_q_169_ctrlQuestion_txt_169').fill(`${getRandomInt(111111, 999999)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_167_q_170_ctrlQuestion_txt_170').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_167_q_170_ctrlQuestion_txt_170').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_167_q_171_ctrlQuestion_txt_171').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_167_q_171_ctrlQuestion_txt_171').fill('12');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_167_q_169_ctrlQuestion_txt_169').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_173_ddl_173').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_173_ddl_173').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_173_q_174_ddl_174').selectOption(`${getRandomInt(1,2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_173_q_175_ctrlQuestion_txt_175').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_173_q_175_ctrlQuestion_txt_175').fill(`${getRandomInt(111111, 999999)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_173_q_176_ctrlQuestion_txt_176').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_173_q_176_ctrlQuestion_txt_176').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_173_q_177_ctrlQuestion_txt_177').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_173_q_177_ctrlQuestion_txt_177').fill('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_173_q_175_ctrlQuestion_txt_175').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_179_ddl_179').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_179_ddl_179').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_179_q_180_ddl_180').selectOption(`${getRandomInt(1,2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_179_q_181_ctrlQuestion_txt_181').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_179_q_181_ctrlQuestion_txt_181').fill(`${getRandomInt(111111, 999999)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_179_q_182_ctrlQuestion_txt_182').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_179_q_182_ctrlQuestion_txt_182').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_179_q_183_ctrlQuestion_txt_183').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_179_q_183_ctrlQuestion_txt_183').fill('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_179_q_181_ctrlQuestion_txt_181').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_185_ddl_185').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_185_ddl_185').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_185_q_186_ddl_186').selectOption(`${getRandomInt(1,2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_185_q_187_ctrlQuestion_txt_187').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_185_q_187_ctrlQuestion_txt_187').fill(`${getRandomInt(111111, 999999)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_185_q_188_ctrlQuestion_txt_188').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_185_q_188_ctrlQuestion_txt_188').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_185_q_189_ctrlQuestion_txt_189').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_185_q_189_ctrlQuestion_txt_189').fill('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_2_q_185_q_187_ctrlQuestion_txt_187').click();

    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - Summary: Services, Costs and Rates
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_4_q_236_ddl_236').selectOption(`${getRandomInt(1,3)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_4_q_237_ctrlQuestion_txt_237').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_4_q_237_ctrlQuestion_txt_237').fill(`Test Automation ${getRandomInt(1,3)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_4_q_238_ctrlQuestion_txt_238').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500571_P_4_q_238_ctrlQuestion_txt_238').fill(getRandomInt(15000, 30000).toString());
    await page1.getByRole('radio', { name: 'Community First' }).check();
    
    const pickLang = getRandomInt(1,2);
    if (pickLang === 1) {
      await page1.getByRole('radio', { name: 'English' }).check();  
    } else {
      await page1.getByRole('radio', { name: 'Spanish' }).check();
    }

    await page1.getByRole('checkbox', { name: 'Yes' }).check();
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page -  Final Page

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
