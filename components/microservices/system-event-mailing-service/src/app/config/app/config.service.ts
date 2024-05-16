import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppEnvironmentVariables } from './configuration';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get accountSiteUrl(): string {
    return this.configService.get<AppEnvironmentVariables>('ACCOUNTS_SITE_URL', { infer: true });
  }
}
