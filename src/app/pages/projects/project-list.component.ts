import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { CategoryService } from '../../services/category.service';
import { CourseService } from '../../services/course.service';
import { SpinnerService } from '../../services/spinner.service';

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
  private searchText: string;
  private tagFilter: string;
  private courseFilter: string;
  private paramsSub: any;

  constructor(
    private projectService: ProjectService,
    private categoryService: CategoryService,
    private courseService: CourseService,
    private spinnerService: SpinnerService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.paramsSub = this.route.queryParams.subscribe(params => {
      this.courseFilter = params.course || 'All';
      this.tagFilter = params.tag || 'All';
      this.loadProjects();
    });
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
        this.updatedFilteredList();
        this.spinnerService.toggleSpinner(false);
    });
  }

  /**
   * Load Tags
   * Popultes tag filter select input
   */
  private loadTags(): void {
    this.categoryService.getCategories()
      .subscribe(resp => this.tagList = (resp.success) ? resp.data : []);
  }

  /**
   * Load Courses
   * Populates course filter select input
   */
  private loadCourses(): void {
    this.courseService.getCourses()
      .subscribe(resp => this.courseList = (resp.success) ? resp.data.map(course => course.title) : []);
  }

  /**
   * Apply filters to project list
   * Must apply both course and tag filters
   */
  private updatedFilteredList(): void {
    this.filteredProjectList = this.applyFilter['course'](this.projectList, this.courseFilter);
    this.filteredProjectList = this.applyFilter['tag'](this.filteredProjectList, this.tagFilter);
  }

  /**
   * Clear All Filters
   */
  private clearFilters(): void {
    this.filteredProjectList = this.projectList.slice();
    this.searchText = '';
    this.tagFilter = this.courseFilter = 'All';
  }

  /**
   * Apply Filter Functions
   */
  private applyFilter: any = {
    'course': function(arr, filter) {
      return (filter.toLowerCase() === 'all') ?
        arr.slice() :
        arr.slice().filter(project => project.course.toLowerCase() === filter.toLowerCase());
    },
    'tag': function(arr, filter) {
      return (filter.toLowerCase() === 'all') ?
        arr.slice() :
        arr.slice().filter(project => project.tags
          .map(tag => tag.toLowerCase())
          .includes(filter.toLowerCase()));
    }
  }

}
