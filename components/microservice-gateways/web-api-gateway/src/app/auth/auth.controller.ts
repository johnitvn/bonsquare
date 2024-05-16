import { NestLogger } from '@bonsquare/nest-logger';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IdentityCredentialsDto } from './dtos/identity-credentials.dto';
import { IdentityTokenDto } from './dtos/identity-information.dto';

@Controller('auth')
export class AuthController {
  private logger = new NestLogger(AuthController.name);

  constructor(private authService: AuthService) {
    this.logger.debug('Instance intialized');
  }

  @Post()
  @HttpCode(202)
  signIn(@Body() credentials: IdentityCredentialsDto): Promise<IdentityTokenDto> {
    this.logger.debug('Processing an sign in request', AuthController.name);
    this.logger.verbose({ credentials });
    const response = this.authService.signIn(credentials);
    this.logger.verbose({ response });
    return response;
  }
}
