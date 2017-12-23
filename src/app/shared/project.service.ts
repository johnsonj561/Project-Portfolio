import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ProjectService {

  // private instance variable to hold base url
  private projectUrl = '/api/project';

  // Resolve HTTP using the constructor
  constructor (private http: HttpClient) {}

  /**
   * Add new project to Project collection
   */
  addProject(formData): Observable<any> {
    return this.http.post(this.projectUrl, formData)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw('projectService.addProject error: ' + error));
  }

  /**
   * Update an existing project
   */
  updateProject(formData): Observable<any> {
    return this.http.put(this.projectUrl, formData)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw('projectService.updateProject error: ' + error));
  }

  /**
   * Get all projects from Project collection
   */
  getProjects(): Observable<any> {
    return this.http.get(this.projectUrl)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw('projectService.getProjects error: ' + error));
  }

  /**
   * Delete project from Project collections
   */
  deleteProject(projectName: string): Observable<any> {
    return this.http.delete(`${this.projectUrl}/${projectName}`)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw('projectService.deleteProject error: ' + error));
  }

}
