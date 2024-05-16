import { Controller, Get, Logger } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { HeaderResolver, I18nLoader, I18nModule, I18nTranslation } from 'nestjs-i18n';
import { join } from 'path';
import { Observable } from 'rxjs';
import * as request from 'supertest';
import { ExceptionsFilter } from '../src/exception-filter';
import { ExceptionInterceptor } from '../src/exception-interceptor';
import { TestService } from '../test/fixtures/test-service.interface';

@Controller()
class TestController {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: '127.0.0.1:1234',
      package: 'grpc_test_service',
      protoPath: join(__dirname, 'fixtures/test.proto')
    }
  })
  private client!: ClientGrpc;

  @Get('/test')
  async test() {
    const grpcTestService = this.client.getService<TestService>('GrpcTestService');
    return grpcTestService.ping({});
  }
}

describe('Exception interceptors', () => {
  let appFixture: NestFastifyApplication;

  class I18nLoaeder extends I18nLoader {
    override async languages(): Promise<string[] | Observable<string[]>> {
      return ['en'];
    }
    override async load(): Promise<I18nTranslation | Observable<I18nTranslation>> {
      return {};
    }
  }

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      controllers: [TestController],
      imports: [
        I18nModule.forRoot({
          resolvers: [new HeaderResolver(['X-Custom-Lang'])],
          fallbackLanguage: 'en',
          loader: I18nLoaeder,
          loaderOptions: {}
        })
      ],
      providers: [
        Logger,
        { provide: APP_FILTER, useClass: ExceptionsFilter },
        { provide: APP_INTERCEPTOR, useClass: ExceptionInterceptor }
      ]
    }).compile();
    appFixture = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

    await appFixture.init();
    await appFixture.getHttpAdapter().getInstance().ready();
  });

  it('when cannot connect to microservice', async () => {
    return request(appFixture.getHttpServer())
      .get('/test') //
      .expect(500) //
      .expect({
        message: 'http.500'
      });
  });
});
