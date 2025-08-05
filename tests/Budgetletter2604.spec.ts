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
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_11_ctrlQuestion_rdo11_0').check();
await page1.getByRole('radio', { name: 'CDS' }).check();
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_11_q_12_q_14_ddl_14').selectOption('3');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_11_q_12_q_156_ctrlQuestion_txt_156').click();
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_11_q_12_q_156_ctrlQuestion_txt_156').fill('120');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_11_q_12_q_156_ctrlQuestion_txt_156').press('Tab');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_11_q_12_q_148_ctrlQuestion_txt_148').press('Tab');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_24_ctrlQuestion_rdo24_0').check();
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_24_q_26_ddl_26').selectOption('1');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_24_q_27_ctrlQuestion_txt_27').click();
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_24_q_27_ctrlQuestion_txt_27').fill('200');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_24_q_27_ctrlQuestion_txt_27').press('Tab');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_24_q_28_ctrlQuestion_txt_28').fill('200');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_29_ctrlQuestion_rdo29_0').check();
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_29_q_30_ctrlQuestion_rdo30_1').check();
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_29_q_30_q_33_ddl_33').selectOption('3');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_29_q_30_q_170_ctrlQuestion_txt_170').click();
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_29_q_30_q_170_ctrlQuestion_txt_170').fill('200');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_29_q_30_q_170_ctrlQuestion_txt_170').press('Tab');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_29_q_30_q_171_ctrlQuestion_txt_171').press('Tab');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_43_ctrlQuestion_rdo43_0').check();
await page1.getByRole('cell', { name: 'Agency CDS', exact: true }).getByLabel('CDS').check();
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_43_q_44_q_46_ddl_46').selectOption('2');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_43_q_144_ctrlQuestion_txt_144').click();
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_43_q_144_ctrlQuestion_txt_144').fill('200');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_43_q_144_ctrlQuestion_txt_144').press('Tab');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_53_ctrlQuestion_rdo53_0').check();
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_53_q_54_ctrlQuestion_rdo54_1').check();
await page1.getByRole('radio', { name: 'Minor Home Modifications (' }).check();
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_53_q_177_ctrlQuestion_txt_177').click();
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_53_q_177_ctrlQuestion_txt_177').fill('120');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_53_q_177_ctrlQuestion_txt_177').press('Tab');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_63_ctrlQuestion_rdo63_0').check();
await page1.getByRole('radio', { name: 'Transition Assistance' }).check();
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_63_q_145_ctrlQuestion_txt_145').click();
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_63_q_145_ctrlQuestion_txt_145').fill('120');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_63_q_145_ctrlQuestion_txt_145').press('Tab');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_63_q_65_ctrlQuestion_txt_65').fill('120');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_63_q_65_ctrlQuestion_txt_65').press('Tab');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_66_ctrlQuestion_rdo66_0').check();
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_66_q_67_ctrlQuestion_rdo67_1').check();
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_66_q_76_ctrlQuestion_txt_76').click();
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_66_q_76_ctrlQuestion_txt_76').fill('120');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_66_q_76_ctrlQuestion_txt_76').press('Tab');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_79_ctrlQuestion_rdo79_0').check();
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_79_q_80_ctrlQuestion_rdo80_1').check();
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_79_q_90_ctrlQuestion_txt_90').click();
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_79_q_90_ctrlQuestion_txt_90').fill('120');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_79_q_90_ctrlQuestion_txt_90').press('Tab');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_1_q_189_q_192_ctrlQuestion_txt_192').click({
    button: 'left'
  });
