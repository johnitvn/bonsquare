import { NestLogger } from '@bonsquare/nest-logger';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientProvider, ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppConfigModule } from '../config/app/config.module';
import { AppConfigService } from '../config/app/config.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (appConfig: AppConfigService) => {
        return {
          secret: appConfig.secret
        };
      }
    }),
    ClientsModule.registerAsync([
      {
        name: 'IAMService',
        imports: [AppConfigModule],
        inject: [AppConfigService],
        useFactory: (appConfig: AppConfigService) => {
          return {
            transport: Transport.GRPC,
            options: {
              url: appConfig.iamServiceUrl,
              package: 'IAMService',
              protoPath: join(__dirname, 'proto', 'iam-service-proto', 'proto', 'iam-service.proto')
            }
          } as ClientProvider;
        }
      }
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {
  private logger = new NestLogger(AuthController.name);

  constructor() {
    this.logger.debug('Instance initialized');
  }
}
