import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-form',
  templateUrl: './project.form.component.html',
  styleUrls: ['./project.form.component.css']
})
export class ProjectFormComponent implements OnInit {

  @Output()
  formSubmitted: EventEmitter<any> = new EventEmitter();
  @Output()
  formCancelled: EventEmitter<any> = new EventEmitter();
  @Output()
  projectDeleted: EventEmitter<any> = new EventEmitter();

  @Input() private formData: any;
  @Input() private formConfig: any;

  constructor() { }

  ngOnInit(): void {
    console.log('form init with data: ', this.formData);
  }

  submitForm(formData): void {
    this.formSubmitted.emit(formData);
  }

  cancelForm(): void {
    this.formCancelled.emit();
  }

  deleteProject(formData): void {
    this.projectDeleted.emit(formData);
  }

}
