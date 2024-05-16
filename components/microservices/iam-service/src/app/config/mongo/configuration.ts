import { ConfigFactory } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';

export class MongoEnvironmentVariables {
  @IsString()
  MONGO: string;
}

export const configurations: ConfigFactory = () => {
  const validatedConfig = plainToInstance(MongoEnvironmentVariables, process.env, {
    enableImplicitConversion: true
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
};