await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_3_q_138_ctrlQuestion_txt_138').click();
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_3_q_138_ctrlQuestion_txt_138').press('CapsLock');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_3_q_138_ctrlQuestion_txt_138').fill('N');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_3_q_138_ctrlQuestion_txt_138').press('CapsLock');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_3_q_138_ctrlQuestion_txt_138').fill('Navya ');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_3_q_138_ctrlQuestion_txt_138').press('CapsLock');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_3_q_138_ctrlQuestion_txt_138').fill('Navya M');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_3_q_138_ctrlQuestion_txt_138').press('CapsLock');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_3_q_138_ctrlQuestion_txt_138').fill('Navya Muttukuri');
await page1.locator('#cphBody_cphContent_HRAWizard1_500544_P_3_q_139_ddl_139').selectOption('3');
await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
await page1.locator('#cphBody_cphButtonsBottom_btnContinue2').click();
// It is used to view the view history button
 await page1.getByRole('link', { name: 'View History' }).click();
    await page1.locator('#ctl00_ctl00_cphBody_cphList_HRAHistoryListGrid_ctl00__0').getByRole('cell', { name: 'Completed Completed' }).click();
    await page1.getByRole('link', { name: 'View Report' }).click();
    const page2Promise = page1.waitForEvent('popup');
    const page2 = await page2Promise;
    await page2.getByRole('cell', { name: '▼ Final' }).click();
    await page2.pdf({path: `./pdfs/CCA_${formId}_${subscriberId}_${Date.now()}.pdf`, format: 'A4'});
    await page2.getByRole('row', { name: '24. MFPD (money follows the' }).locator('font').nth(1).click();
    await page2.getByText('Bexar').click();
    await expect(page2.getByText('Bexar')).toBeVisible();
    await page2.getByRole('row', { name: 'Respite (in-home) Yes' }).locator('font').nth(1).click();
    await expect(page2.getByRole('row', { name: /Respite \(in-home\) Yes/ })).toBeVisible();

  await page2.getByText('Respite Care provided by a').click();
  await expect(page2.getByText('Respite Care provided by a')).toBeVisible();


  await page2.getByText('7.17').first().click();
  await expect(page2.getByText('7.17').first()).toHaveText('7.17');

  await page2.getByText('860.4').click();
  await expect(page2.getByText('860.4')).toHaveText('860.4');

  await page2.getByText('Respite Care, not hospice (').click();
  await expect(page2.getByText(/Respite Care, not hospice \(/)).toBeVisible();

  for (let i = 0; i <= 4; i++) {
    await page2.getByText('200', { exact: true }).nth(i).click();
    await expect(page2.getByText('200', { exact: true }).nth(i)).toHaveText('200');
  }

  await page2.getByText('LVN (S9482 TE UC)').click();
  await expect(page2.getByText('LVN (S9482 TE UC)')).toContainText('S9482');

  await page2.getByText('7.17').nth(1).click();
  await expect(page2.getByText('7.17').nth(1)).toHaveText('7.17');

  await page2.getByText('1434').click();
  await expect(page2.getByText('1434')).toHaveText('1434');

  await page2.getByText('Adaptive Aid- Medical').click();
  await expect(page2.getByText('Adaptive Aid- Medical')).toBeVisible();

  await page2.getByText('Minor Home Modifications (').click();
  await expect(page2.getByText('Minor Home Modifications (')).toBeVisible();

  await page2.getByRole('row', { name: 'd. Unit Cost 120' }).locator('font').nth(1).click();
  await expect(page2.getByRole('row', { name: 'd. Unit Cost 120' }).locator('font').nth(1)).toHaveText('120');

  await page2.getByRole('row', { name: 'e. Estimated Annual Cost 120' }).locator('font').nth(1).click();
  await expect(page2.getByRole('row', { name: 'e. Estimated Annual Cost 120' }).locator('font').nth(1)).toHaveText('120');

  await page2.getByText('Transition Assistance Services (T2038)').click();
  await expect(page2.getByText(/Transition Assistance Services \(T2038\)/)).toBeVisible();

  await page2.getByRole('row', { name: 'Unit Cost 120', exact: true }).locator('font').nth(1).click();
  await expect(page2.getByRole('row', { name: 'Unit Cost 120', exact: true }).locator('font').nth(1)).toHaveText('120');

  await page2.getByRole('row', { name: 'Estimated Annual Cost 120', exact: true }).locator('font').nth(2).click();
  await expect(page2.getByRole('row', { name: 'Estimated Annual Cost 120', exact: true }).locator('font').nth(2)).toHaveText('120');

  await page2.getByText('Employment Assistance (H2025').click();
  await expect(page2.getByText(/Employment Assistance \(H2025/)).toBeVisible();

  await page2.getByText('6.32').first().click();
  await expect(page2.getByText('6.32').first()).toHaveText('6.32');

  await page2.getByText('758.4').first().click();
  await expect(page2.getByText('758.4').first()).toHaveText('758.4');

  await page2.getByText('Supported employment (H2023').click();
  await expect(page2.getByText(/Supported employment \(H2023/)).toBeVisible();

  await page2.getByText('6.32').nth(1).click();
  await expect(page2.getByText('6.32').nth(1)).toHaveText('6.32');

  await page2.getByText('758.4').nth(1).click();
  await expect(page2.getByText('758.4').nth(1)).toHaveText('758.4');

 const allVals = await page2.getByText(/\d+\.\d{4,6}/).allTextContents();
  for (const val of allVals) {
  expect(val.trim()).toMatch(/^\d+\.\d{4,6}$/); // Ensures format like '123.4567'
}

  const values = await page.getByText(/^\d+\.\d{1,2}$/).allTextContents();
  console.log('📊 All decimal values:', values);


  await page2.getByText('SE1 - $').click();
  await expect(page2.getByText('SE1 - $')).toContainText('SE1');

    // Close tabs and browser session
    await page1.close();
    await page.close();
  });
});