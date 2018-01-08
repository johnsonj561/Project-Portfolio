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
      else return (a.name < b.name) ? -1 : 0;
    },
    "instances": (a, b) => {
      // if both have instances, sort by instance
      if(a.instances && b.instances) return b.instances - a.instances;
      // if both have 0 instanes, sort them alphabetically
      else if (!a.instances && !b.instances) {
        return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1;
      }
      // else return the one that has 0 instances
      else return (a.instances) ? 1 : -1;
    }
  }

}
