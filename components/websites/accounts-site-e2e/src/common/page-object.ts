import { Locator, Page } from '@playwright/test';

export abstract class PageObject {
  public page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get rootHtml(): Locator {
    return this.page.locator('html');
  }

  getHeading(level = 1): Locator {
    return this.page.locator(`h${level}`);
  }
}
