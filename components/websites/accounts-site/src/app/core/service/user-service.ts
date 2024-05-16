import { BehaviorSubject } from 'rxjs';
import { CookieService } from './cookie-service';

export class UserService {
  private static CURRENT_USER_KEY = 'current-user';
  public currentUser: BehaviorSubject<string>;

  constructor(private cookieService: CookieService) {}
}
