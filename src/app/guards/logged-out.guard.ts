import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { TokenService } from '../shared/token.service';

@Injectable()
export class LoggedOutGuard implements CanActivate {

  constructor(private tokenService: TokenService) {}

  canActivate() {
    const token = this.tokenService.getToken();
    return !this.tokenService.isValid(token);
  }
}
