import {Component, OnInit} from '@angular/core';
import {Validators, FormControl} from '@angular/forms';
import {SysUserType} from '../../../../data/user.type';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {UserService} from '../../../../services/user.service';
import {Subject} from 'rxjs/Subject';
import { ToastrService } from 'ngx-toastr';
import {StoreType} from '../../../../data/store.type';
import {AuthService} from '../../../../services/auth.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit{

  public editUser: SysUserType;
  public stores: Array<StoreType>;
  updateButtonClicked = false;
  firstNameCntrl: FormControl;
  lastNameCntrl: FormControl;
  designationCntrl: FormControl;

  public onClose: Subject<boolean>;
  loginUser: SysUserType;

  constructor(
    public activeModel: BsModalRef,
    private userService: UserService,
    private toasterService: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.firstNameCntrl = new FormControl('', [Validators.required]);
    this.lastNameCntrl = new FormControl('', [Validators.required]);
    this.designationCntrl = new FormControl('', [Validators.required]);

    this.onClose = new Subject();
    this.loginUser = this.authService.getProfileOfAuthorizedUser();
  }

  dismiss() {
    this.activeModel.hide();
    this.onClose.next(false);
  }

  onUpdateUserClicked() {
    if (this.canUpdateAdvanceFields()) {
      if (this.designationCntrl.valid) {
        return this.toasterService.error('Invalid designation', 'Invalid Field');
      }
    }
    if (this.firstNameCntrl.valid && this.lastNameCntrl.valid) {
      this.updateButtonClicked = true;
      this.userService.updateSystemUser(this.editUser).then(() => {
        this.updateButtonClicked = false;
        this.toasterService.success(
          `${this.editUser.firstName} ${this.editUser.lastName} updated.`,
          'User Updated Successfully'
        );
        this.activeModel.hide();
        this.onClose.next(true);
      }).catch((err) => {
        this.updateButtonClicked = false;
        this.toasterService.error(`Fail to update user due to ${err.message}`, 'Update User Failed');
        console.log(err);
      });
    } else {
      this.toasterService.error('One or more required fields are invalid', 'Can not proceed');
    }
  }

  onStoreSelected(storeId) {
    this.editUser.branchId = storeId;
  }

  canUpdateAdvanceFields() {
    // TODO implement permision based update here. Only specific permision can update other users
    return false;
  }

}
