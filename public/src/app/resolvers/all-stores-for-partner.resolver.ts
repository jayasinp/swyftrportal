import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {StoreType} from '../data/store.type';
import {StoreService} from '../services/store.service';

@Injectable()
export class GetAllStoresOfAPartnerResolver implements Resolve<Array<StoreType>> {

  constructor(
    private storeService: StoreService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Promise<Array<StoreType>> {
    const partnerId = route.params['id'];
console.log("partnerId  GetAllStoresOfAPartnerResolver")
console.log(partnerId)
    console.log("GetAllStoresOfAPartnerResolver By Damith ")
console.log(this.storeService.getStoresByPartnerId(partnerId))
    return this.storeService.getStoresByPartnerId(partnerId);
  }

}
