import { BonsquareApiGateway } from '@bonsquare/nest-api-gateway';
import { join } from 'path';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const apiGateway = new BonsquareApiGateway('WebApiGateway');
  await apiGateway.create(AppModule, {
    origin: ['*'],
    i18nPath: join(__dirname, 'i18n')
  });
  await apiGateway.start();
}

bootstrap();
