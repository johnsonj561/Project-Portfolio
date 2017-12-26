import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../shared/course.service';
import { SpinnerService } from '../../shared/spinner.service';

@Component({
  selector: 'app-edit-courses-page',
  templateUrl: './edit-courses.component.html',
  styleUrls: ['./edit-courses.component.css']
})
export class EditCoursesPageComponent implements OnInit {

  private courseList = [];
  private formData: any = {};
  private formConfig: any = {};


  constructor(private courseService: CourseService, private spinnerService: SpinnerService) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  /**
   * Submit Form
   */
  submitForm(formData): void {
    formData.error = formData.success = false;
    const method = (this.formConfig.addCourse) ? 'addCourse' : 'updateCourse';
    this.spinnerService.toggleSpinner(true);
    this.courseService[method](formData)
      .subscribe(resp => {
        if (resp.success) {
          formData.success = resp.message + '... Redirecting';
          this.loadCourses();
          setTimeout(() => this.cancelForm(), 1500);
        } else {
          formData.error = resp.message;
        }
        this.spinnerService.toggleSpinner(false);
      });
  }

  /**
   * Delete Course
   */
  deleteCourse(formData): void {
    this.spinnerService.toggleSpinner(true);
    this.courseService.deleteCourse(formData.title)
      .subscribe(resp => {
        if (resp.success) {
          this.formData.success = resp.message + '... Redirecting';
          this.loadCourses();
          setTimeout(() => this.cancelForm(), 1500);
        } else {
          this.formData.error = resp.message;
        }
        this.spinnerService.toggleSpinner(false);
      });
  }


  /**
   * Display New Course Form
   */
  displayNewCourseForm(): void {
    this.formConfig = {
      title: 'Add New Course',
      addCourse: true
    };
  }

  /**
  * Display Edit Course Form
  */
  displayEditCourseForm(course): void {
    const formData = {};
    Object.keys(course).forEach(key => formData[key] = course[key]);
    this.formConfig = {
      title: 'Edit Course',
      editCourse: true
    };
    this.formData = formData;
  }

  /**
   * Cancel Form
   */
  cancelForm(): void {
    this.formConfig = {};
    this.formData = {};
  }

  /**
   * Load Project List
   */
  private loadCourses(): void {
    this.spinnerService.toggleSpinner(true);
    this.courseService.getCourses()
      .subscribe(resp => {
        this.courseList = (resp.success) ? resp.data : [];
        this.spinnerService.toggleSpinner(false);
    });
  }

}
