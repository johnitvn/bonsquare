import { expect, test } from '@playwright/test';
import { SignInFeature } from '../features/sign-in.feature';
import { SignInPO } from '../pages/sign-in.po';

test.use({
  locale: 'vi'
});

test('Should have correct title', async ({ page }) => {
  const signInPage = new SignInPO(page);
  await signInPage.goto();
  await expect(signInPage.rootHtml).toHaveAttribute('lang', 'vi');
  await expect(signInPage.getHeading()).toHaveText('Đăng nhập');
});

test('Should display error when account not found', async ({ page }) => {
  const signInFeature = new SignInFeature(page);
  await signInFeature.doSignIn('notfound@email.com', 'P@ass0wrd');
  await expect(signInFeature.signInPage.emailFieldError).toBeVisible();
});

test('Should display error when wrong password', async ({ page }) => {
  const signInFeature = new SignInFeature(page);
  await signInFeature.doSignIn('admin@email.com', 'P@ass0wrd123123');
  await expect(signInFeature.signInPage.passwordFieldError).toBeVisible();
});

test('After display not found email error should clear error when only email input focus', async ({ page }) => {
  const signInFeature = new SignInFeature(page);
  await signInFeature.doSignIn('notfound@email.com', 'P@ass0wrd');
  await expect(signInFeature.signInPage.emailFieldError).toBeVisible();

  await signInFeature.signInPage.passwordField.focus();
  await expect(signInFeature.signInPage.emailFieldError).toBeVisible();
  await signInFeature.signInPage.emailField.focus();
  await expect(signInFeature.signInPage.emailFieldError).toBeHidden();
});

test('After display wrong password error should clear error when any input focus', async ({ page }) => {
  const signInFeature = new SignInFeature(page);
  await signInFeature.doSignIn('admin@email.com', 'P@ass0wrd123123');
  await expect(signInFeature.signInPage.passwordFieldError).toBeVisible();
  await signInFeature.signInPage.emailField.focus();
  await expect(signInFeature.signInPage.passwordFieldError).toBeHidden();

  await signInFeature.doSignIn('admin@email.com', 'P@ass0wrd123123');
  await expect(signInFeature.signInPage.passwordFieldError).toBeVisible();
  await signInFeature.signInPage.passwordField.focus();
  await expect(signInFeature.signInPage.passwordFieldError).toBeHidden();
});
