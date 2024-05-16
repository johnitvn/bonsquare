import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SMTPConfigService } from './config.service';
import { configurations } from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      load: [configurations]
    })
  ],
  providers: [SMTPConfigService],
  exports: [SMTPConfigService]
})
export class SMTPConfigModule {}
