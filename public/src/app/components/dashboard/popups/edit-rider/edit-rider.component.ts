import {Component, OnInit} from '@angular/core';
import {RiderType} from '../../../../data/user.type';
import { ToastrService } from 'ngx-toastr';
import {Subject} from 'rxjs/Subject';
import {Validators, FormControl} from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {UserService} from '../../../../services/user.service';
import {AuthService} from '../../../../services/auth.service';

@Component({
  selector: 'app-edit-rider-popup',
  templateUrl: './edit-rider.component.html',
  styleUrls: ['./edit-rider.component.sass']
})
export class EditRiderComponent implements OnInit {

  riderUser: RiderType;
  updateButtonClicked = false;

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
    this.vehicleNoCntrl = new FormControl('', [Validators.required]);
    this.licenseNoCntrl = new FormControl('', [Validators.required]);
    this.addressCntrl = new FormControl('', [Validators.required]);

    this.onClose = new Subject();
  }

  editRider() {
    if (this.addressCntrl.valid && this.licenseNoCntrl.valid && this.vehicleNoCntrl.valid) {
      this.updateButtonClicked = true;

      this.userService.updateSystemUser(this.riderUser).then(() => {
        this.userService.updateRiderInfo(this.riderUser).then(() => {
          this.updateButtonClicked = false;
          this.toasterService.success(
            `${this.riderUser.firstName} ${this.riderUser.lastName} updated.`,
            'Rider Update Successfully'
          );
          this.onClose.next(true);
          this.activeModel.hide();
        }).catch((err) => {
          this.updateButtonClicked = false;
          this.toasterService.error(`Fail to update rider info details due to ${err.message}`, 'Update Rider Info Failed');
          console.log(err);
        });
      }).catch((err) => {
        this.updateButtonClicked = false;
        this.toasterService.error(`Fail to update rider user details due to ${err.message}`, 'Update Rider Failed');
        console.log(err);
      });
    } else {
      this.toasterService.error('One or more required field are missing', 'Rider update failed');
    }
  }

  dismiss() {
    this.onClose.next(false);
    this.activeModel.hide();
  }

}
