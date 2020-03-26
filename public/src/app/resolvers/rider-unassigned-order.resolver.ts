import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {RiderService} from '../services/rider.service';
import {RiderManagerOrder} from '../data/order.type';

@Injectable()
export class RiderUnassignedOrderResolver implements Resolve<Array<RiderManagerOrder>> {

  constructor(
    private riderService: RiderService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Promise<Array<RiderManagerOrder>> {
    return this.riderService.getUnAssignedOrders();
  }

}
