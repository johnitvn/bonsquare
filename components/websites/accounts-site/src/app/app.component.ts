import { DOCUMENT } from '@angular/common';
import { Component, HostBinding, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogWriter } from '@bonsquare/ng-logger';
import { TuiRootModule } from '@taiga-ui/core';
import { RuntimeConfig } from './core/models/RuntimeConfig';
import { LanguageService } from './core/service/language-service';

@Component({
  standalone: true,
  imports: [RouterModule, TuiRootModule],
  selector: 'accounts-root',
  template: `
    <tui-root>
      <router-outlet></router-outlet>
      <ng-container ngProjectAs="tuiOverContent"> </ng-container>
      <ng-container ngProjectAs="tuiOverDialogs"></ng-container>
      <ng-container ngProjectAs="tuiOverAlerts"> </ng-container>
      <ng-container ngProjectAs="tuiOverPortals"></ng-container>
      <ng-container ngProjectAs="tuiOverHints"></ng-container>
    </tui-root>
  `
})
export class AppComponent {
  title = 'accounts-site';

  constructor(
    readonly config: RuntimeConfig,
    private logger: LogWriter,
    private languageService: LanguageService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.logger.verbose('Configurations', config);
    this.languageService.currentLang.subscribe((lang) => {
      this.document.documentElement.setAttribute('lang', lang);
    });
  }

  @HostBinding('style')
  get styles() {
    return {
      '--tui-primary': this.config.primaryColor,
      '--tui-primary-active': this.config.primaryActiveColor,
      '--tui-primary-hover': this.config.primaryHoverColor,
      '--tui-accent': this.config.accentColor,
      '--tui-accent-active': this.config.accentActiveColor,
      '--tui-accent-hover': this.config.accentHoverColor,
      '--tui-secondary': this.config.secondaryColor,
      '--tui-secondary-active': this.config.secondaryActiveColor,
      '--tui-secondary-hover': this.config.secondaryHoverColor
    };
  }
}
