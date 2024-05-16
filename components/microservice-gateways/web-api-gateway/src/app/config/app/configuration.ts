import { ConfigFactory } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';

export class AppEnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  IAM_SERVICE: string;

  @IsString()
  @IsNotEmpty()
  SECRET: string;
}

export const configurations: ConfigFactory = () => {
  const validatedConfig = plainToInstance(AppEnvironmentVariables, process.env, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
};
