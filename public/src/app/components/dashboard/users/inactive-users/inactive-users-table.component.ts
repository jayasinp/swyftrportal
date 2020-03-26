import {Component, Injector, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { SysUserType } from '../../../../data/user.type';
import { UserService } from '../../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { PermissionsService } from '../../../../services/permissions.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PermissionSelectorComponent } from '../../popups/permission-selector/permission-selector.component';
import { EditUserComponent } from '../../popups/edit-user/edit-user.component';
import {DeactivateUserComponent} from '../../popups/deactivate-user/deactivate-user.component';


@Component({
  selector: 'app-inactive-users',
  templateUrl: './inactive-users-table.component.html',
  styleUrls: ['./inactive-users-table.component.scss']
})

export class InactiveUsersTableComponent implements OnInit {

  @Input('inactiveUsers') inactiveUsers: Array<SysUserType>;
  @Output('reloadTable') reloadTable: EventEmitter<Number> = new EventEmitter();

  constructor(
    private injector: Injector,
    private userService: UserService,
    private toastService: ToastrService,
    private route: ActivatedRoute,
    private permissionService: PermissionsService,
    private modalService: BsModalService,
  ) { }

  reloadUserTable() {
    this.userService.getAllUsersByStatusAndOrgId(false, '').then((res: Array<SysUserType>) => {
      this.inactiveUsers = res;
    }).catch((err) => {
      console.log(err);
      this.toastService.error('User table reloead failed', 'Error Reloading User table');
    });
  }

  openChangeUserPermissionDialog(user: SysUserType) {
    this.permissionService.getUserPermissionsByUserId(user.userId).then((userPerms) => {
      this.permissionService.getAllPermissionsInSystem().then((allPermissions) => {
        const config = {
          initialState: {
            userPermissions: userPerms,
            allPermissions: allPermissions,
            user: user
          }
        };
        const userPermissionSelectRef = this.modalService.show(PermissionSelectorComponent, config);
      }).catch((err) => {
        console.log(err);
        this.toastService.error('Fail to retrieve all system permissions', 'Error');
      });
    }).catch((err) => {
      console.log(err);
      this.toastService.error('Fail to retrieve permissions of user', 'Error');
    });
  }

  openUpdateUserModel(user) {
    const updateUserModelRef = this.modalService.show(EditUserComponent);
    updateUserModelRef.content.editUser = user;
    updateUserModelRef.content.onClose.subscribe((result) => {
      if (result) {
        this.reloadUserTable();
      }
    });
  }

  openDeactivateUserModel(user) {
    const updateUserModelRef = this.modalService.show(DeactivateUserComponent);
    updateUserModelRef.content.editUser = user;
    updateUserModelRef.content.action = 'activate';
    updateUserModelRef.content.actionCaption = 'Activate';
    updateUserModelRef.content.message = 'Activating';
    updateUserModelRef.content.onClose.subscribe((result) => {
      if (result) {
        this.reloadTable.emit(0);
      }
    });
  }

  ngOnInit() {

  }

}
