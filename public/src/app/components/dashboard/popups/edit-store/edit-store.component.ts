import {Component, OnInit} from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subject } from 'rxjs/Subject';
import { ToastrService } from 'ngx-toastr';
import {StoreService} from '../../../../services/store.service';
import {StoreType} from '../../../../data/store.type';
import {SysUserType} from '../../../../data/user.type';

let _this;

@Component({
  selector: 'app-edit-store',
  templateUrl: './edit-store.component.html',
  styleUrls: ['./edit-store.component.scss']
})
export class EditStoreComponent implements OnInit {

  public store: StoreType;
  public employeeArr: Array<SysUserType>;
  public onClose: Subject<boolean>;

  updateButtonClicked = false;
  address: FormControl;
  phone: FormControl;
  empArr: Array<any>;
  locationPoint: Array<Array<Number>> = [];
  center = 'Colombo, Sri Lanka';

  constructor(
    public activeModel: BsModalRef,
    private toasterService: ToastrService,
    private storeService: StoreService
  ) {
    _this = this;
  }

  ngOnInit() {
    this.onClose = new Subject();
    this.address = new FormControl('', [Validators.required]);
    this.phone = new FormControl('', [Validators.required]);

    this.setOrgEmpList(this.employeeArr);
    this.locationPoint.push([this.store.latitude, this.store.longitude]);
    this.center = `${this.store.latitude}, ${this.store.longitude}`;
  }

  dismiss() {
    this.activeModel.hide();
    this.onClose.next(false);
  }

  setOrgEmpList(employeeList: Array<SysUserType>) {
    _this.empArr = employeeList.map((emp: SysUserType) => {
      return { text: `${emp.firstName} ${emp.lastName} (${emp.nic})`, id: emp.userId};
    });
  }

  onStorManagerSelected(managerUserId) {
    this.store.managerId = managerUserId;
  }

  onLocationMarked(event) {
    const overlay = event.overlay;
    const cordinates = overlay.getPosition();
    this.store.latitude = cordinates.lat();
    this.store.longitude = cordinates.lng();
  }

  updateStore() {
    if (!this.phone.valid || !this.address.valid) {
      return this.toasterService.error('Invalid phone number or address. Please insert valid details', 'Updated Store Details Are Invalid');
    }

    this.updateButtonClicked = true;
    this.storeService.updateStore(this.store).then(() => {
      this.updateButtonClicked = false;
      this.toasterService.success(`${this.store.branchName} updated successfully`, `Branch Updated`);
      this.onClose.next(true);
      this.activeModel.hide();
    }).catch((err) => {
      this.updateButtonClicked = false;
      this.toasterService.error(`Error updating store : ${err.message}`, 'Error creating store');
    });
  }
}
