import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SessionService } from '../../services/session.service';
import { SearchService } from '../../services/search.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  private query: string;
  private navbarData: any;
  private searchLoading: boolean;

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
    this.searchLoading = true;
    this.searchService.queryProjects(query)
      .subscribe(resp => {
        this.searchLoading = false;
        this.searchService.announceSearchResults(resp);
      });
  }

  clearSearch(): void {
    this.query = '';
    this.searchLoading = false;
    this.searchService.announceSearchResults({
      success: false
    });
  }

}
