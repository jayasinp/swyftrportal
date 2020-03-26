import {Component, EventEmitter, Injector, Input, OnInit, Output} from '@angular/core';
import { UserType } from '../../../../data/user.type';
import { UserService } from '../../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import {DeactivateUserComponent} from '../../popups/deactivate-user/deactivate-user.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-inactive-customers',
  templateUrl: './inactive-customers.component.html',
  styleUrls: ['./inactive-customers.component.scss']
})

export class InactiveCustomersComponent implements OnInit {

  @Input('inactiveUsers') inactiveUsers: Array<UserType>;
  @Output('reloadTable') reloadTable: EventEmitter<Number> = new EventEmitter();

  constructor(
    private userService: UserService,
    private toastService: ToastrService,
    private modalService: BsModalService,
    private router: Router
  ) {}

  reloadUserTable() {
    this.userService.getAllCustomerUsersByStatus(true).then((res: Array<UserType>) => {
      this.inactiveUsers = res;
    }).catch((err) => {
      console.log(err);
      this.toastService.error('User table reloead failed', 'Error Reloading User table');
    });
  }

  openDeactivateUserModel(user) {
    const updateUserModelRef = this.modalService.show(DeactivateUserComponent);
    updateUserModelRef.content.editCustomer = user;
    updateUserModelRef.content.action = 'activate';
    updateUserModelRef.content.actionCaption = 'Activate';
    updateUserModelRef.content.message = 'Activating';
    updateUserModelRef.content.onClose.subscribe((result) => {
      if (result) {
        this.reloadTable.emit(0);
      }
    });
  }

  viewCustomer(customer: UserType) {
    this.router.navigate(['/home/customer-profile', customer.userId]);
  }

  ngOnInit() {

  }

}
