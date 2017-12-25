import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpinnerService } from './../../shared/spinner.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-main-spinner',
  templateUrl: './main.spinner.component.html',
  styleUrls: ['./main.spinner.component.css']
})
export class MainSpinnerComponent implements OnInit, OnDestroy {

  private loadingSubscription: Subscription;
  private loading: boolean;
  private loadingText: String;
  private loadingMessages = [
    'Please hold while I eat these circles...',
    'Un Momento, Por Favor...',
    'Me so busy, you wait...',
    'Nom Nom Nommmm...',
    'Pacman Hungry...'
  ];

  constructor(private spinnerService: SpinnerService) {}

  /**
   * OnInit
   * Subscribes to Spinner Service mainSpinner$
   */
  ngOnInit(): void {
    this.loadingSubscription = this.spinnerService.mainSpinner$
      .subscribe(loading => {
        const ran = Math.floor(Math.random() * this.loadingMessages.length);
        this.loadingText = this.loadingMessages[ran];
        this.loading = loading;
      });
  }

  /**
   * OnDestroy
   * Unsubscribe from Spinnner Service mainSpinner$
   */
  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
  }

}
