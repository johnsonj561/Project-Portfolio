import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../../shared/search.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomePageComponent implements OnInit {

  constructor(private router: Router, private searchService: SearchService) { }

  ngOnInit() { }

  private navigate(page): void {
    this.router.navigate([`/${page}`]);
  }

  private initCollection(): void {
    this.searchService.initCollection()
      .subscribe(resp => {
        console.log('initCollection response: ', resp);
      })
  }

}
