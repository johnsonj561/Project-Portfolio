import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class SearchService {

  private collectionInitUrl = '/api/collection-init';
  private queryUrl = '/api/search';
  private searchResultSource: any;
  public searchResult$;

  constructor (private http: HttpClient) {
    this.searchResultSource = new Subject<any>();
    this.searchResult$ = this.searchResultSource.asObservable();
  }

  /**
   * Initialize Collection
   * Gets all projects and re-calcs tf-idf matrix
   * Writes collection tf-idf data to json
   */
  initCollection(): Observable<any> {
    return this.http.post(this.collectionInitUrl, {})
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw('SearchService.addProject error: ' + error));
  }

  /**
   * Query Projects
   * Runs search query on project list, returns ordered results
   */
  queryProjects(query): Observable<any> {
    return this.http.get(`${this.queryUrl}/${query}`)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw('SearchService.queryProjects error: ' + error));
  }

  /**
   * Announce Search Results
   * Publishes results to subscribed components
   */
  announceSearchResults(results): void {
    this.searchResultSource.next(results);
  }


}
