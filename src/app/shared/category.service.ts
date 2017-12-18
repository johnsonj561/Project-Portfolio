import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class CategoryService {

  // private instance variable to hold base url
  private categoryUrl = '/api/category';

  // Resolve HTTP using the constructor
  constructor (private http: HttpClient) {}

  /**
   * Add new category to DB
   */
  addCategory(formData): Observable<any> {
    return this.http.post(this.categoryUrl, formData)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw('categoryService.addCategory error: ' + error));
  }

  /**
   * Get all categories from DB
   */
  getCategories(): Observable<any> {
    return this.http.get(this.categoryUrl)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw('categoryService.getCategories error: ' + error));
  }

  /**
   * Delete category from DB
   */
  deleteCategory(categoryName: string): Observable<any> {
    return this.http.delete(`${this.categoryUrl}/${categoryName}`)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw('categoryService.deleteCategory error: ' + error));
  }

}
