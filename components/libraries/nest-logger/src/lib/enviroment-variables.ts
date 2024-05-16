import { IsIn, IsString } from 'class-validator';

export type LogFormat = 'json' | 'text';

export class EnvironmentVariables {
  @IsIn(['text', 'json'] as const)
  LOG_FORMAT: LogFormat = 'text';

  @IsString()
  LOG_DEBUG = '';
}
