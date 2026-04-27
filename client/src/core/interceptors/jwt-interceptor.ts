import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  if (isPublicPhoneGetRequest(request.method, request.url)) {
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

function isPublicPhoneGetRequest(method: string, url: string): boolean {
  if (method !== 'GET') return false;

  const cleanUrl = url.split('?')[0];

  return /\/api\/phones(\/\d+)?$/.test(cleanUrl);
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
