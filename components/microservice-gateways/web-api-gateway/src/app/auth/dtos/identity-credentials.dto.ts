import { IdentityCredentials } from '@bonsquare/iam-service-proto';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class IdentityCredentialsDto implements IdentityCredentials {
  @IsEmail({ allow_ip_domain: false, allow_display_name: false })
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
