import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import { ProjectService } from '../../shared/project.service';
import { SpinnerService } from '../../shared/spinner.service';

@Component({
  selector: 'app-project-page',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectPageComponent implements OnInit, OnDestroy {

  private nameSubscription: any;
  private projectName: String;
  private project: any = {};
  private error: String;

  constructor(
    private projectService: ProjectService,
    private spinnerService: SpinnerService,
    private route: ActivatedRoute,
    private _location: Location) { }

  ngOnInit() {
    this.nameSubscription = this.route.params.subscribe(params => this.loadProject(params['projectName']));
  }

  ngOnDestroy() {
    this.nameSubscription.unsubscribe();
  }

  loadProject(projectName): void {
    this.spinnerService.toggleSpinner(true);
    this.projectService.getProject(projectName)
      .subscribe(resp => {
        if (resp.success) {
          this.project = resp.data;
          this.project.tags = this.project.tags || '';
          this.project.tags = this.project.tags.split(',').map(tag => tag.trim());
        } else {
          this.error = 'Error fetching project details';
        }
        this.spinnerService.toggleSpinner(false);
      });
  }

  backPage(): void {
    this._location.back();
  }

}
