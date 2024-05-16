import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { LogWriter } from './log-writer';
import { LogWriterConfig } from './log-writer-config';

@NgModule({})
export class LogWriterModule {
  public static forRoot<TConfiguration extends LogWriterConfig>(
    configurationType: Type<TConfiguration>
  ): ModuleWithProviders<LogWriterModule> {
    return {
      ngModule: LogWriterModule,
      providers: [
        {
          provide: LogWriter,
          useFactory: (config: typeof configurationType) => {
            return new LogWriter(config as unknown as LogWriterConfig);
          },
          deps: [configurationType]
        }
      ]
    };
  }
}
