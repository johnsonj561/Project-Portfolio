import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../shared/user.service';
import { SessionService } from '../../shared/session.service';
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
    private router: Router) {}

  ngOnInit() {}

  search(query): void {
    console.log('Search on query: ', query);
  }

  logout(): void {
    this.userService.logout();
    this.sessionService.announceActiveSession(false);
    this.router.navigate(['/']);
  }

}
