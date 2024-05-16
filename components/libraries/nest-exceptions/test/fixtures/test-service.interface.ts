import { Observable } from 'rxjs';

export interface TestService {
  ping(args: object): Observable<void>;
}
