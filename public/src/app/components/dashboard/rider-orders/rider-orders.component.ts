import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RiderManagerOrder} from '../../../data/order.type';
import {RiderService} from '../../../services/rider.service';

@Component({
  selector: 'app-rider-orders',
  templateUrl: './rider-orders.component.html'
})
export class RiderOrdersComponent implements OnInit{

  orderArr: Array<RiderManagerOrder> = [];
  assignedArr: Array<RiderManagerOrder> = [];
  ackArr: Array<RiderManagerOrder> = [];
  pickedUpArr: Array<RiderManagerOrder> = [];

  unassignedOrders: Array<RiderManagerOrder> = [];

  timerId

  constructor(
    private route: ActivatedRoute,
    private riderService: RiderService
  ) { }

  ngOnInit () {
    this.orderArr = this.route.snapshot.data['riderOrders'];
    this.unassignedOrders = this.route.snapshot.data['riderUnassignedOrders'];
    this.createKanbanColumns();
    this.startOrderQueury();
  }

  createKanbanColumns() {
    this.assignedArr = [];
    this.ackArr = [];
    this.pickedUpArr = [];

    this.orderArr.forEach(order => {
      if (!order.riderPicked && order.riderViewed) {
        this.ackArr.push(order);
      } else if (order.riderPicked) {
        this.pickedUpArr.push(order);
      } else {
        this.assignedArr.push(order)
      }
    });
  }

  startOrderQueury() {
    this.timerId = setInterval(() => {
      this.riderService.getAllOngoingOrderForRiderPartner().then((orders: Array<RiderManagerOrder>) => {
        this.orderArr = orders;
        this.createKanbanColumns();
      }).catch(err => console.log(err));
    }, 2 * 60 * 1000);
  }

}
