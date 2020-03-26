import {Component, OnInit} from '@angular/core';
import {OrderService} from '../../../services/order.service';
import {OrderType} from '../../../data/order.type';
import {ORDER_STATUS, MAX_SCHEDULE_TIME, MIN_SCHEDULE_TIME} from '../../../utility/constants';

let _self;

@Component({
  selector: 'kanban-dashboard',
  templateUrl: './kanban-dashboard.component.html',
  styleUrls: ['./kanban-dashboard.component.scss']
})
export class KanbanDashboardComponent implements OnInit{

  orderObj: any;
  statusConsts = ORDER_STATUS;
  private loadingOrders = false;

  scheduleOrders = [];
  showScheduledDialog: any = {
    show: false
  };

  constructor(
    private orderService: OrderService
  ) {
    _self = this;
  }

  ngOnInit() {
    this.loadAllOrders();
    setTimeout(() => {
      setInterval(function () {
        if (!_self.loadingOrders) _self.loadAllOrders();
      }, 1 * 20 * 1000);
    }, 10 * 1000);
  }

  loadAllOrders() {
    _self.loadingOrders = true;
    const statusArr = Object.keys(ORDER_STATUS);
    const promiseArr = [];
    statusArr.forEach((status) => {
      promiseArr.push(this.orderService.getAllOrdersByStatus(status));
    });

    Promise.all(promiseArr).then((orders) => {
      this.orderObj = {};
      this.orderObj[ORDER_STATUS.INIT] = [];
      this.orderObj[ORDER_STATUS.ACCP] = [];
      this.orderObj[ORDER_STATUS.READY_TO_PICKUP] = [];
      this.orderObj[ORDER_STATUS.DISPATCH] = [];
      this.orderObj[ORDER_STATUS.DELI] = [];
      this.scheduleOrders = [];

      orders.forEach((orderByStatusArr: Array<OrderType>) => {
        if (orderByStatusArr.length) {
          switch (orderByStatusArr[0].status) {

            case ORDER_STATUS.INIT :
              this.orderObj[ORDER_STATUS.INIT] = orderByStatusArr;
              break;

            case ORDER_STATUS.ACCP :
              this.orderObj[ORDER_STATUS.ACCP] = orderByStatusArr;
              break;

            case ORDER_STATUS.READY_TO_PICKUP :
              this.orderObj[ORDER_STATUS.READY_TO_PICKUP] = orderByStatusArr;
              break;

            case ORDER_STATUS.DISPATCH :
              this.orderObj[ORDER_STATUS.DISPATCH] = orderByStatusArr;
              break;

            case ORDER_STATUS.DELI :
              this.orderObj[ORDER_STATUS.DELI] = orderByStatusArr;
              break;

          }
        }

        orderByStatusArr.forEach((order: OrderType) => {
          const timeGap = order.deliveryDate ? (order.deliveryDate - Date.now()) : 0;

          if (timeGap > MIN_SCHEDULE_TIME && timeGap < MAX_SCHEDULE_TIME) {
            this.scheduleOrders.push(order.orderId);

            const timerId = setTimeout(() => {
              clearInterval(timerId);
              this.scheduleOrders.splice(this.scheduleOrders.indexOf(order.orderId), 1);
              this.showScheduledDialog = {
                show: true,
                description: `Scheduled order #${order.orderId} activated. You have less than two hours to make it happen!`
              };
            }, timeGap);
          }
        });
      });
      _self.loadingOrders = false;
    }).catch((err) => {
      _self.loadingOrders = false;
      console.log(err);
    });
  }

  onChildStatusChanged(orderId) {
    if (!_self.loadingOrders) this.loadAllOrders();
  }

  refresh() {
    window.location.reload();
  }

  closeDialog() {
    this.showScheduledDialog = {
      show: false
    };
  }
}
