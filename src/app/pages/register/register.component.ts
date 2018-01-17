import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { SpinnerService } from '../../services/spinner.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterPageComponent {

  formData: any = {
    error: false,
    success: false
  };

  formConfig: any = {
    title: 'Registration',
    typeRegister: true
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private spinnerService: SpinnerService) { }

  /**
   * Submit Form
   * Calls UserService.registerUser(formData)
   */
  submitForm($event, formData): void {
    formData.error = formData.success = false;
    this.spinnerService.toggleSpinner(true);
    this.userService.registerUser(formData)
      .subscribe(resp => {
        if (!resp.success) {
          formData.error = resp.message;
        } else {
          formData.success = resp.message + '. Redirecting home...';
          setTimeout(() => this.router.navigate(['/']), 2000);
        }
        this.spinnerService.toggleSpinner(false);
      });
  }

}
