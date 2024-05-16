import { expect, test } from '@playwright/test';
import { SignInPO } from '../pages/sign-in.po';

test.use({
  locale: 'vi'
});

test('Should not display all error when all input not yet touch', async ({ page }) => {
  const signInPage = new SignInPO(page);
  await signInPage.goto();
  await expect(signInPage.emailFieldError).toBeHidden();
  await expect(signInPage.passwordFieldError).toBeHidden();
});

test('Should display error when email field is touched', async ({ page }) => {
  const signInPage = new SignInPO(page);
  await signInPage.goto();
  await signInPage.emailField.focus();
  await expect(signInPage.emailFieldError).toBeHidden();
  await signInPage.emailField.blur();
  await expect(signInPage.emailFieldError).toBeVisible();
});

test('Should display error when email field is invalid email', async ({ page }) => {
  const signInPage = new SignInPO(page);
  await signInPage.goto();
  await signInPage.emailField.focus();
  await signInPage.emailField.fill('invalid');
  await expect(signInPage.emailFieldError).toBeVisible();
});

test('Should not display error when email field is valid email', async ({ page }) => {
  const signInPage = new SignInPO(page);
  await signInPage.goto();
  await signInPage.emailField.focus();
  await signInPage.emailField.fill('email@domain.com');
  await signInPage.emailField.blur();
  await expect(signInPage.emailFieldError).toBeHidden();
});

test('Should display error when password field is touched', async ({ page }) => {
  const signInPage = new SignInPO(page);
  await signInPage.goto();
  await signInPage.passwordField.focus();
  await expect(signInPage.passwordFieldError).toBeHidden();
  await signInPage.passwordField.blur();
  await expect(signInPage.passwordFieldError).toBeVisible();
});

test('Should display error when password field is invalid password', async ({ page }) => {
  const signInPage = new SignInPO(page);
  await signInPage.goto();
  await signInPage.passwordField.focus();
  await signInPage.passwordField.fill('invalid');
  await expect(signInPage.passwordFieldError).toBeVisible();
});

test('Should not display error when email field is valid password', async ({ page }) => {
  const signInPage = new SignInPO(page);
  await signInPage.goto();
  await signInPage.passwordField.focus();
  await signInPage.passwordField.fill('P@ssw0rd');
  await signInPage.passwordField.blur();
  await expect(signInPage.passwordFieldError).toBeHidden();
});

test('Should disabled submit button when all input not yet touch', async ({ page }) => {
  const signInPage = new SignInPO(page);
  await signInPage.goto();
  await expect(signInPage.submitButton).toBeDisabled();
});

test('Should disabled submit button when input invalid email', async ({ page }) => {
  const signInPage = new SignInPO(page);
  await signInPage.goto();
  await signInPage.emailField.focus();
  await signInPage.emailField.fill('invalid');
  await expect(signInPage.submitButton).toBeDisabled();
});

test('Should disabled submit button when input invalid password', async ({ page }) => {
  const signInPage = new SignInPO(page);
  await signInPage.goto();
  await signInPage.passwordField.focus();
  await signInPage.passwordField.fill('invalid');
  await expect(signInPage.submitButton).toBeDisabled();
});

test('Should disabled submit button when input valid email but invalid password', async ({ page }) => {
  const signInPage = new SignInPO(page);
  await signInPage.goto();
  await signInPage.emailField.focus();
  await signInPage.emailField.fill('email@domain.com');
  await signInPage.passwordField.focus();
  await signInPage.passwordField.fill('invalid');
  await expect(signInPage.submitButton).toBeDisabled();
});

test('Should disabled submit button when input valid password but invalid email', async ({ page }) => {
  const signInPage = new SignInPO(page);
  await signInPage.goto();
  await signInPage.emailField.focus();
  await signInPage.emailField.fill('invalid');
  await signInPage.passwordField.focus();
  await signInPage.passwordField.fill('P@assw0rd');
  await expect(signInPage.submitButton).toBeDisabled();
});

test('Should enabled submit button when input valid password and valid email', async ({ page }) => {
  const signInPage = new SignInPO(page);
  await signInPage.goto();
  await signInPage.emailField.focus();
  await signInPage.emailField.fill('email@domain.com');
  await signInPage.passwordField.focus();
  await signInPage.passwordField.fill('P@assw0rd');
  await expect(signInPage.submitButton).toBeEnabled();
});
