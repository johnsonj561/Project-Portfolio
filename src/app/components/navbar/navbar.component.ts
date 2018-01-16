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

  private query: string;
  private navbarData: any;

  @Input() activeSession: boolean;

  constructor(
    private userService: UserService,
    private sessionService: SessionService,
    private searchService: SearchService,
    private router: Router) {}

  ngOnInit() {
    this.query = '';
  }

  logout(): void {
    this.userService.logout();
    this.sessionService.announceActiveSession(false);
    this.router.navigate(['/']);
  }

  search(query): void {
    this.searchService.queryProjects(query)
      .subscribe(resp => {
        this.searchService.announceSearchResults(resp);
      });
  }

  clearSearch(): void {
    this.query = '';
    this.searchService.announceSearchResults({
      success: false
    });
  }

}
