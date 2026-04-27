import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  if (!isApiRequest(request.url)) {
    return next(request);
  }

  const token = getToken();

  if (!token) {
    return next(request);
  }

  const authRequest = request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authRequest);
};

function isApiRequest(url: string): boolean {
  return url.startsWith(environment.apiUrl);
}

function getToken(): string | null {
  if (typeof localStorage === 'undefined') return null;

  const userJson = localStorage.getItem('user');
  if (!userJson) return null;

  try {
    const user = JSON.parse(userJson) as { token?: string };
    return user.token ?? null;
  } catch {
    return null;
  }
}
