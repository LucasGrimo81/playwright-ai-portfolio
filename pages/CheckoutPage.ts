import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;

  readonly cartItems: Locator;
  readonly checkoutButton: Locator;

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly zipCodeInput: Locator;
  readonly continueButton: Locator;

  readonly finishButton: Locator;
  readonly overviewItemNames: Locator;

  readonly completeHeader: Locator;

  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('#checkout');

    this.firstNameInput = page.locator('#first-name');
    this.lastNameInput = page.locator('#last-name');
    this.zipCodeInput = page.locator('#postal-code');
    this.continueButton = page.locator('#continue');

    this.finishButton = page.locator('#finish');
    this.overviewItemNames = page.locator('.inventory_item_name');

    this.completeHeader = page.locator('.complete-header');

    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/cart.html');
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async fillInfo(firstName: string, lastName: string, zipCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.zipCodeInput.fill(zipCode);
  }

  async continue() {
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }

  async getOverviewProductNames(): Promise<string[]> {
    return await this.overviewItemNames.allTextContents();
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async expectConfirmationMessage() {
    await expect(this.completeHeader).toBeVisible();
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }

  async expectErrorMessage(expected: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expected);
  }

  async expectCartIsEmpty() {
    await expect(this.cartItems).toHaveCount(0);
  }
}