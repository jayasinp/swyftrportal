import {Component, OnInit} from '@angular/core';
import {RiderType} from '../../../../data/user.type';
import { ToastrService } from 'ngx-toastr';
import {Subject} from 'rxjs/Subject';
import {Validators, FormControl} from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {UserService} from '../../../../services/user.service';
import {AuthService} from '../../../../services/auth.service';

@Component({
  selector: 'app-create-rider-popup',
  templateUrl: './create-rider.component.html',
  styleUrls: ['./create-rider.component.scss']
})
export class CreateRiderComponent implements OnInit {

  riderUser: RiderType;
  createButtonClicked = false;

  firstNameCntrl: FormControl;
  lastNameCntrl: FormControl;
  emailCntrl: FormControl;
  mobileCntrl: FormControl;
  nicCntrl: FormControl;
  vehicleNoCntrl: FormControl;
  licenseNoCntrl: FormControl;
  addressCntrl: FormControl;

  public onClose: Subject<boolean>;

  constructor (
    public activeModel: BsModalRef,
    private userService: UserService,
    private toasterService: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.riderUser = new RiderType();
    this.riderUser.userType = 'rider';
    this.riderUser.orgId = this.authService.getOrganizationOfAuthorizedUser().orgId;

    this.firstNameCntrl = new FormControl('', [Validators.required]);
    this.lastNameCntrl = new FormControl('', [Validators.required]);
    this.emailCntrl = new FormControl('', [Validators.required, Validators.email]);
    this.mobileCntrl = new FormControl('', [Validators.required]);
    this.nicCntrl = new FormControl('', [Validators.required]);
    this.vehicleNoCntrl = new FormControl('', [Validators.required]);
    this.licenseNoCntrl = new FormControl('', [Validators.required]);
    this.addressCntrl = new FormControl('', [Validators.required]);

    this.onClose = new Subject();
  }

  createRider() {

    if (this.firstNameCntrl.valid && this.lastNameCntrl.valid && this.emailCntrl.valid && this.mobileCntrl.valid && this.nicCntrl.valid &&
        this.vehicleNoCntrl.valid && this.licenseNoCntrl.valid && this.addressCntrl.valid) {

      this.riderUser.userType = 'rider';
      this.riderUser.orgId = this.authService.getOrganizationOfAuthorizedUser().orgId;

      this.createButtonClicked = true;
      this.userService.createSystemUser(this.riderUser).then((rider) => {
        const userId = rider.userId;
        const license = this.riderUser.license;
        const vehicalNo = this.riderUser.vehicalNo;
        const nic = this.riderUser.nic;
        const riderUpdate = {userId, license, vehicalNo, nic};

        this.userService.updateRiderInfo(riderUpdate).then(() => {
          this.createButtonClicked = false;
          this.toasterService.success(
            `${this.riderUser.firstName} ${this.riderUser.lastName} registered with the system.
            A system generated password will be send to rider's official email.`,
            'Rider Created Successfully'
          );
          this.onClose.next(true);
          this.activeModel.hide();
        }).catch((err) => {
          this.createButtonClicked = false;
          this.toasterService.error(`Fail to update rider information to ${err.message}`, 'Create Rider Info Failed');
          console.log(err);
        });
      }).catch((err) => {
        this.createButtonClicked = false;
        this.toasterService.error(`Fail to create rider due to ${err.message}`, 'Create Rider Failed');
        console.log(err);
      });

    } else {
      this.toasterService.error('One or more required field are missing', 'Rider creation failed');
    }

  }

  dismiss() {
    this.onClose.next(false);
    this.activeModel.hide();
  }

}
