import { IdentityCredentials } from '@bonsquare/iam-service-proto';
import { Allow } from 'class-validator';

export class IdentityCredentialsDto implements IdentityCredentials {
  @Allow()
  email: string;

  @Allow()
  password: string;
}
