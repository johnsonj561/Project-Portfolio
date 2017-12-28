import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../shared/course.service';
import { ProjectService } from '../../shared/project.service';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-courses-page',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesPageComponent implements OnInit {

  private courseList = [];

  constructor(private courseService: CourseService, private projectService: ProjectService) { }

  ngOnInit() {
    this.loadCourses();
  }


  /**
   * Load Courses
   * Assigns all courses to courseList
   */
  private loadCourses(): void {
    Observable.forkJoin(this.courseService.getCourses(), this.projectService.getProjects())
      .subscribe(resp => {
        this.courseList = resp[0].data;
        this.courseList = resp[1].data.reduce((mem, project) => {
          mem[project.course] = mem[project.course] || 0;
          mem[project.course]++;
          return mem;
        }, this.courseList);
        console.log('forkjoin resp', resp);
      });
  }

}
