import { ConfigFactory } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export class AgendaEnvironmentVariables {
  MAX_CONCURENT_JOBS = 1;
}

export const configurations: ConfigFactory = () => {
  const validatedConfig = plainToInstance(AgendaEnvironmentVariables, process.env, {
    enableImplicitConversion: true,
    exposeDefaultValues: true
  });
  const errors = validateSync(validatedConfig);

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
};
