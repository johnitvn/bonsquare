import { InjectionToken, Type } from '@angular/core';
import { RuntimeConfigOptions } from './runtime-config.options';

export const CONFIGURATION_APP_INITIALIZER = new InjectionToken<(() => unknown | Promise<unknown>)[]>(
  'CONFIGURATION_APP_INITIALIZER'
);
export const CONFIGURATION_TYPE = new InjectionToken<Type<unknown>>('CONFIGURATION_TYPE');
export const CONFIGURATION_OPTIONS = new InjectionToken<RuntimeConfigOptions>('CONFIGURATION_OPTIONS');
