import {Component, OnInit} from '@angular/core';
import {Validators, FormControl} from '@angular/forms';
import {SysUserType, UserType} from '../../../../data/user.type';
import {UserService} from '../../../../services/user.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {Subject} from 'rxjs/Subject';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-deactivate-user',
  templateUrl: './deactivate-user.component.html'
})
export class DeactivateUserComponent implements OnInit{

  editUser: SysUserType;
  editCustomer: UserType;

  deactivateButtonClicked = false;
  nameCntrl: FormControl;
  idCntrl: FormControl;
  action: string;
  actionCaption: string;
  message: string;

  public onClose: Subject<boolean>;

  constructor(
    public activeModel: BsModalRef,
    private userService: UserService,
    private toasterService: ToastrService
  ) {}

  ngOnInit(): void {
    this.nameCntrl = new FormControl('', [Validators.required]);
    this.idCntrl = new FormControl('', [Validators.required]);
    this.onClose = new Subject();
  }

  dismiss() {
    this.activeModel.hide();
    this.onClose.next(false);
  }

  onDeactivateUserClicked() {
    this.deactivateButtonClicked = true;
    let status = '';
    if (this.action === 'deactivate') {
      status = 'deactivate';
    } else if (this.action === 'activate') {
      status = 'activate';
    } else {
      return console.log('Invalid status ', this.action);
    }

    if (this.editUser) {
      this.userService.changeUserActiveStatus(this.editUser, status).then(() => {
        this.deactivateButtonClicked = false;
        this.toasterService.success(
          `${this.editUser.firstName} ${this.editUser.lastName} ${this.action}d.`,
          `Successful.`
        );
        this.activeModel.hide();
        this.onClose.next(true);
      }).catch((err) => {
        this.deactivateButtonClicked = false;
        this.toasterService.error(`Fail to ${this.action} user due to ${err.message}`, `${this.actionCaption} User Failed`);
        console.log(err);
      });
    } else if (this.editCustomer) {
      this.userService.changeCustomerActiveStatus(this.editCustomer, status).then(() => {
        this.deactivateButtonClicked = false;
        this.toasterService.success(
          `${this.editCustomer.firstName} ${this.editCustomer.lastName} ${this.action}d.`,
          `Successful.`
        );
        this.activeModel.hide();
        this.onClose.next(true);
      }).catch((err) => {
        this.deactivateButtonClicked = false;
        this.toasterService.error(`Fail to ${this.action} user due to ${err.message}`, `${this.actionCaption} User Failed`);
        console.log(err);
      });
    } else {
      console.log('emepty customer or user');
    }
  }

}
