import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth-service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notFoundUrl = router.createUrlTree(['/not-found']);

  if (!authService.hasToken()) {
    return notFoundUrl;
  }

  return authService.getCurrentUser().pipe(
    map((user) => {
      if (user.roles.includes('Admin')) {
        return true;
      }

      return notFoundUrl;
    }),
    catchError(() => {
      authService.clearCurrentUser();
      return of(notFoundUrl);
    })
  );
};
