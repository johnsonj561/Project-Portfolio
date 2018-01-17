import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SpinnerService } from '../../services/spinner.service';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-course-page',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CoursePageComponent implements OnInit {

  private error: string;
  private titleSubscription: any;
  private course: any = {};


  constructor(
    private spinnerService: SpinnerService,
    private location: Location,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.titleSubscription = this.route.params.subscribe(params => this.loadCourse(params['courseTitle']));
  }

  private backPage(): void {
    this.location.back();
  }

  private loadCourse(title): void {
    this.spinnerService.toggleSpinner(true);
    this.courseService.getCourse(title)
      .subscribe(resp => {
        if(resp.success) {
          this.course = resp.data;
        } else {
          this.error = 'Error fetching course details';
        }
        this.spinnerService.toggleSpinner(false);
      });
  }

  private viewProjects(course): void {  
    const navigationExtras = {
      queryParams: {
        'course': course.title
      }
    }
    this.router.navigate(['project-list'], navigationExtras);
  }

}
