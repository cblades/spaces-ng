import { Injectable } from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot }
from '@angular/router';
import { SpacesBaseService } from './spaces_base.service'

@Injectable()
export class SpacesParamsResolve implements Resolve<any> {
  
  constructor(
      private spacesBase: SpacesBaseService
  ) {
      /* Empty Block */
  }
  
  resolve(route: ActivatedRouteSnapshot) {
      this.spacesBase.init(route.queryParams);
      return route.queryParams;
  }
}