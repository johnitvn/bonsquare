import { Injectable, Logger } from '@nestjs/common';
import { ConnectionString } from 'connection-string';
import { SendMailOptions, Transporter, createTransport } from 'nodemailer';
import { SMTPConfigService } from '../config/smtp/config.service';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private sender: string;
  private transporter: Transporter;

  constructor(private smtpConfig: SMTPConfigService) {
    const connection = new ConnectionString(smtpConfig.uri);
    this.transporter = createTransport({
      host: connection.hosts[0].name,
      port: connection.hosts[0].port,
      secure: connection.protocol === 'smtps',
      auth: {
        user: connection.user,
        pass: connection.password
      },
      ...connection.params
    });
    this.sender = smtpConfig.sender;
  }

  send(options: Omit<SendMailOptions, 'sender' | 'replyTo' | 'inReplyTo' | 'from'>) {
    return this.transporter.sendMail({ ...options, from: this.sender });
  }
}
