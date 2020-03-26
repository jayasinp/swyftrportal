import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {StoreType} from '../data/store.type';
import {StoreService} from '../services/store.service';

@Injectable()
export class GetAllStoresOfAUserResolver implements Resolve<Array<StoreType>> {

  constructor(
    private storeService: StoreService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Promise<Array<StoreType>> {
    const userId = route.params['id'];
   // console.log(userId)
   // console.log(this.storeService.getStoresByUserId(userId))
    return this.storeService.getStoresByUserId(userId);
  }

}
