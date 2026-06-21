import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';

test.describe('Products', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('Verificar que se listan productos después del login', async () => {
    await productsPage.expectProductsAreListed();
  });

  test('Ordenar productos por precio menor a mayor y verificar el primero', async () => {
    await productsPage.sortByPriceLowToHigh();
    const name = await productsPage.getFirstProductName();
    const price = await productsPage.getFirstProductPrice();
    expect(name).toBe('Sauce Labs Onesie');
    expect(price).toBe('$7.99');
  });

  test('Agregar un producto al carrito y verificar el contador', async () => {
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.expectCartBadgeToHaveCount('1');
  });
});
