import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { TokenService } from './token.service';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class UserService {

  // private instance variable to hold base url
  private userUrl = '/api/user';
  private authUrl = '/api/authenticate';
  private sessionUrl = 'api/session';

  // Resolve HTTP using the constructor
  constructor (private http: HttpClient, private tokenService: TokenService) {}

  /**
   * Register New User
   */
  registerUser(formData): Observable<any> {
    return this.http.post(this.userUrl, formData)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw('UserService.registerUser error: ' + error));
  }

  /**
   * Authenticate User
   * Returns Observable that resolves to authentication success
   */
  authenticateUser(userData): Observable<any> {
    return this.http.post(this.authUrl, userData)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw('UserService.authenticateUser error: ' + error));
  }

  /**
  * Get Username
  * Returns Observable that resolves to username
  */
  getUsername(): Observable<any> {
    if (this.tokenService.getToken()) {
      return this.http.get(this.sessionUrl)
        .map((res: Response) => res)
        .catch((error: any) => Observable.throw('UserService.getUsername() error: ' + error));
    } else {
      return Observable.throw('UserService.getUsername(): no session');
    }
  }

  /**
   * Is Logged In
   * Returns true if valid token exists
   */
  isLoggedIn(): boolean {
    const token = this.tokenService.getToken();
    return !!(token && token !== null);
  }

  /**
   * Logout
   * Clears browser token
   */
  logout(): void {
    this.tokenService.setToken();
  }

}
