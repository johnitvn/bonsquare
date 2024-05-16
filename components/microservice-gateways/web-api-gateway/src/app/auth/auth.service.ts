import { IAMService } from '@bonsquare/iam-service-proto';
import { NestLogger } from '@bonsquare/nest-logger';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { Inject, Injectable, OnModuleInit, ServiceUnavailableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientGrpc } from '@nestjs/microservices';
import { I18nService } from 'nestjs-i18n';
import { catchError, delay, of, retry, throwError, timeout } from 'rxjs';
import { IdentityCredentialsDto } from './dtos/identity-credentials.dto';
import { IdentityTokenDto } from './dtos/identity-information.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  private logger = new NestLogger(AuthService.name);
  private iamService: IAMService;

  private readonly RETRY_ATTEMPTS = 10;
  private readonly TIMEOUT_DURATION = 5000;
  private readonly RETRY_DELAY = 500;

  constructor(
    @Inject('IAMService') private readonly client: ClientGrpc,
    private readonly jwtService: JwtService,
    private translater: I18nService
  ) {
    this.logger.debug('Instance initialized');
  }

  onModuleInit() {
    this.logger.debug('Initializing IAM service', AuthService.name);
    this.iamService = this.client.getService<IAMService>('IAMService');
  }

  async signIn(credentials: IdentityCredentialsDto): Promise<IdentityTokenDto> {
    this.logger.debug('Processing sign in');
    this.logger.verbose({ credentials });

    try {
      const identityInformation = await this.iamService
        .identityVerification(credentials)
        .pipe(
          timeout(this.TIMEOUT_DURATION),
          retry({
            count: this.RETRY_ATTEMPTS,
            delay: (error, retryCount) => {
              if (error.code !== Status.UNAVAILABLE || retryCount >= this.RETRY_ATTEMPTS) {
                return throwError(() => error);
              }
              this.logger.warn(`Retry attempt ${retryCount + 1} due to error: ${error.message}`);
              return of(error).pipe(delay(this.RETRY_DELAY));
            }
          }),
          catchError((error) => {
            this.logger.error(`Failed to verify identity: ${error.message}`);
            if (error.code == Status.UNAVAILABLE) {
              return throwError(
                () =>
                  new ServiceUnavailableException({
                    description: this.translater.translate('errors.service-unvaiable', {
                      args: { service: 'IAMService' }
                    })
                  })
              );
            } else {
              return throwError(() => error);
            }
          })
        )
        .toPromise();

      this.logger.verbose({ identityInformation });

      const token = await this.jwtService.signAsync({ sub: identityInformation.id });
      this.logger.verbose({ token });

      return { ...identityInformation, token };
    } catch (error) {
      this.logger.error(`Error during sign in: ${error.message}`, error.stack);
      throw error; // Re-throw the error or handle it as needed
    }
  }
}
