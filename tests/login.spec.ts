import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('successful login with valid credentials', async () => {
    await loginPage.login('standard_user', 'secret_sauce');
    await loginPage.expectLoginSuccess();
  });

  test('failed login with incorrect password', async () => {
    await loginPage.login('standard_user', 'wrong_password');
    await loginPage.expectErrorMessage('Username and password do not match');
  });

  test('failed login with locked out user', async () => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    await loginPage.expectErrorMessage('Sorry, this user has been locked out');
  });
});