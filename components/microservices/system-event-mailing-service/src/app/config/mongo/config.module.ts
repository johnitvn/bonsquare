import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoConfigService } from './config.service';
import { configurations } from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      load: [configurations]
    })
  ],
  providers: [MongoConfigService],
  exports: [MongoConfigService]
})
export class MongoConfigModule {}
