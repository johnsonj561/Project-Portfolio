import { Component, OnInit } from '@angular/core';
import { CategoryFormComponent } from '../../components/forms/category/category.form.component';
import { CategoryService } from '../../shared/category.service';

@Component({
  selector: 'app-edit-categories-page',
  templateUrl: './edit-categories.component.html',
  styleUrls: ['./edit-categories.component.css']
})
export class EditCategoriesPageComponent implements OnInit {

  categoryList = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.getCategories()
      .subscribe(resp => {
        if (resp.success) {
          this.categoryList = resp.data;
        } else {
          console.log('Error getting categories', resp);
        }
      });
  }

  /**
   * Delete Category
   * Removes categoryName from Category collection
   */
  deleteCategory(categoryName, index): void {
    this.categoryService.deleteCategory(categoryName)
      .subscribe(resp => {
        if (resp.success) {
          this.categoryList.splice(index, 1);
        } else {
          console.log('Error deleting category: ', resp.message);
        }
      });
  }

  /**
   * Submit Form
   * Adds formData.name to Category collection
   */
  submitForm(formData): void {
    if (formData && formData.name && formData.name.length) {
      this.categoryService.addCategory(formData)
        .subscribe(resp => {
          if (!resp.success) {
            formData.error = resp.message;
          } else {
            formData.success = resp.message;
            this.categoryList.push({
              name: formData.name
            });
          }
        });
    }

  }

}
