import { Page } from "@playwright/test";

export async function SearchMemberBySubscriberID(page: Page, subscriberId: string) {
  /**
   * Helper function to search a member by subscriber id
   */
  await page.locator('iframe[name="topPanelFrame"]').contentFrame().getByRole('button', { name: '' }).click();
  await page.locator('iframe[name="searchFilterFrame"]').contentFrame().getByRole('textbox', { name: 'Subscriber ID' }).click();
  await page.locator('iframe[name="searchFilterFrame"]').contentFrame().getByRole('textbox', { name: 'Subscriber ID' }).clear();
  await page.locator('iframe[name="searchFilterFrame"]').contentFrame().getByRole('textbox', { name: 'Subscriber ID' }).fill(subscriberId);
  await page.locator('iframe[name="searchFilterFrame"]').contentFrame().getByRole('textbox', { name: 'Subscriber ID' }).press('Enter');
}

export async function SearchForm(page: Page, formId: string) {
    /**
     * Helper function to search a form
     */
    await page.locator('[id$="FilterTextBox_hra_name"]').click();
    await page.locator('[id$="FilterTextBox_hra_name"]').clear();
    await page.locator('[id$="FilterTextBox_hra_name"]').fill(formId);
    await page.locator('[id$="FilterTextBox_hra_name"]').press('Enter');
    await page.waitForTimeout(1000);
    await page.locator('#ctl00_ctl00_cphBody_cphRadGrid_ucRadGrid_tzgRadGrid_ctl00__0').click();
    await page.waitForTimeout(1000);
}

export async function TakeRetakeRestartAssessment(page: Page){
    /**
     * Helper function to Take/Retake/Restart an assessment
     */
    const takeBtn = page.locator('#cphBody_cphButtonsTop_btnTakeHRATop');
    const retakeBtn = page.locator('#cphBody_cphButtonsTop_btnRetakeHRATop');
    const restartBtn = page.locator('#cphBody_cphButtonsTop_btnRestartHRATop');

    if (await takeBtn.isVisible()) {
      await takeBtn.click();
    }; 
    if (await retakeBtn.isVisible()){
      await retakeBtn.click();
    };
    if (await restartBtn.isVisible()) {
      await restartBtn.click();
    };
}
