import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { TokenService } from './token.service';
import { WindowRefService} from './window.ref.service';

/**
 * Session Service
 * Get session details and validate session
 */
@Injectable()
export class SessionService {

  private sessionUrl = '/api/session';
  private _window;
  private sessionInterval;
  private CHECK_SESSION_INTERVAL = 1000 * 10;

  // Observable session source & stream
  // Method for allowing bi-directional communication through service
  // https://angular.io/guide/component-interaction#parent-and-children-communicate-via-a-service
  private activeSessionSource = new Subject<boolean>();
  activeSession$ = this.activeSessionSource.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private windowRefService: WindowRefService,
    private router: Router) {
      this._window = windowRefService.nativeWindow;
  }

  /**
   * Get Session
   * Returns Observable that resolves to session details
   */
  getSession(): Observable<any> {
    if (this.tokenService.getToken()) {
      return this.http.get(this.sessionUrl)
        .map((res: Response) => res)
        .catch((error: any) => Observable.throw('SessionService.getSession() error: ' + error));
    } else {
      return Observable.throw('AuthService.getSession(): no session');
    }
  }


  /**
   * Start Session Interval
   * If valid session exists, create interval that checks for token expiration
   */
  startSessionInterval(): void {
    clearInterval(this.sessionInterval);
    const token = this.tokenService.getToken();
    if (token && this.tokenService.isValid(token)) {
      // create interval that checks for token expiration
      this.sessionInterval = setInterval(() => {
        if (!this.tokenService.isValid(token)) {
          clearInterval(this.sessionInterval);
          this.sessionInterval = false;
          this.announceActiveSession(false);
          this.router.navigate(['/']);
        }
      }, this.CHECK_SESSION_INTERVAL);
    } else {
      this.tokenService.setToken();
    }
  }

  /**
   * Announce Active Session
   * Publishes active/inactive session to subscribed components
   */
  announceActiveSession(active): void {
    this.activeSessionSource.next(active);
  }

}
