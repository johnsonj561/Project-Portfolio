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

  private searchText: String;
  private categoryList: any = [];
  private cardCoordinates: any;
  private cardElements: any;
  private mouseTimer: any = false;
  private resizeTimer: any = false;
  private MOUSE_DEBOUNCE = 100;
  private RESIZE_DEBOUNCE = 250;
  private MAX_SCALE = 1.4;
  // scale distance affects how close card must be to cursor before scaling
  // smaller scale distance --> cursor must be closer to card before card scales
  // large scale distance --> cursor will cause card to scale from further away
  private SCALE_DISTANCE = 750;


  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
      if(this.mouseTimer || !this.cardCoordinates) return;
      // removing timeout reduces animations to 10 - 20 fps
      // small set of categories (< 50) with 100ms debounce yields 60 fps
      this.mouseTimer = setTimeout(_ => this.mouseTimer = false, this.MOUSE_DEBOUNCE);
      this.scaleElements(event, this.cardElements, this.cardCoordinates);
  }

  @HostListener('window:resize', ['$event'])
  onResize($event) {
    if(this.resizeTimer) return;
    this.resizeTimer = setTimeout(_ => this.resizeTimer = false, this.RESIZE_DEBOUNCE);
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
  // Consider this alternative  algorithm that builds matrix from the elements, allowing us to track rows/cols
  // With this new grid[row][col], we can only traverse the rows affected by mousemove, instead of all rows
  // Alg:
    // let grid = [][],
    // row = 0,
    // col = 0;
    // // load the first circle, then iterate from 1 on
    // grid[row][col] = elements[0];
    // grid[row][col].y = coordinates[0].y;
    // for(let i = 1, n = elements.length; i < n; i++) {
    //   if (coordinates.y > grid[row][col].y) {
    //     row++;
    //     col = 0;
    //   } else {
    //     col++;
    //   }
    //   grid[row][col] = elements[i];
    //   griw[row][col].y = coordinates[i].y;
    // }



  private scaleElements($event, elements, bounds): void {
    for(let i = 0, n = elements.length; i < n; i++) {
      let d = this.getDistance(bounds[i].x, bounds[i].y, $event.pageX, $event.pageY);
      elements[i].style.transform = `scale(${Math.max(1, this.MAX_SCALE - (d / this.SCALE_DISTANCE))})`;
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

  private resetScale(): void {
    if(!this.cardElements) return;
    for(let i = 0, n = this.cardElements.length; i < n; i++) {
      this.cardElements[i].style.transform = 'scale(1)';
    }
  }

}
