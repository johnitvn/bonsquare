import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AgendaConfigService } from './config.service';
import { configurations } from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      load: [configurations]
    })
  ],
  providers: [AgendaConfigService],
  exports: [AgendaConfigService]
})
export class AgendaConfigModule {}
