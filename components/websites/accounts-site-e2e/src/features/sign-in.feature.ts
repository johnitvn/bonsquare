import { Page } from '@playwright/test';
import { SignInPO } from '../pages/sign-in.po';

export class SignInFeature {
  public signInPage: SignInPO;

  constructor(page: Page | SignInPO) {
    if (page instanceof SignInPO) {
      this.signInPage = page;
    } else {
      this.signInPage = new SignInPO(page);
    }
  }

  async doSignIn(email: string, password: string) {
    await this.signInPage.goto();
    await this.signInPage.emailField.focus();
    await this.signInPage.emailField.fill(email);
    await this.signInPage.passwordField.focus();
    await this.signInPage.passwordField.fill(password);
    await this.signInPage.submitButton.click();
  }

  async doSignInAdmistrator() {
    await this.doSignIn('admin@email.com', 'P@ass0wrd123123');
  }
}
