import { Injectable } from '@angular/core';
import { SYSTEM_LANGUAGES } from '@bonsquare/languages';
import { LogWriter } from '@bonsquare/ng-logger';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from './cookie-service';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private static LANGUAGE_KEY = 'lang';
  public currentLang: BehaviorSubject<string>;

  constructor(private cookie: CookieService, private translate: TranslateService, private logger: LogWriter) {
    this.translate.addLangs(SYSTEM_LANGUAGES);
    const bootstrapEnviromentLang = this.cookie.get(LanguageService.LANGUAGE_KEY) ?? this.translate.getBrowserLang();
    const bootstrapLanguage = SYSTEM_LANGUAGES.includes(bootstrapEnviromentLang)
      ? bootstrapEnviromentLang
      : this.translate.getDefaultLang();
    this.currentLang = new BehaviorSubject(bootstrapLanguage);
    this.currentLang.pipe().subscribe((lang) => {
      this.translate.use(lang);
      this.cookie.set(LanguageService.LANGUAGE_KEY, lang);
    });
  }

  public changeLanguage(lang: string) {
    this.logger.debug('Change language', { lang });
    this.currentLang.next(lang);
  }
}
