import { SYSTEM_LANGUAGE_DEFAULT } from '@bonsquare/languages';
import { ClassValidationPipe, ResolvePromisesInterceptor } from '@bonsquare/nest-class-validation';
import { ExceptionInterceptor, ExceptionsFilter } from '@bonsquare/nest-exceptions';
import { NestI18nLoader } from '@bonsquare/nest-i18n-loader';
import { ClassSerializerInterceptor, DynamicModule, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AcceptLanguageResolver, HeaderResolver, I18nModule } from 'nestjs-i18n';

@Module({})
export class ApiGatewayCommonModule {
  static create(appModuleCls: any, i18Path: string): DynamicModule {
    return {
      module: ApiGatewayCommonModule,
      imports: [
        appModuleCls,
        I18nModule.forRootAsync({
          resolvers: [new HeaderResolver(['X-Custom-Lang']), AcceptLanguageResolver],
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
        { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
        // Exception filter is manager application behavior when exception orccure
        { provide: APP_FILTER, useClass: ExceptionsFilter }
      ]
    };
  }
}
