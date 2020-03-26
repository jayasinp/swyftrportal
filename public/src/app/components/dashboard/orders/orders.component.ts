import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as moment from 'moment';
import {OrderType, RiderManagerOrder} from '../../../data/order.type';
import {OrderService} from '../../../services/order.service';
import {ToastrService} from 'ngx-toastr';
import {ORDER_STATUS_DESC} from '../../../utility/constants';
import {RiderService} from '../../../services/rider.service';
import {RiderWithLocation} from '../../../data/user.type';
import {AssignRiderComponent} from '../popups/assign-rider/assign-rider.component';
import {BsModalService} from 'ngx-bootstrap';

@Component({
  selector: 'app-order-table',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.sass']
})
export class OrdersComponent implements OnInit {

  ordersArray: Array<OrderType>;
  riderOrderArray: Array<RiderManagerOrder>

  @Input('riderManagerOrderArray')riderManagerOrderArray: Array<RiderManagerOrder>;

  type: String;

  constructor (
    private toastService: ToastrService,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private riderService: RiderService,
    private modalService: BsModalService,
  ) {}

  ngOnInit(): void {
    this.riderOrderArray = this.route.snapshot.data['riderUnassignedOrders'];
    this.ordersArray = this.route.snapshot.data['allOrders'];
  }

  getOrderStatus(status) {
    return ORDER_STATUS_DESC[status];
  }

  getDate(timestamp) {
    return moment.unix(timestamp / 1000).format('YYYY/MM/DD hh:mm A');
  }

  assignARider(order: OrderType) {
    order['loading'] = true;

    this.riderService.getNearestRidersForOrderPickupLocation(order.orderId).then((riderArr: Array<RiderWithLocation>) => {
      delete order['loading'];

      if (!riderArr.length) return this.toastService.warning('No riders available within 10 KM radius of given store',
        'Can\'t Proceed with Assign Rider Manually');

      const config = {
        initialState: {
          order: order,
          riderArr: riderArr
        }
      };
      const assignRiderRef = this.modalService.show(AssignRiderComponent, config);
      assignRiderRef.content.onClose.subscribe((result) => {
        if (result) {
          this.reloadRiderUnAssignedOrderList();
        }
      });
    }).catch(err => {
      delete order['loading'];
      console.log(err);
    });
  }

  reloadRiderUnAssignedOrderList() {
    this.riderService.getUnAssignedOrders().then((orders: Array<RiderManagerOrder>) => {
      this.riderOrderArray = orders;
    }).catch((err) => console.log(err));
  }
}
