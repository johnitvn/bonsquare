import { NestLogger } from '@bonsquare/nest-logger';
import helmet from '@fastify/helmet';
import { CustomOrigin } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ApiGatewayCommonModule } from './api-gateway-common.module';
import { EnvironmentVariables } from './enviroment-variables';

type StaticOrigin = boolean | string | RegExp | (string | RegExp)[];

export type BonsquareApiGatewayCreateOptions = {
  i18nPath: string;
  origin: StaticOrigin | CustomOrigin;
};

export class BonsquareApiGateway {
  private gatewayName: string;
  private enviroments: EnvironmentVariables;
  private logger: NestLogger;
  private app: NestFastifyApplication;

  constructor(gatewayName: string) {
    this.gatewayName = gatewayName;
    this.logger = new NestLogger(BonsquareApiGateway.name, [
      'InstanceLoader',
      'NestApplication',
      'RoutesResolver',
      'RouterExplorer'
    ]);
    this.enviroments = this.validateAndLoadEnviromentVariables();
  }

  private validateAndLoadEnviromentVariables(): EnvironmentVariables {
    const validatedConfig = plainToInstance(EnvironmentVariables, process.env, { enableImplicitConversion: true });
    const errors = validateSync(validatedConfig, { skipMissingProperties: false });
    if (errors.length > 0) {
      throw new Error(errors.toString());
    }
    this.logger.debug('Loaded and validated enviroment variables', BonsquareApiGateway.name);
    return validatedConfig;
  }

  /**
   *
   * @param moduleCls Entry (root) application module class
   */
  public async create(appModuleCls: any, options: BonsquareApiGatewayCreateOptions) {
    const adapter = new FastifyAdapter({});
    adapter.enableCors({
      origin: options.origin,
      allowedHeaders: [
        'Origin',
        'Accept',
        'Content-Type',
        'Authorization',
        'Access-Control-Allow-Origin',
        'X-Custom-Lang'
      ],
      exposedHeaders: 'Authorization',
      credentials: true,
      methods: ['GET', 'PUT', 'OPTIONS', 'POST', 'DELETE']
    });
    this.app = await NestFactory.create<NestFastifyApplication>(
      ApiGatewayCommonModule.create(appModuleCls, options.i18nPath),
      adapter,
      { logger: this.logger }
    );
    this.app.enableShutdownHooks(); // Enable listening for shutdown hooks

    // Helmet can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.
    // https://docs.nestjs.com/security/helmet
    await this.app.register(helmet);
  }

  public async start() {
    await this.app.listen(this.enviroments.PORT, '0.0.0.0');
    this.logger.log(`Application started and listening on ${this.enviroments.PORT}!!!`, BonsquareApiGateway.name);
  }
}
