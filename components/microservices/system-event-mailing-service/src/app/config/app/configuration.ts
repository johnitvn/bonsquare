import { ConfigFactory } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, IsUrl, validateSync } from 'class-validator';

export class AppEnvironmentVariables {
  @IsNotEmpty()
  @IsString()
  @IsUrl({ require_protocol: true, require_valid_protocol: true })
  ACCOUNTS_SITE_URL: string;
}

export const configurations: ConfigFactory = () => {
  const validatedConfig = plainToInstance(AppEnvironmentVariables, process.env, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
};
