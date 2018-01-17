import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SpinnerService } from '../../services/spinner.service';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-category-page',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryPageComponent implements OnInit {

  private error: string;
  private tagSubscription: any;
  private tag: string;
  private filteredProjectList: any = [];


  constructor(
    private spinnerService: SpinnerService,
    private location: Location,
    private projectService: ProjectService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.tagSubscription = this.route.params.subscribe(params => {
      this.tag = params['tag'];
      this.loadProjects(this.tag);
    });
  }

  private backPage(): void {
    this.location.back();
  }

  /**
   * Load Projects
   * Loads projects that contain this tag name
   */
  private loadProjects(tag) {
    this.spinnerService.toggleSpinner(true);
    this.projectService.getProjects()
      .subscribe(resp => {
        if(resp.success) {
          this.filteredProjectList = resp.data.map(project => {
            project.tags = project.tags.split(',');
            project.tags = project.tags.map(tag => tag.trim());
            return project;
          }).filter(project => project.tags.includes(this.tag));
        } else {
          this.error = `Error getting projects for ${this.tag}`;
        }
        this.spinnerService.toggleSpinner(false);
      });
  }

}
