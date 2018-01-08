import { Injectable } from '@angular/core';

@Injectable()
export class SortingService {

  constructor () {}

  public getCompareMethod(objType, key): any {
    return this[objType + 'CompareMethods'][key.toLowerCase()];
  }

  private categoryCompareMethods: any = {
    "alphabetical": (a, b) => {
      const _a = a.name.toLowerCase(),
      _b = b.name.toLowerCase;
      if(_a > _b) return 1;
      else return (_a < _b) ? -1 : 0;
    },
    "instances": (a, b) => {
      // if both have instances, sort by instance
      if(a.instances && b.instances) return b.instances - a.instances;
      // if both have 0 instanes, sort them alphabetically
      else if (!a.instances && !b.instances) {
        return (a.name.toLowerCase() > b.name.toLowerCase()) ? -1 : 1;
      }
      // else return the one that has 0 instances
      else return (a.instances) ? 1 : -1;
    }
  }

  private courseCompareMethods: any = {
    "course name": (a, b) => {
      const _a = a.title.toLowerCase();
      const _b = b.title.toLowerCase();
      if(_a > _b) return 1;
      else return (_a < _b) ? -1 : 0;
    },
    "year": (a, b) => {
      // if both have year, sort by year
      if(a.year && b.year) return b.year - a.year;
      // if both missing year, sort them alphabetically
      else if (!a.year && !b.year) {
        return (a.title.toLowerCase() > b.title.toLowerCase()) ? 1 : -1;
      }
      // else push missig years to end of list
      else return (a.year) ? 1 : -1;
    },
    "instances": (a, b) => {
      // if both have instances, sort by instance
      if(a.instances && b.instances) return b.instances - a.instances;
      // if both have 0 instanes, sort them alphabetically
      else if (!a.instances && !b.instances) {
        return (a.title.toLowerCase() > b.title.toLowerCase()) ? -1 : 1;
      }
      // else return the one that has 0 instances
      else return (a.instances) ? 1 : -1;
    }
  }

}
