import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AgendaEnvironmentVariables } from './configuration';

@Injectable()
export class AgendaConfigService {
  constructor(private configService: ConfigService) {}

  get maxConcurent(): number {
    return this.configService.get<AgendaEnvironmentVariables>('MAX_CONCURENT_JOBS', { infer: true });
  }
}
