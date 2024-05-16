import { ConfigFactory } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';

export class STMPEnvironmentVariables {
  @IsString()
  SMTP: string;

  @IsString()
  SENDER: string;
}

export const configurations: ConfigFactory = () => {
  const validatedConfig = plainToInstance(STMPEnvironmentVariables, process.env, {
    enableImplicitConversion: true
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
};
