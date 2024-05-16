import { Injectable } from '@angular/core';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { RuntimeConfig } from '../models/RuntimeConfig';

@Injectable({ providedIn: 'root' })
export class CookieService {
  constructor(private cookie: SsrCookieService, private config: RuntimeConfig) {}

  public set(key: string, value: string, expires?: number | Date): void {
    this.cookie.set(key, value, expires, undefined, new URL(this.config.APP_URL).hostname, false, 'Lax');
  }

  public getAll(): { [key: string]: string } {
    return this.cookie.getAll();
  }

  public get(key: string): string {
    return this.cookie.get(key);
  }

  public check(key: string): boolean {
    return this.cookie.check(key);
  }

  public deleteAll() {
    this.cookie.deleteAll(undefined, this.config.APP_URL, false, 'Lax');
  }

  public delete(key: string) {
    return this.cookie.delete(key, undefined, new URL(this.config.APP_URL).hostname, false, 'Lax');
  }
}
