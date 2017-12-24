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
export class SpinnerService {

  // Observable main spinner source & stream
  // Method for allowing bi-directional communication through service
  // https://angular.io/guide/component-interaction#parent-and-children-communicate-via-a-service
  private mainSpinnerSource: Subject<boolean>;
  mainSpinner$;

  constructor() {
    this.mainSpinnerSource = new Subject<boolean>();
    this.mainSpinner$ = this.mainSpinnerSource.asObservable();
  }

  /**
   * Enable Spinner
   * Publishes spinner on/off to subscribed components
   */
  toggleSpinner(loading): void {
    this.mainSpinnerSource.next(loading);
  }


}
