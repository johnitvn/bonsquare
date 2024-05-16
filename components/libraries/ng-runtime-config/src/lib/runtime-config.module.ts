import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, Injector, ModuleWithProviders, NgModule, Type } from '@angular/core';
import { CONFIGURATION_APP_INITIALIZER, CONFIGURATION_OPTIONS, CONFIGURATION_TYPE } from './runtime-config.const';
import { RuntimeConfigOptions } from './runtime-config.options';
import { RuntineConfigurationService } from './runtime-config.service';
import { isPromise } from './runtime-config.utils';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule]
})
export class RuntimeConfigModule {
  public static forRoot<TConfiguration>(
    configurationType: Type<TConfiguration>,
    options?: RuntimeConfigOptions
  ): ModuleWithProviders<RuntimeConfigModule> {
    return {
      ngModule: RuntimeConfigModule,
      providers: [
        RuntineConfigurationService,
        {
          provide: CONFIGURATION_TYPE,
          useValue: configurationType
        },
        {
          provide: CONFIGURATION_OPTIONS,
          useValue: options
        },
        {
          provide: configurationType,
          useFactory: (configurationService: RuntineConfigurationService<TConfiguration>) =>
            configurationService.configuration,
          deps: [RuntineConfigurationService]
        },
        {
          provide: APP_INITIALIZER,
          useFactory:
            (configurationService: RuntineConfigurationService<TConfiguration>, injector: Injector) => async () => {
              // first we initialize configurations
              await configurationService.init();

              // then we run other initializations
              const dispoAppInitializers = injector.get(CONFIGURATION_APP_INITIALIZER, []);
              const all = dispoAppInitializers.map((p) => p());
              const promises = all.filter((x) => isPromise(x));
              if (promises.length !== 0) {
                await Promise.all(promises);
              }
            },
          deps: [RuntineConfigurationService, Injector],
          multi: true
        }
      ]
    };
  }
}
