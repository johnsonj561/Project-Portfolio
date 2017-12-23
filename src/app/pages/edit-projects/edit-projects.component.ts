import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../shared/project.service';

@Component({
  selector: 'app-edit-projects-page',
  templateUrl: './edit-projects.component.html',
  styleUrls: ['./edit-projects.component.css']
})
export class EditProjectsPageComponent implements OnInit {

  private formData: any = {};
  private projectList = [];
  private formConfig: any = {};

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
    this.loadProjects();
  }


  /**
   * Submit Form
   */
  submitForm(formData): void {
    formData.error = formData.success = false;
    const apiData = this.prepareFormData(formData);
    const method = (this.formConfig.addProject) ? 'addProject' : 'updateProject';
    this.projectService[method](apiData )
      .subscribe(resp => {
        if (resp.success) {
          formData.success = resp.message + '... Redirecting';
          this.loadProjects();
          setTimeout(() => this.cancelForm(), 1500);
        } else {
          formData.error = resp.message;
        }
      });
  }

  /**
   * Delete Project
   */
  deleteProject(formData): void {
    this.projectService.deleteProject(formData.name)
      .subscribe(resp => {
        if (resp.success) {
          this.formData.success = resp.message + '... Redirecting';
          this.loadProjects();
          setTimeout(() => this.cancelForm(), 1500);
        } else {
          this.formData.error = resp.message;
        }
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
    formData['tags'] = (formData['tags']) ? formData['tags'].join(', ') : undefined;
    formData['implementation'] = (formData['implementation']) ? formData['implementation'].join(', ') : undefined;
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
   * Prepare form data for API call
   */
  private prepareFormData(formData: any): any {
    const apiData = {};
    Object.keys(formData).forEach(key => apiData[key] = formData[key]);
    if (apiData['tags']) {
      apiData['tags'] = apiData['tags'].split(',').map(item => item.trim());
    }
    if (apiData['implementation']) {
      apiData['implementation'] = apiData['implementation'].split(',').map(item => item.trim());
    }
    return formData;
  }

  /**
   * Load Project List
   */
  private loadProjects(): void {
    this.formConfig.loading = true;
    this.projectService.getProjects()
      .subscribe(resp => {
        this.projectList = (resp.success) ? resp.data : [];
        this.formConfig.loading = false;
    });
  }

}
