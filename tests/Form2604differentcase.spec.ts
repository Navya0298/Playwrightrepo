import { test, expect } from '@playwright/test';

const targetSystemUrl = 'https://ccar1.cfhp.com/customlogin/winsso/Default.aspx';

// Data that drives the test
[
  { subscriberId: '820035172', formId: 'LTSS 2604'},
  { subscriberId: '819145328', formId: 'LTSS 2604'},
  { subscriberId: '814063235', formId: 'LTSS 2604'},
  { subscriberId: '525382210', formId: 'LTSS 2604'},
].forEach(( { subscriberId, formId }) => {

  test(`CCA - Budgetletter2604 ${subscriberId}`, async ({ page }) => {
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
    await page1.locator('[id$="FilterTextBox_hra_name"]').click();
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

       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_143_ctrlQuestion_rdo143_0').check();
       await page1.getByRole('radio', { name: 'Initial (New)' }).check();
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_9_ddl_9').selectOption('3');
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_11_ctrlQuestion_rdo11_1').check();
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_24_ctrlQuestion_rdo24_1').check();
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_29_ctrlQuestion_rdo29_0').check();
       await page1.getByRole('radio', { name: 'CDS' }).check();
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_29_q_30_q_33_ddl_33').selectOption('4');
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_29_q_30_q_170_ctrlQuestion_txt_170').click();
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_29_q_30_q_170_ctrlQuestion_txt_170').fill('210');
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_29_q_30_q_170_ctrlQuestion_txt_170').press('Tab');
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_43_ctrlQuestion_rdo43_1').check();
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_53_ctrlQuestion_rdo53_1').check();
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_63_ctrlQuestion_rdo63_0').check();
       await page1.getByRole('radio', { name: 'Transition Assistance' }).check();
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_63_q_145_ctrlQuestion_txt_145').click();
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_63_q_145_ctrlQuestion_txt_145').fill('210');
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_63_q_145_ctrlQuestion_txt_145').press('Tab');
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_63_q_65_ctrlQuestion_txt_65').fill('210');
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_66_ctrlQuestion_rdo66_1').check();
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_79_ctrlQuestion_rdo79_0').check();
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_79_q_80_ctrlQuestion_rdo80_1').check();
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_79_q_90_ctrlQuestion_txt_90').click();
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_79_q_90_ctrlQuestion_txt_90').fill('1200');
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_79_q_90_ctrlQuestion_txt_90').press('Tab');
       await page1.getByRole('radio', { name: 'FMS Fee, Monthly Fee, CFC (' }).check();
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_189_q_191_ctrlQuestion_txt_191').click();
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_189_q_192_ctrlQuestion_txt_192').click();
       await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_3_q_138_ctrlQuestion_txt_138').click();
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_3_q_138_ctrlQuestion_txt_138').press('CapsLock');
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_3_q_138_ctrlQuestion_txt_138').fill('N');
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_3_q_138_ctrlQuestion_txt_138').press('CapsLock');
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_3_q_138_ctrlQuestion_txt_138').press('CapsLock');
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_3_q_138_ctrlQuestion_txt_138').fill('NM');
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_3_q_138_ctrlQuestion_txt_138').press('CapsLock');
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_3_q_139_ddl_139').selectOption('3');
       await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_3_q_140_ctrlQuestion_txt_140').click();
       await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
       await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
       await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
       await page1.getByRole('link', { name: 'View History' }).click();
       await page1.locator('#ctl00_ctl00_cphBody_cphList_HRAHistoryListGrid_ctl00_ctl04_imgHraStatus').click();
       const page2Promise = page1.waitForEvent('popup');
       await page1.getByRole('link', { name: 'View Report' }).click();
      const page2 = await page2Promise;
      const formSelections = [
  { label: 'MFPD (money follows the person demonstration)', value: 'Yes', nth: 1 },
  { label: 'Type of Authorization', value: 'Initial (New)' },
  { label: 'Respite (in-home)', value: 'No', exact: true, nth: 1 },
   { label: 'Unit Cost', value : '8.29' },
   {label: 'Estimated Annual Cost',value: '1740.9'},
   {label: 'Adaptive Aids',value: 'No', exact: true, nth: 1},
   {label: 'Minor Home Modifications',value: 'No', exact: true, nth: 1},
   {label: 'Transition Assistance Services',value:'Yes', nth: 1 },
  {label: 'Employment Assistance',value : 'No', exact: true, nth: 1},
   {label: 'Supported Employment',value: 'Yes', nth: 1},
   {label: 'CDS Services',value: 'Supported employment (H2023 UC)'},
   {label: 'Financial Management Services (CDS only)',value:'Yes', nth: 1 },
  {label: 'Estimated Annual Service Units',value: 'FMS Fee, Monthly Fee, CFC (T2040 U9, U2,U6)' },
   {label: 'Service Coordinator',value: 'NM'},
     ];
for (const selection of formSelections) {
  const locator = selection.exact
    ? page2.getByText(selection.value, { exact: true })
    : page2.getByText(selection.value);

  const finalLocator = selection.nth !== undefined ? locator.nth(selection.nth) : locator;

  await finalLocator.click();
}
    // Close tabs and browser session
    await page1.close();
    await page.close();

  });
});