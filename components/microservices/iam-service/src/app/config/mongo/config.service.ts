import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoEnvironmentVariables } from './configuration';

@Injectable()
export class MongoConfigService {
  constructor(private configService: ConfigService) {}

  get uri(): string {
    return this.configService.get<MongoEnvironmentVariables>('MONGO', { infer: true });
  }
}
