import {Component, OnInit} from '@angular/core';
import {Validators, FormControl} from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';
import {Subject} from 'rxjs/Subject';
import {OrderType} from '../../../../data/order.type';
import {RiderWithLocation} from '../../../../data/user.type';
import {RiderService} from '../../../../services/rider.service';

@Component({
  selector: 'app-assign-rider',
  templateUrl: './assign-rider.component.html',
  styleUrls: ['./assign-rider.component.scss']
})
export class AssignRiderComponent implements OnInit {

  public onClose: Subject<boolean>;
  public order: OrderType;
  public riderArr: Array<RiderWithLocation>;

  selectedRider: RiderWithLocation;
  assignRiderClicked = false;

  constructor(
    public activeModel: BsModalRef,
    private toasterService: ToastrService,
    private riderService: RiderService
  ) {
  }

  ngOnInit(): void {
    this.onClose = new Subject();
  }

  dismiss() {
    this.onClose.next(false);
    this.activeModel.hide();
  }

  onRiderSelected(rider) {
    this.selectedRider = rider;
  }

  assignRider() {
    if (!this.selectedRider) {
      return this.toasterService.error('Please select a rider from dropdown list', 'Error Assigning Rider');
    }

    this.assignRiderClicked = true;

    this.riderService.assignRiderToOrderManually(this.order.orderId, this.selectedRider.userId).then(() => {
      this.assignRiderClicked = false;
      this.toasterService.success(`${this.selectedRider.firstName} ${this.selectedRider.lastName} assigned to order #${this.order.orderId}`,
        'Order Assign Success');
      this.onClose.next(true);
      this.activeModel.hide();
    }).catch(err => {
      this.assignRiderClicked = false;
      console.log(err)
      this.toasterService.error(`Error assigning rider to order: ${err.message}`, 'Error Assigning Rider');
    });
  }

}
