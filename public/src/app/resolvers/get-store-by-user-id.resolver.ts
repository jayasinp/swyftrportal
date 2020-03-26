import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {StoreType} from '../data/store.type';
import {SysUserType} from '../data/user.type';
import {StoreService} from '../services/store.service';

@Injectable()
export class GetStoreByUserIdResolver implements Resolve<StoreType> {

  constructor(
    private storeService: StoreService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Promise<StoreType> {
    const storeId = route.params['id'];
console.log(storeId)
    console.log(this.storeService.getStoreById(storeId))
    return this.storeService.getStoreById(storeId);
  }

}
