import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterPageComponent implements OnInit {

  formData: any = {
    error: false,
    success: false
  };

  formConfig: any = {
    title: 'Registration',
    typeRegister: true
  };

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  /**
   * Submit Form
   * Calls UserService.registerUser(formData)
   */
  submitForm($event, formData): void {
    formData.error = formData.success = false;
    this.userService.registerUser(formData)
      .subscribe(resp => {
        if (!resp.success) {
          formData.error = resp.message;
        } else {
          formData.success = resp.message + '. Redirecting home...';
          setTimeout(() => this.router.navigate(['/']), 2000);
        }
      });
  }

}
