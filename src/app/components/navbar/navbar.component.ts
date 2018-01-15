import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../shared/user.service';
import { SessionService } from '../../shared/session.service';
import { SearchService } from '../../shared/search.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  query;
  navbarData;
  spinnerOn = false;

  @Input() activeSession: boolean;

  constructor(
    private userService: UserService,
    private sessionService: SessionService,
    private searchService: SearchService,
    private router: Router) {}

  ngOnInit() {}

  logout(): void {
    this.userService.logout();
    this.sessionService.announceActiveSession(false);
    this.router.navigate(['/']);
  }

  search(query): void {
    console.log('Search on query: ', query);
    this.searchService.queryProjects(query)
      .subscribe(resp => {
        console.log('search query returned response: ', resp);
        this.searchService.announceSearchResults(resp);
      });
  }

  clearSearch(): void {
    this.searchService.announceSearchResults({
      success: false
    });
  }

}
