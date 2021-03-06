import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { SessionService } from '../../services/session.service';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginPageComponent implements OnInit {

  formData: any = {
    error: false,
    success: false
  };

  formConfig: any = {
    title: 'Login',
    typeLogin: true
  };

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private sessionService: SessionService,
    private spinnerService: SpinnerService,
    private router: Router) { }

  ngOnInit() { }

  /**
   * Submit Form
   * Calls AuthService.authenticateUser(forData)
   */
  submitForm($event, formData): void {
    formData.error = formData.success = false;
    this.spinnerService.toggleSpinner(true);
    this.userService.authenticateUser(formData)
      .subscribe(resp => {
        if (!resp.success) {
          formData.error = resp.message;
          this.sessionService.announceActiveSession(false);
        } else {
          this.tokenService.setToken(resp.token);
          formData.success = resp.message + '. Redirecting home...';
          this.sessionService.announceActiveSession(true);
          this.sessionService.startSessionInterval();
          setTimeout(() => this.router.navigate(['/']), 2000);
        }
        this.spinnerService.toggleSpinner(false);
      });
  }

}
