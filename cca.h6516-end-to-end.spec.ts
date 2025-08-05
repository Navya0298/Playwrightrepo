import { test, expect } from '@playwright/test';
import { SearchMemberBySubscriberID, SearchForm, TakeRetakeRestartAssessment } from '../helper-cca';
import { getRandomInt, getFutureDate, getRegion } from '../utils';

const targetSystemUrl = `https://ccar${getRegion()}.cfhp.com/customlogin/winsso/Default.aspx`;

// Data that drives the test
[
  { subscriberId: 'A0100426200', formId: 'H6516' },
  { subscriberId: 'A0118679300', formId: 'H6516' },
  { subscriberId: '728590748', formId: 'h6516' },
  { subscriberId: 'A0038934700', formId: 'h6516' },
  { subscriberId: '716091775', formId: 'h6516' },
  { subscriberId: 'A0067562601', formId: 'h6516' },
  { subscriberId: 'A00101190401', formId: 'h6516' },
  { subscriberId: 'A0000162111', formId: 'h6516' },
  { subscriberId: '518996392', formId: 'h6516' }
].forEach(( { subscriberId, formId }) => {

  test(`CCA - ${formId} End-To-End for Subscriber ${subscriberId}`, {
    tag: ['@end-to-end', '@cca', '@h6516']
  }, async ({ page }) => {
    expect(targetSystemUrl, 'Missing Target System URL').toBeDefined();
    expect(subscriberId, 'SubscriberId is missing').toBeDefined();
    expect(formId, 'FormId is missing').toBeDefined();
    test.setTimeout(160_000);

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
    await page1.getByRole('img', { name: '...' }).click();
    await page1.getByTitle('Today').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_1_q_8_ddl_8').selectOption(`${getRandomInt(1, 3)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_1_q_9_ddl_9').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_1_q_10_ctrlQuestion_txt_10').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_1_q_10_ctrlQuestion_txt_10').fill(`Test Automation Demographics ${subscriberId} ${new Date().toISOString()}, test line`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_1_q_11_ddl_11').selectOption(`${getRandomInt(1, 3)}`);
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - Section I: Individual's Profile
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_2_q_13_ctrlQuestion_txt_13').focus();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_2_q_13_ctrlQuestion_txt_13').fill(`Test Automation: A little about myself: ${subscriberId} ${new Date().toISOString()}, test line`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_2_q_14_ctrlQuestion_txt_14').focus();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_2_q_14_ctrlQuestion_txt_14').fill(`Test Automation: What people like and admire about me: ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_2_q_15_ctrlQuestion_txt_15').focus();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_2_q_15_ctrlQuestion_txt_15').fill(`Test Automation: What's important to me: ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_2_q_16_ctrlQuestion_txt_16').focus();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_2_q_16_ctrlQuestion_txt_16').fill(`Test Automation: What others need to know and do to support me: ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_2_q_17_ctrlQuestion_txt_17').focus();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_2_q_17_ctrlQuestion_txt_17').fill(`Test Automation: What the people are like who support me best: ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_2_q_18_ctrlQuestion_txt_18').focus();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_2_q_18_ctrlQuestion_txt_18').fill(`Test Automation: How I like to spend my day: ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_2_q_19_ctrlQuestion_txt_19').focus();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_2_q_19_ctrlQuestion_txt_19').fill(`Test Automation: The services I am currently receiving are: ${subscriberId} ${new Date().toISOString()}`);
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
    
    // page - Section II: Important People in the Individual's Life
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_20_ctrlQuestion_txt_20').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_20_ctrlQuestion_txt_20').fill(`Name ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_21_ctrlQuestion_txt_21').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_21_ctrlQuestion_txt_21').fill(`Releationship ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_22_ctrlQuestion_txt_22').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_22_ctrlQuestion_txt_22').fill(`Phone ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_23_ctrlQuestion_txt_23').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_23_ctrlQuestion_txt_23').fill(`Address ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_24_ctrlQuestion_txt_24').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_24_ctrlQuestion_txt_24').fill(`City ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_25_ctrlQuestion_txt_25').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_25_ctrlQuestion_txt_25').fill(`State ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_26_ctrlQuestion_txt_26').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_26_ctrlQuestion_txt_26').fill(`Zip ${subscriberId}`);
    await page1.locator('#divNq_27 > .hracolright > .questionTable > tbody > tr > td').first().click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_27_ctrlQuestion_txt_27').fill(`Email ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_28_ctrlQuestion_txt_28').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_28_ctrlQuestion_txt_28').fill(`Test Automation: Family 1 Important Because ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_29_ctrlQuestion_txt_29').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_29_ctrlQuestion_txt_29').fill(`Name 2 ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_30_ctrlQuestion_txt_30').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_30_ctrlQuestion_txt_30').fill(`Relationship 2 ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_31_ctrlQuestion_txt_31').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_31_ctrlQuestion_txt_31').fill(`Phone 2 ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_32_ctrlQuestion_txt_32').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_32_ctrlQuestion_txt_32').fill(`Address 2 ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_33_ctrlQuestion_txt_33').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_33_ctrlQuestion_txt_33').fill(`City 2 ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_34_ctrlQuestion_txt_34').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_34_ctrlQuestion_txt_34').fill(`State 2 ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_35_ctrlQuestion_txt_35').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_35_ctrlQuestion_txt_35').fill(`Zip 2 ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_36_ctrlQuestion_txt_36').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_36_ctrlQuestion_txt_36').fill(`Email 2 ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_37_ctrlQuestion_txt_37').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_37_ctrlQuestion_txt_37').fill(`Test Automation: Family 2 Important Because ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_38_ctrlQuestion_txt_38').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_38_ctrlQuestion_txt_38').fill(`Friends name ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_39_ctrlQuestion_txt_39').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_39_ctrlQuestion_txt_39').fill(`Friends relationship ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_40_ctrlQuestion_txt_40').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_40_ctrlQuestion_txt_40').fill(`Friends phone ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_41_ctrlQuestion_txt_41').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_41_ctrlQuestion_txt_41').fill(`Friend address ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_42_ctrlQuestion_txt_42').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_42_ctrlQuestion_txt_42').fill(`Friend city ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_43_ctrlQuestion_txt_43').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_43_ctrlQuestion_txt_43').fill(`Friend state ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_44_ctrlQuestion_txt_44').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_44_ctrlQuestion_txt_44').fill(`Friend zip ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_45_ctrlQuestion_txt_45').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_45_ctrlQuestion_txt_45').fill(`Friend email ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_46_ctrlQuestion_txt_46').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_46_ctrlQuestion_txt_46').fill(`Test Automation: Friends 1 Important Because ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_47_ctrlQuestion_txt_47').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_47_ctrlQuestion_txt_47').fill(`Friend name 2 ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_48_ctrlQuestion_txt_48').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_48_ctrlQuestion_txt_48').fill(`Frined reletionship 2 ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_49_ctrlQuestion_txt_49').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_49_ctrlQuestion_txt_49').fill(`Frined phone 2 ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_50_ctrlQuestion_txt_50').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_50_ctrlQuestion_txt_50').fill(`Friend address 2 ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_51_ctrlQuestion_txt_51').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_51_ctrlQuestion_txt_51').fill(`Friend city 2 ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_52_ctrlQuestion_txt_52').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_52_ctrlQuestion_txt_52').fill(`Frined state 2 ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_53_ctrlQuestion_txt_53').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_53_ctrlQuestion_txt_53').fill(`Frined zip 2 ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_54_ctrlQuestion_txt_54').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_54_ctrlQuestion_txt_54').fill(`Friend email 2 ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_55_ctrlQuestion_txt_55').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_55_ctrlQuestion_txt_55').fill(`Test Automation: Friends 2 Important Because ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_56_ctrlQuestion_txt_56').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_56_ctrlQuestion_txt_56').fill(`Other name ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_57_ctrlQuestion_txt_57').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_57_ctrlQuestion_txt_57').fill(`Other reelathionship ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_58_ctrlQuestion_txt_58').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_58_ctrlQuestion_txt_58').fill(`Other phone ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_59_ctrlQuestion_txt_59').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_59_ctrlQuestion_txt_59').fill(`Other address ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_60_ctrlQuestion_txt_60').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_60_ctrlQuestion_txt_60').fill(`Other city ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_61_ctrlQuestion_txt_61').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_61_ctrlQuestion_txt_61').fill(`Other state ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_62_ctrlQuestion_txt_62').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_62_ctrlQuestion_txt_62').fill(`Other zip ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_63_ctrlQuestion_txt_63').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_63_ctrlQuestion_txt_63').fill(`Other email ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_64_ctrlQuestion_txt_64').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_64_ctrlQuestion_txt_64').fill(`Test Automation: School/Work/Other 1 Important Because ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_65_ctrlQuestion_txt_65').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_65_ctrlQuestion_txt_65').fill(`Other 2 name ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_66_ctrlQuestion_txt_66').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_66_ctrlQuestion_txt_66').fill(`Other 2 relationship ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_67_ctrlQuestion_txt_67').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_67_ctrlQuestion_txt_67').fill(`Other 2 phone ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_68_ctrlQuestion_txt_68').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_68_ctrlQuestion_txt_68').fill(`Other 2 address ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_69_ctrlQuestion_txt_69').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_69_ctrlQuestion_txt_69').fill(`Other 2 city ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_70_ctrlQuestion_txt_70').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_70_ctrlQuestion_txt_70').fill(`Other 2 state ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_71_ctrlQuestion_txt_71').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_71_ctrlQuestion_txt_71').fill(`Other 2 zip ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_72_ctrlQuestion_txt_72').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_72_ctrlQuestion_txt_72').fill(`Other 2 email ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_73_ctrlQuestion_txt_73').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_73_ctrlQuestion_txt_73').fill(`Test Automation: School/Work/Other 1 Important Because ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_74_ctrlQuestion_txt_74').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_74_ctrlQuestion_txt_74').fill(`Community/Other name ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_75_ctrlQuestion_txt_75').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_75_ctrlQuestion_txt_75').fill(`Community/Other relationship ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_76_ctrlQuestion_txt_76').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_76_ctrlQuestion_txt_76').fill(`Community/Other phone ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_77_ctrlQuestion_txt_77').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_77_ctrlQuestion_txt_77').fill(`Community/Other address ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_78_ctrlQuestion_txt_78').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_78_ctrlQuestion_txt_78').fill(`Community/Other city ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_79_ctrlQuestion_txt_79').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_79_ctrlQuestion_txt_79').fill(`Community/Other state ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_80_ctrlQuestion_txt_80').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_80_ctrlQuestion_txt_80').fill(`Community/Other zip ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_81_ctrlQuestion_txt_81').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_81_ctrlQuestion_txt_81').fill(`Community/Other email ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_82_ctrlQuestion_txt_82').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_82_ctrlQuestion_txt_82').fill(`Test Automation: Community/Other 1 Important Because ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_83_ctrlQuestion_txt_83').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_83_ctrlQuestion_txt_83').fill(`Community/Other 2 name ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_84_ctrlQuestion_txt_84').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_84_ctrlQuestion_txt_84').fill(`Community/Other 2 relationship ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_85_ctrlQuestion_txt_85').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_85_ctrlQuestion_txt_85').fill(`Community/Other 2 phone ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_86_ctrlQuestion_txt_86').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_86_ctrlQuestion_txt_86').fill(`Community/Other 2 address ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_87_ctrlQuestion_txt_87').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_87_ctrlQuestion_txt_87').fill(`Community/Other 2 city ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_88_ctrlQuestion_txt_88').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_88_ctrlQuestion_txt_88').fill(`Community/Other 2 state ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_89_ctrlQuestion_txt_89').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_89_ctrlQuestion_txt_89').fill(`Community/Other 2 zip ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_90_ctrlQuestion_txt_90').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_90_ctrlQuestion_txt_90').fill(`Community/Other 2 email ${subscriberId}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_91_ctrlQuestion_txt_91').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_3_q_91_ctrlQuestion_txt_91').fill(`Test Automation: Community/Other 1 Important Because ${subscriberId} ${new Date().toISOString()}`);
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
    
    // page - Section III: Living Situation
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_4_q_92_ddl_92').selectOption(`${getRandomInt(1, 3)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_4_q_93_ddl_93').selectOption(`${getRandomInt(1, 2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_4_q_94_ddl_94').selectOption(`${getRandomInt(1, 2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_4_q_95_ddl_95').selectOption(`${getRandomInt(1, 3)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_4_q_96_ddl_96').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_4_q_96_q_97_ctrlQuestion_txt_97').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_4_q_96_q_97_ctrlQuestion_txt_97').fill(`Test Automation: Other (specify) ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_4_q_98_ddl_98').selectOption(`${getRandomInt(1, 3)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_4_q_99_ddl_99').selectOption(`${getRandomInt(1, 2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_4_q_100_ddl_100').selectOption(`${getRandomInt(1, 2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_4_q_101_ddl_101').selectOption(`${getRandomInt(1, 3)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_4_q_102_ddl_102').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_4_q_104_ddl_104').selectOption(`${getRandomInt(1, 3)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_4_q_105_ddl_105').selectOption(`${getRandomInt(1, 8)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_4_q_106_ddl_106').selectOption(`${getRandomInt(1, 3)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_4_q_107_ctrlQuestion_txt_107').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_4_q_107_ctrlQuestion_txt_107').fill(`Test Automation: Notes SC Examples/Tips ${subscriberId} ${new Date().toISOString()}`);
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - Section IV: Needs Assessment
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_108_chk_108_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_108_chk_108_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_108_chk_108_2').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_109_chk_109_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_109_chk_109_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_109_chk_109_2').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_110_chk_110_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_111_ddl_111').selectOption(`${getRandomInt(1, 2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_112_ddl_112').selectOption(`${getRandomInt(0, 3)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_113_ddl_113').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_114_ctrlQuestion_txt_114').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_114_ctrlQuestion_txt_114').fill('30');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_116_ctrlQuestion_txt_116').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_116_ctrlQuestion_txt_116').fill('3');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_114_ctrlQuestion_txt_114').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_118_chk_118_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_118_chk_118_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_118_chk_118_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_118_chk_118_2').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_119_chk_119_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_119_chk_119_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_119_chk_119_2').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_120_chk_120_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_121_ddl_121').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_122_ctrlQuestion_txt_122').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_122_ctrlQuestion_txt_122').fill('10');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_123_ctrlQuestion_txt_123').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_123_ctrlQuestion_txt_123').fill('3');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_125_ctrlQuestion_txt_125').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_125_ctrlQuestion_txt_125').fill(`Test Automation: Bathing ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_126_chk_126_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_126_chk_126_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_127_chk_127_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_128_chk_128_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_128_cphBody_cphContent_HRAWizard1_500572_P_5_q_128_chk_128').getByText('Total assistance with dressing').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_129_ddl_129').selectOption(`${getRandomInt(0, 3)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_130_ddl_130').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_131_ctrlQuestion_txt_131').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_131_ctrlQuestion_txt_131').fill('10');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_132_ctrlQuestion_txt_132').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_132_ctrlQuestion_txt_132').fill('6');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_131_ctrlQuestion_txt_131').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_134_chk_134_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_134_chk_134_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_134_chk_134_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_135_chk_135_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_136_chk_136_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_137_ddl_137').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_138_ctrlQuestion_txt_138').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_138_ctrlQuestion_txt_138').fill('12');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_139_ctrlQuestion_txt_139').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_139_ctrlQuestion_txt_139').fill('4');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_141_ctrlQuestion_txt_141').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_141_ctrlQuestion_txt_141').fill(`Test Automation: Dressing ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_142_ddl_142').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_143_ctrlQuestion_txt_143').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_143_ctrlQuestion_txt_143').fill('14');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_144_ctrlQuestion_txt_144').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_144_ctrlQuestion_txt_144').fill('3');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_143_ctrlQuestion_txt_143').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_144_q_468_ctrlQuestion_txt_468').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_146_ddl_146').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_147_ctrlQuestion_txt_147').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_147_ctrlQuestion_txt_147').fill('16');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_148_ctrlQuestion_txt_148').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_148_ctrlQuestion_txt_148').fill('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_150_ctrlQuestion_txt_150').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_150_ctrlQuestion_txt_150').fill(`Test Automation: Exercise ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_151_chk_151_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_152_chk_152_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_153_chk_153_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_154_ddl_154').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_155_ctrlQuestion_txt_155').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_155_ctrlQuestion_txt_155').fill('16');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_156_ctrlQuestion_txt_156').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_156_ctrlQuestion_txt_156').fill('21');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_155_ctrlQuestion_txt_155').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_158_chk_158_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_158_chk_158_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_158_chk_158_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_159_chk_159_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_159_chk_159_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_160_chk_160_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_161_ddl_161').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_162_ctrlQuestion_txt_162').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_162_ctrlQuestion_txt_162').fill('10');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_163_ctrlQuestion_txt_163').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_163_ctrlQuestion_txt_163').fill('8');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_165_ctrlQuestion_txt_165').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_165_ctrlQuestion_txt_165').fill(`Test Automation: Feeding ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_166_ddl_166').selectOption(`${getRandomInt(0, 3)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_167_chk_167_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_167_chk_167_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_521_chk_521_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_521_chk_521_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_521_chk_521_2').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_521_chk_521_3').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_169_chk_169_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_535_ddl_535').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_170_ctrlQuestion_txt_170').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_170_ctrlQuestion_txt_170').fill('6');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_171_ctrlQuestion_txt_171').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_171_ctrlQuestion_txt_171').fill('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_170_ctrlQuestion_txt_170').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_173_chk_173_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_173_chk_173_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_173_chk_173_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_174_chk_174_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_174_chk_174_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_174_chk_174_2').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_174_chk_174_3').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_175_chk_175_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_176_chk_176_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_176_chk_176_2').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_177_chk_177_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_177_chk_177_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_177_chk_177_3').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_178_chk_178_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_528_ddl_528').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_179_ctrlQuestion_txt_179').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_179_ctrlQuestion_txt_179').fill('25');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_180_ctrlQuestion_txt_180').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_180_ctrlQuestion_txt_180').fill('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_179_ctrlQuestion_txt_179').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_182_chk_182_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_182_chk_182_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_182_chk_182_2').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_183_chk_183_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_183_chk_183_3').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_183_chk_183_4').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_184_chk_184_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_185_ddl_185').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_186_ctrlQuestion_txt_186').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_186_ctrlQuestion_txt_186').fill('3');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_187_ctrlQuestion_txt_187').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_187_ctrlQuestion_txt_187').fill('5');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_189_ctrlQuestion_txt_189').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_189_ctrlQuestion_txt_189').fill(`Test Automation: Grooming ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_190_chk_190_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_190_chk_190_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_191_chk_191_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_191_chk_191_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_191_chk_191_2').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_192_chk_192_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_193_ddl_193').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_194_ctrlQuestion_txt_194').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_194_ctrlQuestion_txt_194').fill('6');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_195_ctrlQuestion_txt_195').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_195_ctrlQuestion_txt_195').fill('7');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_194_ctrlQuestion_txt_194').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_197_chk_197_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_197_chk_197_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_197_chk_197_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_198_chk_198_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_198_chk_198_3').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_198_chk_198_7').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_199_chk_199_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_200_ctrlQuestion_txt_200').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_200_ctrlQuestion_txt_200').fill('3');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_201_ctrlQuestion_txt_201').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_201_ctrlQuestion_txt_201').fill('7');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_200_ctrlQuestion_txt_200').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_201_q_526_ctrlQuestion_txt_526').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_203_ddl_203').selectOption(`${getRandomInt(0, 3)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_204_ctrlQuestion_txt_204').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_204_ctrlQuestion_txt_204').fill(`Test Automation: Toileting and Hygiene ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_205_chk_205_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_205_chk_205_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_206_chk_206_1').check();
    await page1.getByRole('checkbox', { name: 'Total assistance with positioning or transferring from bed to chair' }).check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_208_ddl_208').selectOption(`${getRandomInt(0, 3)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_209_ddl_209').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_210_ctrlQuestion_txt_210').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_210_ctrlQuestion_txt_210').fill('15');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_211_ctrlQuestion_txt_211').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_211_ctrlQuestion_txt_211').fill('4');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_210_ctrlQuestion_txt_210').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_213_chk_213_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_213_chk_213_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_214_chk_214_1').check();
    await page1.getByRole('checkbox', { name: 'Total assistance with positioning from bed to chair' }).check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_216_ddl_216').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_217_ctrlQuestion_txt_217').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_217_ctrlQuestion_txt_217').fill('12');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_218_ctrlQuestion_txt_218').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_218_ctrlQuestion_txt_218').fill('4');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_220_ctrlQuestion_txt_220').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_220_ctrlQuestion_txt_220').fill(`Test Automation: Transfer ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_221_chk_221_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_222_chk_222_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_223_chk_223_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_224_ddl_224').selectOption(`${getRandomInt(0, 3)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_225_ddl_225').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_226_ctrlQuestion_txt_226').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_226_ctrlQuestion_txt_226').fill('30');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_227_ctrlQuestion_txt_227').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_227_ctrlQuestion_txt_227').fill('3');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_226_ctrlQuestion_txt_226').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_229_chk_229_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_229_chk_229_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_230_chk_230_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_231_chk_231_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_232_ddl_232').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_463_ctrlQuestion_txt_463').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_463_ctrlQuestion_txt_463').fill('10');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_233_ctrlQuestion_txt_233').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_233_ctrlQuestion_txt_233').fill('5');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_235_ctrlQuestion_txt_235').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_235_ctrlQuestion_txt_235').fill(`Test Automation: Walking ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_236_ddl_236').selectOption(`${getRandomInt(1, 2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_237_chk_237_0').check();
    await page1.getByRole('checkbox', { name: 'Cleaning floors of living area used by individual' }).check();
    await page1.getByRole('cell', { name: 'Cleaning up after personal care tasks Cleaning floors of living area used by individual Dusting Cleaning bathrooom Changing bed linens Cleaning stove top, counters, washing dishes Cleaning refrigerator and stove Emptying and cleaning bedside commode Carrying out trash, setting\\out garbage for pickup', exact: true }).getByLabel('Dusting').check();
    await page1.getByRole('cell', { name: 'Cleaning up after personal care tasks Cleaning floors of living area used by individual Dusting Cleaning bathrooom Changing bed linens Cleaning stove top, counters, washing dishes Cleaning refrigerator and stove Emptying and cleaning bedside commode Carrying out trash, setting\\out garbage for pickup', exact: true }).getByLabel('Changing bed linens').check();
    await page1.getByRole('cell', { name: 'Cleaning up after personal care tasks Cleaning floors of living area used by individual Dusting Cleaning bathrooom Changing bed linens Cleaning stove top, counters, washing dishes Cleaning refrigerator and stove Emptying and cleaning bedside commode Carrying out trash, setting\\out garbage for pickup', exact: true }).getByLabel('Cleaning refrigerator and').check();
    await page1.getByRole('checkbox', { name: 'Carrying out trash, setting\\' }).check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_239_chk_239_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_240_ddl_240').selectOption(`${getRandomInt(0, 3)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_241_ddl_241').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_242_ctrlQuestion_txt_242').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_242_ctrlQuestion_txt_242').fill('10');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_243_ctrlQuestion_txt_243').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_243_ctrlQuestion_txt_243').fill('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_242_ctrlQuestion_txt_242').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_245_chk_245_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_245_chk_245_1').check();
    await page1.getByRole('cell', { name: 'Cleaning up after personal care tasks Cleaning floors of living areas used by individual Dusting Cleaning bathroom Changing bed linens Cleaning stove top, counters, washing dishes Cleaning refrigerator and stove Emptying and cleaning bedside commode Carrying out trash, setting out garbage for pickup', exact: true }).getByLabel('Cleaning up after personal').check();
    await page1.getByRole('checkbox', { name: 'Cleaning floors of living areas used by individual' }).check();
    await page1.getByRole('cell', { name: 'Cleaning up after personal care tasks Cleaning floors of living areas used by individual Dusting Cleaning bathroom Changing bed linens Cleaning stove top, counters, washing dishes Cleaning refrigerator and stove Emptying and cleaning bedside commode Carrying out trash, setting out garbage for pickup', exact: true }).getByLabel('Dusting').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_247_chk_247_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_248_ddl_248').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_249_ctrlQuestion_txt_249').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_249_ctrlQuestion_txt_249').fill('10');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_250_ctrlQuestion_txt_250').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_250_ctrlQuestion_txt_250').fill('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_252_ctrlQuestion_txt_252').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_252_ctrlQuestion_txt_252').fill(`Test Automation: Cleaning ${subscriberId} ${new Date().toISOString()}`);
    await page1.getByRole('checkbox', { name: 'Dryer' }).check();
    await page1.getByRole('checkbox', { name: 'Washer' }).check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_254_chk_254_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_255_ddl_255').selectOption(`${getRandomInt(1, 6)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_256_ddl_256').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_529_ctrlQuestion_txt_529').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_529_ctrlQuestion_txt_529').fill('30');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_530_ctrlQuestion_txt_530').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_530_ctrlQuestion_txt_530').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_529_ctrlQuestion_txt_529').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_257_chk_257_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_257_chk_257_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_257_chk_257_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_258_ddl_258').selectOption(`${getRandomInt(1, 6)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_259_ddl_259').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_260_ctrlQuestion_txt_260').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_260_ctrlQuestion_txt_260').fill('25');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_261_ctrlQuestion_txt_261').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_261_ctrlQuestion_txt_261').fill('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_263_ctrlQuestion_txt_263').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_263_ctrlQuestion_txt_263').fill(`Test Automation: Laundry ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_264_ddl_264').selectOption(`${getRandomInt(1, 2)}`);
    await page1.getByRole('checkbox', { name: 'Breakfast', exact: true }).check();
    await page1.getByRole('checkbox', { name: 'Supper', exact: true }).check();
    await page1.getByRole('checkbox', { name: 'Breakfast', exact: true }).uncheck();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_266_chk_266_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_266_chk_266_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_266_chk_266_2').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_267_chk_267_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_267_chk_267_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_267_chk_267_4').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_269_ddl_269').selectOption(`${getRandomInt(0, 3)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_270_ddl_270').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_271_ctrlQuestion_txt_271').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_271_ctrlQuestion_txt_271').fill('15');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_272_ctrlQuestion_txt_272').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_272_ctrlQuestion_txt_272').fill('7');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_274_ctrlQuestion_txt_274').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_274_ctrlQuestion_txt_274').fill('20');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_275_chk_275_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_275_chk_275_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_275_chk_275_3').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_276_chk_276_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_276_chk_276_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_276_chk_276_3').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_278_ddl_278').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_279_ctrlQuestion_txt_279').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_279_ctrlQuestion_txt_279').fill('8');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_280_ctrlQuestion_txt_280').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_280_ctrlQuestion_txt_280').fill('7');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_282_ctrlQuestion_txt_282').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_282_ctrlQuestion_txt_282').fill('15');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_283_ctrlQuestion_txt_283').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_283_ctrlQuestion_txt_283').fill(`Test Automation: Meal Prep ${subscriberId} ${new Date().toISOString()}`);
    await page1.getByRole('checkbox', { name: 'Arranging for transportation' }).check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_285_ddl_285').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#divNq_286').getByRole('cell').first().click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_286_ctrlQuestion_txt_286').fill('20');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_287_ctrlQuestion_txt_287').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_289_ddl_289').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_293_ctrlQuestion_txt_293').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_293_ctrlQuestion_txt_293').fill(`Test Automation: Escort ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_294_ddl_294').selectOption(`${getRandomInt(1, 2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_295_chk_295_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_296_chk_296_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_297_chk_297_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_298_ddl_298').selectOption(`${getRandomInt(0, 3)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_299_ddl_299').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_300_ctrlQuestion_txt_300').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_300_ctrlQuestion_txt_300').fill('12');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_301_ctrlQuestion_txt_301').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_301_ctrlQuestion_txt_301').fill('3');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_300_ctrlQuestion_txt_300').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_303_chk_303_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_303_chk_303_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_303_chk_303_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_304_chk_304_1').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_305_chk_305_0').check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_306_ddl_306').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_307_ctrlQuestion_txt_307').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_307_ctrlQuestion_txt_307').fill('20');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_308_ctrlQuestion_txt_308').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_308_ctrlQuestion_txt_308').fill('4');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_310_ctrlQuestion_txt_310').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_310_ctrlQuestion_txt_310').fill(`Test Automation: Shopping ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_311_ddl_311').selectOption(`${getRandomInt(0, 3)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_312_ddl_312').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_313_ddl_313').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_317_ctrlQuestion_txt_317').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_317_ctrlQuestion_txt_317').fill(`Test Automation: Assistance with Medication ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_318_ddl_318').selectOption(`${getRandomInt(0, 3)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_319_ddl_319').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_320_ddl_320').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_324_ctrlQuestion_txt_324').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_324_ctrlQuestion_txt_324').fill(`Test Automation: Trim Nails ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_325_ddl_325').selectOption(`${getRandomInt(0, 3)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_326_ddl_326').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_327_ddl_327').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_328_ctrlQuestion_txt_328').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_328_ctrlQuestion_txt_328').fill('3');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_329_ctrlQuestion_txt_329').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_329_ctrlQuestion_txt_329').fill('7');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_331_ctrlQuestion_txt_331').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_331_ctrlQuestion_txt_331').fill(`Test Automation: Balance ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_332_ddl_332').selectOption(`${getRandomInt(0, 3)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_333_ddl_333').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_334_ddl_334').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_338_ctrlQuestion_txt_338').fill(`Test Automation: Open Jars ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_339_ddl_339').selectOption(`${getRandomInt(0, 3)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_340_ddl_340').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_341_ddl_341').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_343_ctrlQuestion_txt_343').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_343_ctrlQuestion_txt_343').fill('4');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_345_ctrlQuestion_txt_345').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_345_ctrlQuestion_txt_345').fill(`Test Automation: Telephone ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_514_ddl_514').selectOption(`${getRandomInt(1, 2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_515_ddl_515').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_515_q_516_ddl_516').selectOption(`${getRandomInt(1, 2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_515_q_517_ddl_517').selectOption(`${getRandomInt(1, 2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_515_q_518_ddl_518').selectOption(`${getRandomInt(1, 2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_515_q_519_ddl_519').selectOption(`${getRandomInt(1, 2)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_347_ddl_347').selectOption(`${getRandomInt(0, 3)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_348_ddl_348').selectOption(`${getRandomInt(0, 3)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_349_ddl_349').selectOption(`${getRandomInt(0, 3)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_520_ddl_520').selectOption(`${getRandomInt(0, 3)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_350_ddl_350').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_351_ctrlQuestion_txt_351').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_351_ctrlQuestion_txt_351').fill('5');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_352_ctrlQuestion_txt_352').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_352_ctrlQuestion_txt_352').fill('7');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_354_ctrlQuestion_txt_354').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_354_ctrlQuestion_txt_354').fill(`Test Automation: Money Management ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_355_ddl_355').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_359_ctrlQuestion_txt_359').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_359_ctrlQuestion_txt_359').fill(`Test Automation: Interpersonal Communications ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_360_ddl_360').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_364_ctrlQuestion_txt_364').fill(`Test Automation: Community Integration ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_365_ddl_365').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_369_ctrlQuestion_txt_369').fill(`Test Automation: Reduction of Challenging Behaviors ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_370_ddl_370').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_374_ctrlQuestion_txt_374').fill(`Test Automation: Accessing Leisure Time and Recreational Activities ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_375_ddl_375').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_379_ctrlQuestion_txt_379').fill(`Test Automation: Self-Advocacy ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_380_ddl_380').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_384_ctrlQuestion_txt_384').fill(`Test Automation: Socialization/Development of Relationships ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_385_ddl_385').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_389_ctrlQuestion_txt_389').fill(`Test Automation: Personal Decision Making ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_390_ddl_390').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_394_ctrlQuestion_txt_394').fill(`Test Automation: Accessing Community Resources ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_395_ddl_395').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_399_ctrlQuestion_txt_399').fill(`Test Automation: Use of Augmentative Communication Devices ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_400_ddl_400').selectOption(`${getRandomInt(1, 5)}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_5_q_404_ctrlQuestion_txt_404').fill(`Test Automation: Other ${subscriberId} ${new Date().toISOString()}`);

    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
    
    // page - Section V: Total PAS and Habilitation Hours

    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
    
    // page - Section VI: Health-Related Tasks Screening Tool
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_7_q_415_ddl_415').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_7_q_419_ddl_419').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_7_q_420_ddl_420').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_7_q_421_ddl_421').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_7_q_422_ddl_422').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_7_q_423_ddl_423').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_7_q_424_ddl_424').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_7_q_425_ddl_425').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_7_q_426_ddl_426').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_7_q_427_ddl_427').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_7_q_428_ddl_428').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_7_q_429_ddl_429').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_7_q_430_ddl_430').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_7_q_431_ddl_431').selectOption('1');
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - Section VII: Emergency Response Services
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_8_q_432_ddl_432').selectOption('2');
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - Section VIII: Information/Referrals
    await page1.getByRole('checkbox', { name: 'STAR+Plus Waiver' }).check();
    await page1.getByRole('checkbox', { name: 'Waiver Interest List' }).check();
    await page1.getByRole('checkbox', { name: 'Other Medicaid services' }).check();
    await page1.getByRole('checkbox', { name: 'Other non-Medicaid or' }).check();
    await page1.getByRole('checkbox', { name: 'Housing options' }).check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_9_q_435_ctrlQuestion_txt_435').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_9_q_435_ctrlQuestion_txt_435').fill(`Test Automation: Other specified ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_9_q_436_ctrlQuestion_txt_436').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_9_q_436_ctrlQuestion_txt_436').fill(`Test Automation: Notes SC Tips/Examples ${subscriberId} ${new Date().toISOString()}`);
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
    
    // page - Section IX: Support Management
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_10_q_437_ddl_437').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_10_q_438_ddl_438').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_10_q_438_q_439_ctrlQuestion_txt_439').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_10_q_438_q_439_ctrlQuestion_txt_439').fill(`Test Automation: Identify any needs, requests, or considerations ${subscriberId} ${new Date().toISOString()}`);
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - Section X: Service Delivery Options
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_11_q_440_ddl_440').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_11_q_441_ddl_441').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_11_q_442_ddl_442').selectOption('2');
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - Section XI: Goals/Desired Outcomes
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_12_q_443_ctrlQuestion_txt_443').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_12_q_443_ctrlQuestion_txt_443').fill(`Test Automation: Goals/Desired Outcomes ${subscriberId} ${new Date().toISOString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_12_q_444_ddl_444').selectOption('1');
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - Section XII: Summary of Recommended of Community First Choice Services
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_13_q_446_ddl_446').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_13_q_447_ddl_447').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_13_q_448_ddl_448').selectOption('1');
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - Section XIII: Acknowledgement
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_14_q_449_ctrlQuestion_txt_449').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_14_q_449_ctrlQuestion_txt_449').fill('aloha');
    await page1.getByRole('checkbox', { name: 'Signature of individual' }).check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_14_q_451_dt451_PU_TG').click();
    await page1.getByTitle('Today').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_14_q_452_ctrlQuestion_txt_452').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_14_q_452_ctrlQuestion_txt_452').fill('bu');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_14_q_453_ctrlQuestion_txt_453').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_14_q_453_ctrlQuestion_txt_453').fill('test');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_14_q_454_ctrlQuestion_txt_454').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_14_q_454_ctrlQuestion_txt_454').fill('test');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_14_q_455_dt455_PU_TG').click();
    await page1.getByTitle('Today').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_14_q_456_ctrlQuestion_txt_456').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_14_q_456_ctrlQuestion_txt_456').fill('test');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_14_q_457_ctrlQuestion_txt_457').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_14_q_457_ctrlQuestion_txt_457').fill('Signature of Representative');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_14_q_458_dt458_PU_TG').click();
    await page1.getByTitle('Today').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_14_q_459_ctrlQuestion_txt_459').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_14_q_459_ctrlQuestion_txt_459').fill('Printed Name of Representative');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_14_q_460_ctrlQuestion_txt_460').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_14_q_460_ctrlQuestion_txt_460').fill('Other Person Signature');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_14_q_461_dt461_PU_TG').click();
    await page1.getByTitle('Today').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_14_q_462_ctrlQuestion_txt_462').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500572_P_14_q_462_ctrlQuestion_txt_462').fill('Printed Name of Other Person');
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
    
    // page - Stop and Review
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
    
    // page - Final
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // Save Report as PDFs
    await page1.getByRole('link', { name: 'View History' }).click();
    await page1.locator('#ctl00_ctl00_cphBody_cphList_HRAHistoryListGrid_ctl00__0').click();
    await page1.waitForTimeout(3000); // we will wait until data will be loaded
    await page1.locator('#cphBody_cphActionLinks_btnShowAllOptions').click();
    await page1.waitForTimeout(6000); // we will wait until data will be loaded
    await page1.pdf({path: `./pdfs/CCA_Assessment_History_${formId}_${subscriberId}_${Date.now()}.pdf`, format: 'A4'});
    await page1.getByRole('link', { name: 'View Report' }).click();
    
    const page2Promise = page1.waitForEvent('popup');
    const page2 = await page2Promise;
    await page2.getByRole('cell', { name: '▼ Final' }).click();
    await page2.pdf({path: `./pdfs/CCA_Report_${formId}_${subscriberId}_${Date.now()}.pdf`, format: 'A4'});
    
    // Close tabs and browser session
    await page2.close();
    await page1.close();
    await page.close();
  });
});
