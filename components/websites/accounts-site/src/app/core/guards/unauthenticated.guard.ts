import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from '../service/cookie-service';

export const UnauthenticatedGuard: CanActivateFn = () => {
  const cookie = inject(CookieService);
  const router = inject(Router);
  if (cookie.check('UserToken')) {
    router.navigateByUrl('/');
    return false;
  } else {
    return true;
  }
};
