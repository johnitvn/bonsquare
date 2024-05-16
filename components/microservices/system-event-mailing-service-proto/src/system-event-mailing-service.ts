import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Empty {}
export interface ActivationInfo {
  firstName: string;
  lastName: string;
  email: string;
  token: string;
}

export interface SystemEventMailingService {
  ping(data: Empty): Observable<Empty>;
  sendActivationEmail(data: ActivationInfo, metadata?: Metadata): Observable<Empty>;
}
