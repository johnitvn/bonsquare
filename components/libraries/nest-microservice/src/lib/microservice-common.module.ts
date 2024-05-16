import { SYSTEM_LANGUAGE_DEFAULT } from '@bonsquare/languages';
import { ClassValidationPipe, ResolvePromisesInterceptor } from '@bonsquare/nest-class-validation';
import { ExceptionInterceptor } from '@bonsquare/nest-exceptions';
import { ClassSerializerInterceptor, DynamicModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { NestI18nLoader } from 'components/libraries/nest-i18n-loader/src';
import { GrpcMetadataResolver, I18nModule } from 'nestjs-i18n';

@Module({})
export class MicroserviceCommonModule {
  static create(appModuleCls: any, i18Path: string): DynamicModule {
    return {
      module: MicroserviceCommonModule,
      imports: [
        appModuleCls,
        I18nModule.forRootAsync({
          resolvers: [new GrpcMetadataResolver(['lang'])],
          loader: NestI18nLoader,
          useFactory: () => ({
            fallbackLanguage: SYSTEM_LANGUAGE_DEFAULT,
            loaderOptions: {
              path: i18Path
            },
            throwOnMissingKey: true
          })
        })
      ],
      providers: [
        // Class validation features
        { provide: APP_PIPE, useClass: ClassValidationPipe },
        // ResolvePromisesInterceptor is used to resolve promises in responses because class-transformer can't do it
        // https://github.com/typestack/class-transformer/issues/549
        { provide: APP_INTERCEPTOR, useClass: ResolvePromisesInterceptor },
        // In the microservice we still use Http Exception for easy to re throw it via api-gateway
        // This exception interceptor will be convert http exception to rpc exception
        // And it will be reconvert to http exception again on api gateway
        { provide: APP_INTERCEPTOR, useClass: ExceptionInterceptor },
        // Add serialization feature
        // https://docs.nestjs.com/techniques/serialization
        { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor }
      ]
    };
  }
}
