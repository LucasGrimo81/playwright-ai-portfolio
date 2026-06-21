import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CheckoutPage } from '../pages/CheckoutPage';
 
test.describe('Checkout', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;
  let checkoutPage: CheckoutPage;
 
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    checkoutPage = new CheckoutPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });
 
  test('Flujo completo de compra de principio a fin con confirmación', async () => {
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.goToCart();
    await checkoutPage.proceedToCheckout();
    await checkoutPage.fillInfo('Juan', 'Perez', '12345');
    await checkoutPage.continue();
    await checkoutPage.finish();
    await checkoutPage.expectConfirmationMessage();
  });
 
  test('Carrito vacío permanece vacío al llegar al resumen de checkout', async () => {
    // saucedemo no bloquea el checkout con carrito vacío: no hay validación de negocio
    // que lo impida. Este test documenta ese comportamiento explícitamente, en lugar
    // de depender implícitamente de no haber agregado productos.
    await checkoutPage.goto();
    await checkoutPage.expectCartIsEmpty();
 
    await checkoutPage.proceedToCheckout();
    await checkoutPage.fillInfo('Juan', 'Perez', '12345');
    await checkoutPage.continue();
 
    const items = await checkoutPage.getOverviewProductNames();
    expect(items.length).toBe(0);
  });
 
  test('Verificar que el resumen de orden muestra el producto correcto', async () => {
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.goToCart();
    await checkoutPage.proceedToCheckout();
    await checkoutPage.fillInfo('Juan', 'Perez', '12345');
    await checkoutPage.continue();
    const productNames = await checkoutPage.getOverviewProductNames();
    expect(productNames).toContain('Sauce Labs Backpack');
  });
});
 