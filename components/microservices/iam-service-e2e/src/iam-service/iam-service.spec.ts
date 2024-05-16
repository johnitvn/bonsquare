import { IAMService } from '@bonsquare/iam-service-proto';
import { getClientProvider, runJob } from '@bonsquare/testing';
import { status } from '@grpc/grpc-js';
import { INestApplication } from '@nestjs/common';
import { ClientGrpc, ClientsModule, Transport } from '@nestjs/microservices';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { workspaceRoot } from '@nx/devkit';
import { join } from 'path';

describe('IAM Service', () => {
  let app: INestApplication;
  let client: ClientGrpc;
  let service: IAMService;

  beforeAll(async () => {
    const [host, port] = globalThis.__BASE_URL__.split(':');
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ClientsModule.register([getClientProvider('IAMService', 'iam-service', `${host}:${port}`)])]
    }).compile();
    app = moduleFixture.createNestApplication(new FastifyAdapter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    client = app.get('IAMService');
    service = client.getService<IAMService>('IAMService');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('ping', () => {
    it('should ping success', async () => {
      await service.ping({}).toPromise();
    });
  });

  describe('signIn', () => {
    it('should signIn success', async () => {
      // fixtures
      const credentials = { email: 'admin@email.com', password: 'P@ssw0rd' };

      // call service
      const { result, error } = await runJob(service.identityVerification(credentials));

      // assets
      expect(error).toBeUndefined();
      expect(result).toHaveProperty('firstName');
      expect(result).toHaveProperty('lastName');
      expect(result).toHaveProperty('email', credentials.email);
      expect(result).toHaveProperty('id');
    });

    it('should response error when email is not found', async () => {
      // fixtures
      const credentials = { email: 'notfound@gmail.com', password: 'string' };

      // call service
      const { error } = await runJob(service.identityVerification(credentials));

      // assets
      expect(error).toBeDefined();
      expect(error.code).toBe(status.UNKNOWN);
      expect(JSON.parse(error.details)).toHaveProperty('description.email');
    });

    it('should response error when password is match', async () => {
      // fixtures
      const credentials = { email: 'admin@email.com', password: 'string' };

      // call service
      const { error } = await runJob(service.identityVerification(credentials));

      // assets
      expect(error).toBeDefined();
      expect(error.code).toBe(status.UNKNOWN);
      expect(JSON.parse(error.details)).toHaveProperty('description.password');
    });
  });
});
