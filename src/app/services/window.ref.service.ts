import { Injectable } from '@angular/core';

function _window(): any {
   return window;
}

/**
 * Window Reference Service
 * Provide window DI to the app
 */
@Injectable()
export class WindowRefService {
  get nativeWindow(): any {
    return _window();
  }
}
