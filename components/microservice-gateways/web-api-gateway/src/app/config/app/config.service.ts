import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppEnvironmentVariables } from './configuration';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get iamServiceUrl(): string {
    return this.configService.get<AppEnvironmentVariables>('IAM_SERVICE', { infer: true });
  }

  get secret(): string {
    return this.configService.get<AppEnvironmentVariables>('SECRET', { infer: true });
  }
}
