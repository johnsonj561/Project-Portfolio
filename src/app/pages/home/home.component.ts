import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../../shared/search.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomePageComponent implements OnInit {

  private searchResultSubscription: any;
  private searchResults: any = [];

  constructor(private router: Router, private searchService: SearchService) { }

  ngOnInit() {
    this.searchResultSubscription = this.searchService.searchResult$
      .subscribe(results => {
        this.searchResults = (results.success) ? results.data : [];
      });
  }

  /**
   * Navigate to page
   */
  private navigate(page): void {
    this.router.navigate([`/${page}`]);
  }

  /**
   * Initialize Collection
   * Creates new collection index from all projects in storage
   */
  private initCollection(): void {
    this.searchService.initCollection()
      .subscribe(resp => {
        console.log('initCollection response: ', resp);
      })
  }

  private clearSearch(): void {
    this.searchResults = [];
  }




}
