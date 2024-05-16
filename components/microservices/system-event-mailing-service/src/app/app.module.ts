import { AgendaModule } from '@bonsquare/nest-agenda';
import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppProcessor } from './app.processor';
import { AgendaConfigModule } from './config/agenda/config.module';
import { AgendaConfigService } from './config/agenda/config.service';
import { AppConfigModule } from './config/app/config.module';
import { MongoConfigModule } from './config/mongo/config.module';
import { MongoConfigService } from './config/mongo/config.service';
import { MailerModule } from './mailer/mailer.module';
import { TemplateModule } from './template/template.module';

@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRootAsync({
      imports: [MongoConfigModule],
      inject: [MongoConfigService],
      useFactory: async (config: MongoConfigService) => ({
        uri: config.uri
      })
    }),
    AgendaModule.forRootAsync({
      imports: [AgendaConfigModule, MongoConfigModule],
      inject: [AgendaConfigService, MongoConfigService],
      useFactory: async (agendaConfig: AgendaConfigService, mongoConfig: MongoConfigService) => ({
        db: {
          address: mongoConfig.uri,
          collection: 'system-event-emails'
        },
        defaultConcurrency: agendaConfig.maxConcurent,
        maxConcurrency: agendaConfig.maxConcurent
      })
    }),
    TemplateModule,
    MailerModule
  ],
  controllers: [AppController],
  providers: [AppProcessor, Logger]
})
export class AppModule {}
