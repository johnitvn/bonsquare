import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { STMPEnvironmentVariables } from './configuration';

@Injectable()
export class SMTPConfigService {
  constructor(private configService: ConfigService) {}

  get uri(): string {
    return this.configService.get<STMPEnvironmentVariables>('SMTP', { infer: true });
  }

  get sender(): string {
    return this.configService.get<STMPEnvironmentVariables>('SENDER', { infer: true });
  }
}
