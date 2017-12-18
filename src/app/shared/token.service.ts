import { Injectable } from '@angular/core';
import { WindowRefService } from './window.ref.service';

/**
 * Token Service
 * Handles token's local storage
 */
@Injectable()
export class TokenService {

  _window;

  constructor(private windowRefService: WindowRefService) {
    this._window = windowRefService.nativeWindow;
  }

  /**
   * Store token in browser local storage
   */
  setToken(token?: any): void {
    if (token) {
      this._window.localStorage.setItem('token', token);
    } else {
      this._window.localStorage.removeItem('token');
    }
  }

  /**
   * Get Token from browser local storage
   */
  getToken(): any {
    return this._window.localStorage.getItem('token');
  }

  /**
   * Is Valid Token
   * Returns true if token exists and has not expired
   */
  isValid(token): boolean {
    if (token === null || token === undefined) {
      return false;
    } else {
      const expireTime = this.parseJwt(token);
      const timeStamp = Math.floor(Date.now() / 1000);
      const timeLeft = expireTime.exp - timeStamp;
      if (timeLeft <= 0) {
        return false;
      }
    }
    return true;
  }

  /**
   * Parse JSON Web Token
   * Return parsed
   */
  private parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('.', '+').replace('_', '/');
    return JSON.parse(this._window.atob(base64));
  }

}
