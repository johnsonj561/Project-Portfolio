import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-form',
  templateUrl: './course.form.component.html',
  styleUrls: ['./course.form.component.css']
})
export class CourseFormComponent implements OnInit {

  @Output()
  formSubmitted: EventEmitter<any> = new EventEmitter();
  @Output()
  formCancelled: EventEmitter<any> = new EventEmitter();
  @Output()
  courseDeleted: EventEmitter<any> = new EventEmitter();

  @Input() private formData: any;
  @Input() private formConfig: any;

  constructor() { }

  ngOnInit(): void {
    console.log('form init with data: ', this.formData);
    // if no topics, add empty row
    this.formData.topics = this.formData.topics || [''];
  }

  submitForm(formData): void {
    this.formSubmitted.emit(formData);
  }

  cancelForm(): void {
    this.formCancelled.emit();
  }

  deleteCourse(formData): void {
    this.courseDeleted.emit(formData);
  }

  addTopicRow(): void {
    this.formData.topics.push('');
  }

  deleteTopicRow(idx): void {
    // if the last row, clear it instead of splicing it
    if (this.formData.topics.length === 1) {
      this.formData.topics = [''];
    } else {
      this.formData.topics.splice(idx, 1);
    }
  }

  trackByFn(index: any, item: any) {
   return index;
  }

}
