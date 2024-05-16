import { IdentityInformation } from '@bonsquare/iam-service-proto';

export class IdentityTokenDto implements IdentityInformation {
  id: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  token: string;
}
