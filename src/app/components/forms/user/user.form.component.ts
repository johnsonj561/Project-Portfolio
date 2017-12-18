import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user.form.component.html',
  styleUrls: ['./user.form.component.css']
})
export class UserFormComponent implements OnInit {

  @Output()
  formSubmitted: EventEmitter<any> = new EventEmitter();

  @Input() formData: string;

  @Input() formConfig: any;

  constructor() { }

  ngOnInit() {
  }

  submitForm(formData): void {
    this.formSubmitted.emit(formData);
  }

}
