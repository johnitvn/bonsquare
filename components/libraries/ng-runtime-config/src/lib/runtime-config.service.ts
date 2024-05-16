/* eslint-disable no-prototype-builtins */
/* eslint-disable no-console */
import { PlatformLocation } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Injector, Type } from '@angular/core';
import { CONFIGURATION_OPTIONS, CONFIGURATION_TYPE } from './runtime-config.const';
import { RuntimeConfigOptions } from './runtime-config.options';
import { isPromise } from './runtime-config.utils';

@Injectable({
  providedIn: 'root'
})
export class RuntineConfigurationService<TConfiguration> {
  private config?: TConfiguration;

  public get configuration(): TConfiguration {
    if (this.config == null) {
      throw Error("Configuration hasn't been initialized");
    }
    return this.config;
  }

  public constructor(
    private readonly http: HttpClient,
    private readonly platformLocation: PlatformLocation,
    private readonly injector: Injector,
    @Inject(CONFIGURATION_TYPE) private readonly configurationType: Type<TConfiguration>,
    @Inject(CONFIGURATION_OPTIONS) private readonly configurationOptions: RuntimeConfigOptions | undefined
  ) {}

  public async init(): Promise<void> {
    try {
      await this.initInternal();
    } catch (error: any) {
      throw Error(`Configuration load failed - ${error.message}`);
    }
  }

  private async initInternal(): Promise<void> {
    const urls = await this.getUrls();
    const externalUrls = urls.map((x) => this.ensureExternalUrl(x));
    const promises = externalUrls.map((url) => this.http.get(url).toPromise());
    const configs = await Promise.all(promises);
    let config = new this.configurationType();
    configs.forEach((loadedConfig) => {
      config = { ...config, ...loadedConfig };
    });
    this.config = config;

    if (this.configurationOptions?.log === true) {
      console.log('Configuration loaded', config);
    }
  }

  private async getUrls(): Promise<string[]> {
    if (this.configurationOptions?.urlFactory == null) {
      return ['config.json'];
    }

    let result = this.configurationOptions.urlFactory(this.injector);

    if (isPromise(result)) {
      result = await result;
    }

    if (typeof result === 'string') {
      return [result];
    }

    if (Array.isArray(result)) {
      return result;
    }

    throw new Error('Unexpected value returned from ConfigurationUrlFactory');
  }

  private ensureExternalUrl(url: string): string {
    if (url.startsWith('//') || url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    if (url.startsWith('/')) {
      url = url.substr(1);
    }

    const baseHref = this.platformLocation.getBaseHrefFromDOM();
    const externalUrl = `${baseHref}${url}`;
    return externalUrl;
  }
}
