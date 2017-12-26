import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../shared/project.service';
import { CategoryService } from '../../shared/category.service';
import { CourseService } from '../../shared/course.service';
import { SpinnerService } from '../../shared/spinner.service';

@Component({
  selector: 'app-project-list-page',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectListPageComponent implements OnInit {

  private projectList: any = [];
  private filteredProjectList: any = [];
  private tagList: any = [];
  private courseList: any = [];
  private searchText: String;
  private tagFilter: String = 'All';
  private courseFilter: String = 'All';

  constructor(
    private projectService: ProjectService,
    private categoryService: CategoryService,
    private courseService: CourseService,
    private spinnerService: SpinnerService) { }

  ngOnInit() {
    this.loadProjects();
    this.loadTags();
    this.loadCourses();
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
        this.filteredProjectList = this.projectList.slice();
        this.spinnerService.toggleSpinner(false);
    });
  }

  /**
   * Load Tags
   * Assigns array of available tags
   */
  private loadTags(): void {
    this.categoryService.getCategories()
      .subscribe(resp => this.tagList = (resp.success) ? resp.data : []);
  }

  /**
   * Load Courses
   * Assigns array of available courses
   */
  private loadCourses(): void {
    this.courseService.getCourses()
      .subscribe(resp => this.courseList = (resp.success) ? resp.data.map(course => course.title) : []);
  }

  /**
   * Tag Filter Change
   * Filter project list to projects with tag === value
   */
  private tagFilterChange(value): void {
    this.filteredProjectList = this.projectList.slice();
    if (value.toLowerCase() !== 'all') {
      this.filteredProjectList = this.filteredProjectList
        .filter(project => project.tags
          .map(tag => tag.toLowerCase())
          .includes(value.toLowerCase()));
    }
  }

  /**
   * Course Filter Change
   * Filter project list to projects with course.title === value
   */
  private courseFilterChange(value): void {
    this.filteredProjectList = this.projectList.slice();
    if (value.toLowerCase() !== 'all') {
      this.filteredProjectList = this.filteredProjectList
        .filter(project => project.course)
        .filter(project => project.course.toLowerCase() === value.toLowerCase());
    }
  }

  /**
   * Clear All Filters
   */
  private clearFilters(): void {
    this.filteredProjectList = this.projectList.slice();
    this.searchText = '';
    this.tagFilter = this.courseFilter = 'All';
  }

}
