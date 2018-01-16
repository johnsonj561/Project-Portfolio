import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../../shared/search.service';

@Component({
  selector: 'app-side-panel-component',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css']
})
export class SidePanelComponent implements OnInit {

  private searchResultSubscription: any;
  private searchResults: any = [];
  private query: string;

  constructor(private router: Router, private searchService: SearchService) { }

  ngOnInit() {
    this.searchResultSubscription = this.searchService.searchResult$
      .subscribe(results => {
        if(results.success) {
          this.searchResults = results.data.data;
          this.query = results.data.query;
        } else {
          this.searchResults = [];
        }
      });
  }

  /**
   * Navigate to page
   */
  private navigate(page): void {
    this.router.navigate([`/${page}`]);
  }

  private clearSearch(): void {
    this.searchResults = [];
  }


}
