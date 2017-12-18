import { Component, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-form',
  templateUrl: './category.form.component.html',
  styleUrls: ['./category.form.component.css']
})
export class CategoryFormComponent {

  @Output()
  formSubmitted: EventEmitter<any> = new EventEmitter();

  formData = {};

  constructor() { }

  submitForm(formData): void {
    this.formSubmitted.emit(formData);
  }

}
