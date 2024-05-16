import { IdentityInformation } from '@bonsquare/iam-service-proto';
import { UserDocument } from '../users/user.schema';

export class IdentityInformationDto implements IdentityInformation {
  id: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;

  constructor(user: UserDocument) {
    const { id, email, firstName, middleName, lastName } = user;
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
  }
}
