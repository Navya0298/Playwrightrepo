import { test, expect } from '@playwright/test';

const targetSystemUrl = 'https://ccar2.cfhp.com/customlogin/winsso/Default.aspx';

// Data that drives the test
[
  { subscriberId: 'A0100426200', formId: 'H2060-A' },
  { subscriberId: 'A0118679300', formId: 'H2060-A' },
  { subscriberId: 'A0002948700', formId: 'H2060-A'},
  { subscriberId: 'A0000706601', formId: 'H2060-a' },
  { subscriberId: 'A0064191203', formId: 'h2060-a'},
].forEach(( { subscriberId, formId }) => {

  test(`CCA - H2060-A End-To-End for Subscriber ${subscriberId}`, async ({ page }) => {
    test.setTimeout(120_000);

    // Initiate browser, navigate to CCA and authentificate
    await page.goto(targetSystemUrl);
  
    // Search member by Subscriber ID
    await page.locator('iframe[name="topPanelFrame"]').contentFrame().getByRole('button', { name: '' }).click();
    await page.locator('iframe[name="searchFilterFrame"]').contentFrame().getByRole('textbox', { name: 'Subscriber ID' }).click();
    await page.locator('iframe[name="searchFilterFrame"]').contentFrame().getByRole('textbox', { name: 'Subscriber ID' }).clear();
    await page.locator('iframe[name="searchFilterFrame"]').contentFrame().getByRole('textbox', { name: 'Subscriber ID' }).fill(subscriberId);
    await page.locator('iframe[name="searchFilterFrame"]').contentFrame().getByRole('textbox', { name: 'Subscriber ID' }).press('Enter');
  
    // Select first record and open all member's assesments
    await page.locator('iframe[name="RightPanel"]').contentFrame().locator('#RadGridMemberSearch_ctl00').click();
    await page.getByText('Care Management').click();
    await page.getByText('Assessments').click();
    
    const page1Promise = page.waitForEvent('popup');
    const page1 = await page1Promise;
  
    // Search specific form
    await page1.locator('[id$="FilterTextBox_hra_name"]').focus();
    await page1.locator('[id$="FilterTextBox_hra_name"]').clear();
    await page1.locator('[id$="FilterTextBox_hra_name"]').fill(formId);
    await page1.locator('[id$="FilterTextBox_hra_name"]').press('Enter');
    await page1.waitForTimeout(1000);
    await page1.locator('#ctl00_ctl00_cphBody_cphRadGrid_ucRadGrid_tzgRadGrid_ctl00__0').click();
    await page1.waitForTimeout(1000);
    
    // Take/Retake/Restart assesment
    const takeBtn = page1.locator('#cphBody_cphButtonsTop_btnTakeHRATop');
    const retakeBtn = page1.locator('#cphBody_cphButtonsTop_btnRetakeHRATop');
    const restartBtn = page1.locator('#cphBody_cphButtonsTop_btnRestartHRATop');

    if (await takeBtn.isVisible()) {
      await takeBtn.click();
    }; 
    if (await retakeBtn.isVisible()){
      await retakeBtn.click();
    };
    if (await restartBtn.isVisible()) {
      await restartBtn.click();
    };

    // page - I. Demographic
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_1_q_5_dt5_PU_TG').click();
    await page1.getByTitle('Today').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_1_q_6_dt6_PU_TG').click();
    await page1.getByTitle('Today').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_1_q_8_ctrlQuestion_txt_8').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_1_q_8_ctrlQuestion_txt_8').fill(`Test Automation: Demografic ${subscriberId} ${new Date().toLocaleString()}`);
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - II. Additional PAS Hours
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_2_q_12_ddl_12').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_2_q_12_q_86_ddl_86').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_2_q_12_q_86_q_87_ctrlQuestion_txt_87').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_2_q_12_q_86_q_87_ctrlQuestion_txt_87').fill('5');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_2_q_12_q_86_q_88_ctrlQuestion_txt_88').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_2_q_12_q_86_q_88_ctrlQuestion_txt_88').fill('5');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_2_q_12_q_86_q_89_ctrlQuestion_txt_89').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_2_q_12_q_86_q_89_ctrlQuestion_txt_89').fill(`Test Automation: Comments ${subscriberId} ${new Date().toLocaleString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_2_q_12_q_90_ddl_90').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_2_q_12_q_90_q_94_ctrlQuestion_txt_94').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_2_q_12_q_90_q_94_ctrlQuestion_txt_94').fill('10');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_2_q_12_q_90_q_95_ctrlQuestion_txt_95').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_2_q_12_q_90_q_95_ctrlQuestion_txt_95').fill('3');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_2_q_12_q_90_q_97_ctrlQuestion_txt_97').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_2_q_12_q_90_q_97_ctrlQuestion_txt_97').fill(`Test Automation: Therapy ${subscriberId} ${new Date().toLocaleString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_2_q_12_q_91_ddl_91').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_2_q_12_q_91_q_98_ctrlQuestion_txt_98').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_2_q_12_q_91_q_98_ctrlQuestion_txt_98').fill('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_2_q_12_q_91_q_100_ctrlQuestion_txt_100').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_2_q_12_q_91_q_100_ctrlQuestion_txt_100').fill(`Test Automation: Delegated nursing ${subscriberId} ${new Date().toLocaleString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_2_q_12_q_92_ddl_92').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_2_q_12_q_92_q_101_ctrlQuestion_txt_101').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_2_q_12_q_92_q_101_ctrlQuestion_txt_101').fill('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_2_q_12_q_92_q_103_ctrlQuestion_txt_103').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_2_q_12_q_92_q_103_ctrlQuestion_txt_103').fill(`Test Automation: Derected services ${subscriberId} ${new Date().toLocaleString()}`);
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_2_q_12_q_93_ddl_93').selectOption('1');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_2_q_12_q_93_q_104_ctrlQuestion_txt_104').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_2_q_12_q_93_q_104_ctrlQuestion_txt_104').fill('12');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_2_q_12_q_93_q_106_ctrlQuestion_txt_106').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_2_q_12_q_93_q_106_ctrlQuestion_txt_106').fill(`Test Automation: PAS ${subscriberId} ${new Date().toLocaleString()}`);
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - III. Comments
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_3_q_11_ctrlQuestion_txt_11').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_3_q_11_ctrlQuestion_txt_11').fill(`Test Automation: Comments ${subscriberId} ${new Date().toLocaleString()}`);
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page -  IV. PAS Time Totals
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_4_q_151_ddl_151').selectOption('2');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_4_q_130_q_136_ctrlQuestion_txt_136').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_4_q_130_q_136_ctrlQuestion_txt_136').fill('42');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_4_q_137_q_140_ctrlQuestion_txt_140').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_4_q_137_q_140_ctrlQuestion_txt_140').fill('15');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_4_q_141_ctrlQuestion_txt_141').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_4_q_141_ctrlQuestion_txt_141').fill('3');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_4_q_144_ctrlQuestion_txt_144').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_4_q_141_q_143_ctrlQuestion_txt_143').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_4_q_141_q_143_ctrlQuestion_txt_143').fill('45');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_4_q_144_ctrlQuestion_txt_144').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_4_q_144_ctrlQuestion_txt_144').fill('200');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_4_q_137_ctrlQuestion_txt_137').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_4_q_144_q_146_ctrlQuestion_txt_146').fill('245');
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - V. Certification
    await page1.getByRole('radio', { name: 'Yes' }).check();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_5_q_154_ctrlQuestion_txt_154').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_5_q_154_ctrlQuestion_txt_154').fill('sc signature');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_5_q_155_dt155_PU_TG').click();
    await page1.getByTitle('Today').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_5_q_156_ctrlQuestion_txt_156').click();
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_5_q_156_ctrlQuestion_txt_156').fill('applicatn signature');
    await page1.locator('#cphBody_cphContent_HRAWizard1_500574_P_5_q_157_dt157_PU_TG').click();
    await page1.getByTitle('Today').click();
    
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
    
    // page - Stop for Review and Approval
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();

    // page - Final
    await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
    
    // Close tabs and browser session
    await page1.close();
    await page.close();
  });
});