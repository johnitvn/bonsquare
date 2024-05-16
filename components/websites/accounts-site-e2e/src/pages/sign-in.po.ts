import { Locator } from '@playwright/test';
import { PageObject } from '../common/page-object';

export class SignInPO extends PageObject {
  async goto() {
    await this.page.goto('/');
    await this.page.waitForURL('/sign-in');
  }

  get emailField(): Locator {
    return this.page.locator('tui-input[formcontrolname="email"] input[tuiTextfield]');
  }

  get passwordField(): Locator {
    return this.page.locator('tui-input-password[formcontrolname="password"] input[tuiTextfield]');
  }

  get formError(): Locator {
    return this.page.locator('accounts-form-error');
  }

  get emailFieldError(): Locator {
    return this.formError.nth(0);
  }

  get submitButton(): Locator {
    return this.page.locator('button[data-appearance="primary"]');
  }

  get passwordFieldError(): Locator {
    return this.formError.nth(1);
  }
}
