import {Component, OnInit} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {UpdatePasswordType} from '../../../../data/user.type';
import {LoginService} from '../../../../services/login.service';

@Component({
  selector: 'app-update-password-popup',
  styleUrls: ['./update-password.component.scss'],
  templateUrl: './update-password.component.html'
})
export class UpdatePasswordComponent implements OnInit{

  public updatePasswordObj: UpdatePasswordType = new UpdatePasswordType();

  oldPasswordFormCntrl: FormControl;
  newPasswordFormCntrl: FormControl;
  retrypeNewPasswordFormCntrl: FormControl;

  formGroup: FormGroup;
  formBuilder: FormBuilder;

  saveButtonClicked = false;

  constructor(
    public activeModel: BsModalRef,
    private toasterService: ToastrService,
    private loginService: LoginService
  ) { }

  dismiss() {
    this.activeModel.hide();
  }

  ngOnInit() {
    this.formBuilder = new FormBuilder();
    this.oldPasswordFormCntrl = new FormControl('', [Validators.required]);
    this.newPasswordFormCntrl = new FormControl('', [Validators.required]);
    this.retrypeNewPasswordFormCntrl = new FormControl('', [Validators.required,
      this.validatePasswordMatching()]);
  }

  validatePasswordMatching() {
    return (c: FormControl) => {
      let isValid = true;
      if (!this.updatePasswordObj.newPassword || !this.updatePasswordObj.retypePassword
        || this.updatePasswordObj.newPassword !== this.updatePasswordObj.retypePassword) {
        isValid = false;
      }
      return isValid ? null : {
        retypePassword: {
          valid: false
        }
      };
    };
  }

  updatePassword() {
    if (this.oldPasswordFormCntrl.valid && this.newPasswordFormCntrl.valid && this.retrypeNewPasswordFormCntrl.valid) {
      this.saveButtonClicked = true;
      this.loginService.updatePassword(this.updatePasswordObj).then(() => {
        this.saveButtonClicked = false;
        this.toasterService.success('Password update successful', 'Update Password');
        this.dismiss();
      }).catch((err) => {
        console.log(err);
        this.saveButtonClicked = false;
        this.toasterService.error('Update password failed', 'Update Password');
      });
    } else {
      this.toasterService.error('One or more invalid fields', 'Invalid Data');
    }
  }
}
