import { Controller, Get, Logger, UnprocessableEntityException } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { HeaderResolver, I18nLoader, I18nModule, I18nTranslation } from 'nestjs-i18n';
import { Observable } from 'rxjs';
import * as request from 'supertest';
import { ExceptionsFilter } from '../src/exception-filter';

jest.mock('@bonsquare/nest-logger');

@Controller()
class TestController {
  @Get('/error')
  error() {
    throw new Error('Test testing error');
  }

  @Get('/error-description')
  async description() {
    throw new UnprocessableEntityException({ description: 'testing' });
  }
}

class I18nLoaeder extends I18nLoader {
  override async languages(): Promise<string[] | Observable<string[]>> {
    return ['en'];
  }
  override async load(): Promise<I18nTranslation | Observable<I18nTranslation>> {
    return {};
  }
}

describe('Exception filter', () => {
  let appFixture: NestFastifyApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      controllers: [TestController],
      imports: [
        I18nModule.forRoot({
          resolvers: [new HeaderResolver(['X-Custom-Lang'])],
          fallbackLanguage: 'en',
          loader: I18nLoaeder,
          loaderOptions: {},
          throwOnMissingKey: false
        })
      ],
      providers: [Logger, { provide: APP_FILTER, useClass: ExceptionsFilter }]
    }).compile();
    appFixture = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await appFixture.init();
    await appFixture.getHttpAdapter().getInstance().ready();
  });

  it('should response with status 404 and message', () => {
    return request(appFixture.getHttpServer())
      .get('/not-found') //
      .expect(404) //
      .expect({ message: 'http.404' });
  });

  it('should response with status 500 and message', async () => {
    return request(appFixture.getHttpServer())
      .get('/error') //
      .expect(500) //
      .expect({ message: 'http.500' });
  });

  it('should response with status 422 and message, description', async () => {
    return request(appFixture.getHttpServer())
      .get('/error-description') //
      .expect(422) //
      .expect({ message: 'http.422', description: 'testing' });
  });
});
