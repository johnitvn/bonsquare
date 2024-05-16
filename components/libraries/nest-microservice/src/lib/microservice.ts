/* eslint-disable @typescript-eslint/ban-types */
import { NestLogger } from '@bonsquare/nest-logger';
import { INestMicroservice, LoggerService } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvironmentVariables } from './enviroment-variables';
import { MicroserviceCommonModule } from './microservice-common.module';

export type BonsquareMicroserviceCreateOptions = {
  i18nPath: string;
  protoPath?: string | string[];
  package?: string | string[];
};

export class BonsquareMicroservice {
  private serviceName: string;
  private enviroments: EnvironmentVariables;
  private logger: LoggerService;
  private microservice: INestMicroservice;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
    this.logger = new NestLogger(BonsquareMicroservice.name, ['InstanceLoader']);
    this.enviroments = this.validateAndLoadCoreEnviromentVariables();
  }

  private validateAndLoadCoreEnviromentVariables(): EnvironmentVariables {
    const validatedConfig = plainToInstance(EnvironmentVariables, process.env, { enableImplicitConversion: true });
    const errors = validateSync(validatedConfig, { skipMissingProperties: false, whitelist: true });
    if (errors.length > 0) {
      throw new Error(errors.toString());
    }
    return validatedConfig;
  }

  /**
   *
   * @param moduleCls Entry (root) application module class
   */
  public async create(appModuleCls: any, options: BonsquareMicroserviceCreateOptions) {
    this.microservice = await NestFactory.createMicroservice<GrpcOptions>(
      MicroserviceCommonModule.create(appModuleCls, options.i18nPath),
      {
        transport: Transport.GRPC,
        logger: this.logger,
        options: {
          url: `0.0.0.0:${this.enviroments.PORT}`,
          package: this.serviceName,
          ...(options ?? {})
        }
      }
    );
    this.microservice.enableShutdownHooks(); // Enable listening for shutdown hooks
    this.logger.debug?.(
      { message: 'Initialzed microservice', port: this.enviroments.PORT },
      BonsquareMicroservice.name
    );
  }

  public async start() {
    await this.microservice.listen();
    this.logger.log(`Application started and listening on ${this.enviroments.PORT}!!!`, BonsquareMicroservice.name);
  }
}
