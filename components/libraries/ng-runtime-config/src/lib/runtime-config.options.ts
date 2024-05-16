import { Injector } from '@angular/core';

export type RuntimeConfigUrlFactory = (injector: Injector) => string | string[] | Promise<string> | Promise<string[]>;

export interface RuntimeConfigOptions {
  urlFactory?: RuntimeConfigUrlFactory;
  log?: boolean;
}
