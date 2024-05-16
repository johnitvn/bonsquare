import { Observable } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export class Empty {}

export interface IdentityCredentials {
  email: string;
  password: string;
}

export interface IdentityInformation {
  id: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
}

export interface IAMService {
  ping(data: Empty): Observable<Empty>;
  identityVerification(data: IdentityCredentials): Observable<IdentityInformation>;
}
