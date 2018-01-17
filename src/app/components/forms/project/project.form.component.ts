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
    // if no implementations, add empty row
    this.formData.implementation = this.formData.implementation || [''];
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

  addImplementationRow(): void {
    this.formData.implementation.push('');
  }

  deleteImplementationRow(idx): void {
    // if the last row, clear it instead of splicing it
    if (this.formData.implementation.length === 1) {
      this.formData.implementation = [''];
    } else {
      this.formData.implementation.splice(idx, 1);
    }
  }

  trackByFn(index: any, item: any) {
   return index;
  }

}
