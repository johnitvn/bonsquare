import { SYSTEM_LANGUAGE_DEFAULT } from '@bonsquare/languages';
import { SystemEventMailingService } from '@bonsquare/system-event-mailing-service-proto';
import { getClientProvider, getTranslations, waitEmail } from '@bonsquare/testing';
import { Metadata } from '@grpc/grpc-js';
import { INestApplication } from '@nestjs/common';
import { ClientGrpc, ClientsModule } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import * as cheerio from 'cheerio';
import { createHash } from 'crypto';

describe('System Event Maling Service', () => {
  let app: INestApplication;
  let client: ClientGrpc;
  let service: SystemEventMailingService;

  beforeAll(async () => {
    const [host, port] = globalThis.__BASE_URL__.split(':');
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          getClientProvider('SystemEventMailingService', 'system-event-mailing-service', `${host}:${port}`)
        ])
      ]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    client = app.get('SystemEventMailingService');
    service = client.getService<SystemEventMailingService>('SystemEventMailingService');
  });

  afterAll(async () => {
    await app.close();
  });

  it('should ping success', async () => {
    await service.ping({}).toPromise();
  });

  describe('activation email', () => {
    it('should response with accepted and send email on default language', async () => {
      const timeHash = createHash('md5')
        .update(new Date().toISOString() + process.pid)
        .digest('hex');

      const fixtures = {
        firstName: 'John',
        lastName: 'Doe',
        email: `${timeHash}@email.com`,
        token: timeHash
      };

      await service.sendActivationEmail(fixtures).toPromise();

      // should sended email
      const { html, subject } = await waitEmail(fixtures.email);
      const $ = cheerio.load(html);
      const localize = getTranslations('system-event-mailing-service', SYSTEM_LANGUAGE_DEFAULT)['activation-email'];

      expect($('html').attr('lang')).toBe(SYSTEM_LANGUAGE_DEFAULT);
      expect(subject).toBe(localize.subject);

      expect($('title').text()).toBe(localize.subject);
    }, 10000);

    it('should response with accepted and send email with english language', async () => {
      const timeHash = createHash('md5')
        .update(new Date().toISOString() + process.pid)
        .digest('hex');

      const fixtures = {
        firstName: 'John',
        lastName: 'Doe',
        email: `${timeHash}@email.com`,
        token: timeHash
      };

      const language = 'en';
      const metadata = new Metadata();
      metadata.set('lang', language);

      await service.sendActivationEmail(fixtures, metadata).toPromise();

      // should sended email
      const { html, subject } = await waitEmail(fixtures.email);
      const $ = cheerio.load(html);
      const localize = getTranslations('system-event-mailing-service', language)['activation-email'];

      expect($('html').attr('lang')).toBe(language);
      expect(subject).toBe(localize.subject);

      expect($('title').text()).toBe(localize.subject);
    }, 10000);
  });
});
