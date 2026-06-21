import { Page, Locator, expect } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly inventoryItems: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly sortContainer: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryItems = page.locator('.inventory_item');
    this.productNames = page.locator('.inventory_item_name');
    this.productPrices = page.locator('.inventory_item_price');
    this.sortContainer = page.locator('.product_sort_container');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/inventory.html');
  }

  async sortByPriceLowToHigh() {
    await this.sortContainer.selectOption('lohi');
  }

  async getFirstProductName(): Promise<string> {
    return (await this.productNames.first().textContent()) ?? '';
  }

  async getFirstProductPrice(): Promise<string> {
    return (await this.productPrices.first().textContent()) ?? '';
  }

  async addProductToCart(productName: string) {
    await this.page.locator('.inventory_item', { hasText: productName }).locator('.btn_inventory').click();
  }

  async getCartCount(): Promise<string> {
    return (await this.cartBadge.textContent()) ?? '0';
  }

  async expectProductsAreListed() {
    await expect(this.inventoryItems.first()).toBeVisible();
    await expect(this.inventoryItems).not.toHaveCount(0);
  }

  async expectCartBadgeToHaveCount(expected: string) {
    await expect(this.cartBadge).toHaveText(expected);
  }

  async goToCart() {
    await this.cartLink.click();
  }
}
