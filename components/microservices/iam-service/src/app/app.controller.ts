import { Controller, Logger, UnprocessableEntityException } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { I18nService } from 'nestjs-i18n';
import { IdentityCredentialsDto } from './dtos/identity-credentials.dto';
import { IdentityInformationDto } from './dtos/identity-information.dto';
import { UserService } from './users/user.service';

@Controller()
export class AppController {
  constructor(private userService: UserService, private translater: I18nService, private logger: Logger) {
    this.logger.debug('Instance intialized', AppController.name);
  }

  @GrpcMethod('IAMService', 'ping')
  ping() {
    this.logger.debug('Processing an ping request', AppController.name);
  }

  @GrpcMethod('IAMService', 'identityVerification')
  async identityVerification(credentials: IdentityCredentialsDto): Promise<IdentityInformationDto> {
    this.logger.debug('Processing an sign in request');
    this.logger.verbose('payload=' + JSON.stringify(credentials));

    const { email, password } = credentials;
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      this.logger.verbose(`Email '${email}' is not found`);
      throw new UnprocessableEntityException({
        description: { email: this.translater.translate('sign-in.account-not-found') }
      });
    }

    if (user.password !== password) {
      this.logger.verbose(`Password for '${email}' is not match`);
      throw new UnprocessableEntityException({
        description: { password: this.translater.translate('sign-in.wrong-password') }
      });
    }

    const information = new IdentityInformationDto(user);
    return information;
  }
}
