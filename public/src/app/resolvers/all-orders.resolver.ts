import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {OrderType} from '../data/order.type';
import {OrderService} from '../services/order.service';
import {ORDER_STATUS} from '../utility/constants';

@Injectable()
export class GetAllOrdersResolver implements Resolve<Array<OrderType>> {

  constructor(
    private orderService: OrderService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Promise<any> {
    const statusArr = Object.keys(ORDER_STATUS);
    const promiseArr = [];
    statusArr.forEach((status) => {
      promiseArr.push(this.orderService.getAllOrdersByStatus(status));
    });
    return Promise.all(promiseArr);
  }

}
