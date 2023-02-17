import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as loginActions from '../actions/login.actions';
import { map, catchError, exhaustMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from 'angular-toastify';
import { LoginResult } from '../../models/auth';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private auth: AuthService,
    private toast: ToastService,
    private router: Router
  ) {}

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loginActions.login),
      exhaustMap(action => {
        return this.auth.logIn(action).pipe(
          map(({ accessToken }: LoginResult) => {
            this.auth.saveToken(accessToken);
            this.router.navigate(['home']);
            return loginActions.loginSuccess({ accessToken });
          }),
          catchError(({ message }: Error) => {
            this.toast.error(message);
            return of(loginActions.loginFailure({ error: message }));
          })
        );
      })
    );
  });

  logOut$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(loginActions.logout),
        tap(() => {
          this.auth.logOut();
          this.router.navigate(['/login']);
        })
      );
    },
    { dispatch: false }
  );
}
