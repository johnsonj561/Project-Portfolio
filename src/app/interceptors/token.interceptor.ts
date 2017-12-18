import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { TokenService } from '../shared/token.service';
import { Observable } from 'rxjs/Observable';

/**
 * Appends token to request object
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public tokenService: TokenService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenService.getToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          'x-access-token': token
        }
      });
    }
    return next.handle(request);
  }
}
