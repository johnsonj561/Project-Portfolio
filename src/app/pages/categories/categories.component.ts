import { Component, OnInit, HostListener } from '@angular/core';
import { CategoryService } from '../../shared/category.service';
import { ProjectService } from '../../shared/project.service';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesPageComponent implements OnInit {

  private categoryList:any = [];
  private cardCoordinates:any;
  private cardElements: any;
  private mouseTimer: any = false;
  private resizeTimer: any = false;
  private MOUSE_DEBOUNCE = 100;
  private RESIZE_DEBOUNCE = 250;
  private CARD_RADIUS = 75;
  private MAX_SCALE = 1.4;


  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
      if(this.mouseTimer || !this.cardCoordinates) return;
      this.mouseTimer = setTimeout(_ => this.mouseTimer = false, this.MOUSE_DEBOUNCE);
      this.scaleElements(event, this.cardElements, this.cardCoordinates);
  }

  @HostListener('window:resize', ['$event'])
  onResize($event) {
    if(this.resizeTimer) return;
    this.resizeTimer = setTimeout(_ => this.resizeTimer = false, this.RESIZE_DEBOUNCE);
    console.log('window resize, re-calc coordinates');
    this.calculateElementCoordinates();
  }

  constructor(private categoryService: CategoryService, private projectService: ProjectService) { }

  ngOnInit() {
    this.loadCategories();
  }

  private loadCategories(): void {
    Observable.forkJoin(this.categoryService.getCategories(), this.projectService.getProjects())
      .subscribe(resp => {
        this.categoryList = resp[0].data;
        const projectList = resp[1].data;
        const categoryInstanceMap = projectList.reduce((mem, project) => {
          project.tags.split(',')
            .map(tag => tag.trim())
            .forEach(tag => mem[tag] = (mem[tag]) ? mem[tag] + 1 : 1);
          return mem;
        }, {});
        this.categoryList.forEach(category => category.instances = categoryInstanceMap[category.name]);
        setTimeout(_ => this.calculateElementCoordinates(), 1000);
      });
  }


  // TODO
  // Need to only calculate scale of some cards, can't do all when list grows big, will get bad perf
  // TODO


  private scaleElements($event, elements, bounds): void {
    for(let i = 0, n = elements.length; i < n; i++) {
      let d = this.getDistance(bounds[i].x, bounds[i].y, $event.pageX, $event.pageY);
      if(d <= this.CARD_RADIUS) {
        // console.log(`card ${i} scale = ${this.MAX_SCALE}`);
        elements[i].style.transform = `scale(${this.MAX_SCALE})`;
      } else {
        // console.log(`card ${i} scale = ${Math.max(1, this.MAX_SCALE - (d / 1000))}`);
        elements[i].style.transform = `scale(${Math.max(1, this.MAX_SCALE - (d / 1000))})`;
      }
    }
  }

  private calculateElementCoordinates(): void {
    this.cardElements = document.getElementsByClassName('category-card');
    this.cardCoordinates = [];
    for(let i = 0, n = this.cardElements.length; i < n; i++) {
      const bounds = this.cardElements[i].getBoundingClientRect();
      this.cardCoordinates[i] = {
        x: bounds.x + (bounds.width / 2),
        y: bounds.y + (bounds.height / 2)
      }
    }
  }

  private getDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2)
  }

}
