import { BonsquareMicroservice } from '@bonsquare/nest-microservice';
import { join } from 'path';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const microservice = new BonsquareMicroservice('IAMService');
  await microservice.create(AppModule, {
    i18nPath: join(__dirname, 'i18n'),
    protoPath: join(__dirname, 'proto', 'iam-service.proto')
  });
  await microservice.start();
}

bootstrap();
