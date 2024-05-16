import { HttpClient, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { SYSTEM_LANGUAGE_DEFAULT } from '@bonsquare/languages';
import { LogWriterModule } from '@bonsquare/ng-logger';
import { RuntimeConfigModule } from '@bonsquare/ng-runtime-config';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TuiRootModule } from '@taiga-ui/core';
import { appRoutes } from './app.routes';
import { RuntimeConfig } from './core/models/RuntimeConfig';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideAnimations(),
    importProvidersFrom(
      TuiRootModule,
      RuntimeConfigModule.forRoot(RuntimeConfig, { urlFactory: () => ['brand.json', 'env.json'] }),
      LogWriterModule.forRoot(RuntimeConfig),
      TranslateModule.forRoot({
        defaultLanguage: SYSTEM_LANGUAGE_DEFAULT,
        extend: true,
        loader: {
          provide: TranslateLoader,
          useFactory: (http: HttpClient) => new TranslateHttpLoader(http),
          deps: [HttpClient]
        }
      })
    ),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideRouter(appRoutes)
  ]
};
