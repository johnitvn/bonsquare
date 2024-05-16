import { Module } from '@nestjs/common';
import { SMTPConfigModule } from '../config/smtp/config.module';
import { MailerService } from './mailer.service';

@Module({
  imports: [SMTPConfigModule],
  providers: [MailerService],
  exports: [MailerService]
})
export class MailerModule {}
