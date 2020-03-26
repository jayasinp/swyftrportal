import {Component, OnInit} from '@angular/core';
import {Validators, FormControl, Form} from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';
import {Subject} from 'rxjs/Subject';

import {StoreService} from '../../../../services/store.service';
import {StoreType} from '../../../../data/store.type';
import {SysUserType} from '../../../../data/user.type';

let _this;

@Component({
  selector: 'app-create-store',
  templateUrl: './create-store.component.html',
  styleUrls: ['./create-store.component.scss']
})
export class CreateStoreComponent implements OnInit {

  public onClose: Subject<boolean>;
  public store: StoreType;
  public orgName: string;
  public employeeArr: Array<SysUserType>;
  public orgId;

  createButtonClicked = false;

  branchName: FormControl;
  address: FormControl;
  district: FormControl;
  province: FormControl;
  phone: FormControl;

  empArr: Array<any>;

  constructor(
    private storeService: StoreService,
    public activeModel: BsModalRef,
    private toasterService: ToastrService
  ) {
    _this = this;
  }

  ngOnInit() {
    this.onClose = new Subject();
    this.store = new StoreType();
    this.store.orgId = parseInt(this.orgId);

    this.branchName = new FormControl('', [Validators.required]);
    this.address = new FormControl('', [Validators.required]);
    this.district = new FormControl('', [Validators.required]);
    this.province = new FormControl('', [Validators.required]);
    this.phone = new FormControl('', [Validators.required]);

    this.setOrgEmpList(this.employeeArr);
  }

  dismiss() {
    this.onClose.next(false);
    this.activeModel.hide();
  }

  onLocationMarked(event) {
    const overlay = event.overlay;
    const cordinates = overlay.getPosition();
    this.store.latitude = cordinates.lat();
    this.store.longitude = cordinates.lng();
  }

  createStore() {
    if (!this.store.longitude || !this.store.latitude) {
      return this.toasterService.error('Please pin the location of this store on Map', 'Invalid Store Location');
    }

    if (!this.store.managerId) {
      return this.toasterService.error('Please select the manager user id from the dropdown', 'Invalid Store Manager Information');
    }

    if (this.branchName.valid && this.address.valid && this.district.valid && this.province.valid && this.phone.valid) {
      this.createButtonClicked = true;
      this.storeService.createStore(this.store).then(() => {
        this.createButtonClicked = false;
        this.toasterService.success(`${this.store.branchName} created successfully`, `Branch Created For ${this.orgName}`);
        this.onClose.next(true);
        this.activeModel.hide();
      }).catch((err) => {
        this.createButtonClicked = false;
        this.toasterService.error(`Error creating store : ${err.message}`, 'Error creating store');
      });
    } else {
      return this.toasterService.error('One or more mandatory fields are missing', 'Invalid Store Details');
    }
  }

  setOrgEmpList(employeeList: Array<SysUserType>) {
    _this.empArr = employeeList.map((emp: SysUserType) => {
      return { text: `${emp.firstName} ${emp.lastName} (${emp.nic})`, id: emp.userId};
    });
  }

  onStorManagerSelected(managerUserId) {
    this.store.managerId = managerUserId;
  }

}
