import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class CourseService {

  private courseUrl = '/api/course';
  private coursesUrl = '/api/courses';

  constructor (private http: HttpClient) {}

  /**
   * Add new course to DB
   */
  addCourse(formData): Observable<any> {
    return this.http.post(this.courseUrl, formData)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw('courseService.addCourse error: ' + error));
  }

  /**
   * Update an existing course
   */
  updateCourse(formData): Observable<any> {
    return this.http.put(this.courseUrl, formData)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw('courseService.updateCourse error: ' + error));
  }

  /**
   * Get all courses from DB
   */
  getCourses(): Observable<any> {
    return this.http.get(this.coursesUrl)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw('courseService.getCourses error: ' + error));
  }

  /**
   * Get course with courseTitle
   */
  getCourse(courseTitle: string): Observable<any> {
    return this.http.get(`${this.courseUrl}/${courseTitle}`)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw('courseService.getCourse error: ' + error));
  }

  /**
   * Delete category from DB
   */
  deleteCourse(courseTitle: string): Observable<any> {
    return this.http.delete(`${this.courseUrl}/${courseTitle}`)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw('courseService.deleteCourse error: ' + error));
  }

}
