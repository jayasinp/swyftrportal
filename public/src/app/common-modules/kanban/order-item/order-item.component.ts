import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {OrderInfo, OrderType} from '../../../data/order.type';
import {OrderService} from '../../../services/order.service';
import {BsModalService} from 'ngx-bootstrap';
import {ViewOrderPopupComponent} from '../view-order-popup/view-order-popup.component';
import {ToastrService} from 'ngx-toastr';
import {ORDER_STATUS} from '../../../utility/constants';


declare var google: any;

@Component({
  selector: 'order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss']
})
export class OrderItemComponent implements OnInit{

  @Input('order') order: OrderType;
  @Input('confirmButton') confirmButton: string;
  @Input('confirmStatus') confirmStatus: string;
  @Input('isHighPriority') isHighPriority: Boolean;
  @Input('cancelEnable') cancelEnable: boolean;

  @Output('statusChanged') statusChanged: EventEmitter<number> = new EventEmitter();

  distanceService;
  distanceInKm = 0;

  constructor(
    private orderService: OrderService,
    public changeDecector: ChangeDetectorRef,
    private modalService: BsModalService,
    private toasterService: ToastrService
  ) {}

  ngOnInit() {
    this.distanceService = new google.maps.DistanceMatrixService();
    this.calculateDistance(this.order.bLatitude, this.order.bLongitude, this.order.latitude, this.order.longitude, this);
  }

  calculateDistance(fromLat, fromLong, toLat, toLong, _self) {
    const query = {
      origins: [new google.maps.LatLng(fromLat, fromLong)],
      destinations: [new google.maps.LatLng(toLat, toLong)],
      travelMode: 'DRIVING'
    };

    _self.distanceService.getDistanceMatrix(query, (response, status) => {
      if (status === 'OK') {
        let distanceInKm = 0;

        response.rows.forEach((row) => {
          row.elements.forEach((element) => {
            if (element && element.distance) {
              distanceInKm += element.distance.value;
            }
          });
        });

        distanceInKm = Math.round(distanceInKm / 1000);
        _self.distanceInKm = distanceInKm;
        _self.changeDecector.detectChanges();
      }
    });
  }

  onViewButtonClicked() {
    this.orderService.getOrderInfo(this.order.orderId).then((info : OrderInfo) => {
      const config = {
        initialState: {
          order: this.order,
          orderInfo: info,
          confirmStatus: this.confirmStatus,
          confirmButton: this.confirmButton,
          showCancel: this.cancelEnable
        },
        class: 'modal-lg'
      };
      const viewPartnerRef = this.modalService.show(ViewOrderPopupComponent, config);
      viewPartnerRef.content.onClose.subscribe((changed) => {
        this.statusChanged.emit(this.order.orderId);
      });
    }).catch((err) => console.log(err));
  }

  onConfirmButtonClicked() {
    this.orderService.updateOrderStatus(this.order.orderId, this.confirmStatus).then(() => {
      this.toasterService.show(`Order status changed to ${this.confirmButton}`, 'Order Status Changed');
      this.statusChanged.emit(this.order.orderId);
    }).catch((err) => {
      err = err.error
      console.log(err)
      this.toasterService.error(err.message, 'Order status change failed.');
      if (err.status === 502) {
        this.statusChanged.emit(this.order.orderId);
      }
    });
  }

  getClasstype() {
    let cssClass = 'normal';

    if (this.order.deliveryDate && (this.order.deliveryDate - Date.now() > 2 * 60 * 60 * 1000)) cssClass = 'sheduled';

    return cssClass;
  }

  isConfirmationButtonEnabled() {
    let enabled = true;

    if (this.order.status === ORDER_STATUS.ACCP
      && this.order.deliveryDate
      && (this.order.deliveryDate - Date.now() > 2 * 60 * 60 * 1000)) {
      enabled = false;
    }

    return enabled;
  }

}
