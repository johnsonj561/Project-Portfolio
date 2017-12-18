import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../shared/project.service';

@Component({
  selector: 'app-edit-projects-page',
  templateUrl: './edit-projects.component.html',
  styleUrls: ['./edit-projects.component.css']
})
export class EditProjectsPageComponent implements OnInit {

  private formData: any = {};
  private formConfig: any = false;
  private displayAddForm = false;
  private displayEditForm = false;

  projectList = [];

  constructor(private projectService: ProjectService) { }

  ngOnInit() { }

  submitForm(formData): void {
    console.log('Edit Projects controller: formData', formData);
    this.projectService.addProject(formData)
      .subscribe(resp => {
        console.log('submitForm resp: ', resp);
      });
  }

  addProject(): void {
    this.formConfig = {
      title: 'Add New Project'
    };
  }

  cancelForm(): void {
    this.formConfig = false;
  }

}
