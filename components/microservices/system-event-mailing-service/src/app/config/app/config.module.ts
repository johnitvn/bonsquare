import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './config.service';
import { configurations } from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      load: [configurations]
    })
  ],
  providers: [AppConfigService],
  exports: [AppConfigService]
})
export class AppConfigModule {}
