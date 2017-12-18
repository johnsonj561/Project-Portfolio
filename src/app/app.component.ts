import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { SessionService } from './shared/session.service';
import { TokenService } from './shared/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  /**
   * Subscribe to session to track active session
  */
  private sessionSubscription: Subscription;
  activeSession = false;

  constructor(private sessionService: SessionService, private tokenService: TokenService, private router: Router) { };

  ngOnInit(): void {
    const token = this.tokenService.getToken();
    this.activeSession = this.tokenService.isValid(token);
    this.sessionService.startSessionInterval();
    this.sessionSubscription = this.sessionService.activeSession$
      .subscribe(session => {
        this.activeSession = session;
        console.log('SESSION UPDTED: ', this.activeSession);
      });
  }

  ngOnDestroy() {
    this.sessionSubscription.unsubscribe();
  }

}
