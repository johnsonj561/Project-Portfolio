import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../shared/category.service';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesPageComponent implements OnInit {

  categoryList = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.getCategories()
      .subscribe(resp => {
        if (resp.success) {
          this.categoryList = resp.data;
          this.categoryList = this.categoryList
            .map(category => {
              category.instances = Math.ceil(Math.random() * 20);
              return category;
            });
        } else {
          console.log('Error getting categories', resp);
        }
      });
  }

  outputCategory(cat): void {
    console.log(cat);
  }

}
