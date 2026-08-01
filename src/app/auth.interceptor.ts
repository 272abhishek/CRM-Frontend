import {
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchError,
  throwError
} from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);

  // Login request me token mat bhejo
  if (
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register')
  ) {
    return next(req);
  }

  const token = localStorage.getItem('jwt');

  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  return next(authReq).pipe(

    catchError((error: HttpErrorResponse) => {

      if (
        error.status === 401 ||
        error.status === 403
      ) {

        localStorage.clear();
        sessionStorage.clear();

        // Clear cookies
        document.cookie
          .split(';')
          .forEach(cookie => {

            const name =
              cookie.split('=')[0].trim();

            document.cookie =
              `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
          });

        // Login page par already ho to redirect mat karo
        if (
          router.url !== '/login'
        ) {

          router.navigate(
            ['/login'],
            {
              replaceUrl: true
            }
          );

        }

      }

      return throwError(() => error);

    })

  );

};