import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {StoreType} from '../data/store.type';
import {StoreService} from '../services/store.service';

@Injectable()
export class GetAllStoresByUserResolver implements Resolve<Array<StoreType>> {

  constructor(
    private storeService: StoreService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Promise<Array<StoreType>> {
    return this.storeService.getStoresByOrganizationLoginUserWorksFor();
  }

}
