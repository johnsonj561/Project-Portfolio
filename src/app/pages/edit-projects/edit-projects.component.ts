import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../shared/project.service';
import { SpinnerService } from '../../shared/spinner.service';

@Component({
  selector: 'app-edit-projects-page',
  templateUrl: './edit-projects.component.html',
  styleUrls: ['./edit-projects.component.css']
})
export class EditProjectsPageComponent implements OnInit {

  private formData: any = {};
  private projectList = [];
  private formConfig: any = {};

  constructor(private projectService: ProjectService, private spinnerService: SpinnerService) { }

  ngOnInit(): void {
    this.loadProjects();
  }


  /**
   * Submit Form
   */
  submitForm(formData): void {
    formData.error = formData.success = false;
    const method = (this.formConfig.addProject) ? 'addProject' : 'updateProject';
    this.spinnerService.toggleSpinner(true);
    this.projectService[method](formData)
      .subscribe(resp => {
        if (resp.success) {
          formData.success = resp.message + '... Redirecting';
          this.loadProjects();
          setTimeout(() => this.cancelForm(), 1500);
        } else {
          formData.error = resp.message;
        }
        this.spinnerService.toggleSpinner(false);
      });
  }

  /**
   * Delete Project
   */
  deleteProject(formData): void {
    this.spinnerService.toggleSpinner(true);
    this.projectService.deleteProject(formData.name)
      .subscribe(resp => {
        if (resp.success) {
          this.formData.success = resp.message + '... Redirecting';
          this.loadProjects();
          setTimeout(() => this.cancelForm(), 1500);
        } else {
          this.formData.error = resp.message;
        }
        this.spinnerService.toggleSpinner(false);
      });
  }


  /**
   * Display New Project Form
   */
  displayNewProjectForm(): void {
    this.formConfig = {
      title: 'Add New Project',
      addProject: true
    };
  }

  /**
  * Display Edit Project Form
  */
  displayEditProjectForm(project): void {
    const formData = {};
    Object.keys(project).forEach(key => formData[key] = project[key]);
    this.formConfig = {
      title: 'Edit Project',
      editProject: true
    };
    this.formData = formData;
  }

  /**
   * Cancel Form
   */
  cancelForm(): void {
    this.formConfig = {};
    this.formData = {};
  }

  /**
   * Load Project List
   */
  private loadProjects(): void {
    this.spinnerService.toggleSpinner(true);
    this.projectService.getProjects()
      .subscribe(resp => {
        this.projectList = (resp.success) ? resp.data : [];
        this.spinnerService.toggleSpinner(false);
    });
  }

}
