import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../shared/project.service';
import { SpinnerService } from '../../shared/spinner.service';

@Component({
  selector: 'app-project-list-page',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectListPageComponent implements OnInit {

  private projectList: any = [];

  constructor(private projectService: ProjectService, private spinnerService: SpinnerService) { }

  ngOnInit() {
    this.loadProjects();
  }

  /**
   * Load Project List
   */
  private loadProjects(): void {
    this.spinnerService.toggleSpinner(true);
    this.projectService.getProjects()
      .subscribe(resp => {
        this.projectList = (resp.success) ? resp.data : [];
        this.projectList.map(project => {
          project.tags = project.tags.split(',').map(tag => tag.trim());
          return project;
        });
        console.log(this.projectList);
        this.spinnerService.toggleSpinner(false);
    });
  }

}
