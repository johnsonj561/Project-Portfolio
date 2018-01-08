import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'courseFilter'
})
export class CourseFilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    } else if (!searchText) {
      return items;
    }
    return items.filter(item => item.title.toLowerCase().includes(searchText.toLowerCase()));
   }
}
