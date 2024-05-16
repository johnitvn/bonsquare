import { AgendaService } from '@bonsquare/nest-agenda';
import { ActivationInfo } from '@bonsquare/system-event-mailing-service-proto';
import { Metadata } from '@grpc/grpc-js';
import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
@Controller()
export class AppController {
  constructor(private readonly agenda: AgendaService, private readonly logger: Logger) {
    this.logger.debug?.('Instance intialized', AppController.name);
  }

  @GrpcMethod('SystemEventMailingService', 'ping')
  ping() {
    this.logger.debug('Processing an ping request', AppController.name);
  }

  @GrpcMethod('SystemEventMailingService', 'sendActivationEmail')
  async sendActivationEmail(data: ActivationInfo, meta: Metadata): Promise<void> {
    this.logger.debug('Processing an send activation email', AppController.name);
    const lang = (meta as any).i18nLang;
    this.logger.verbose('payload=' + JSON.stringify({ ...data, lang }), AppController.name);
    await this.agenda.now('send-activation-email', { ...data, lang }), AppController.name;
  }
}
