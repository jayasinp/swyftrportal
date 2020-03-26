import {Component, EventEmitter, Injector, Input, OnInit, Output} from '@angular/core';
import { SysUserType } from '../../../../data/user.type';
import { UserService } from '../../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { PermissionsService } from '../../../../services/permissions.service';
import {AuthService} from '../../../../services/auth.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PermissionSelectorComponent } from '../../popups/permission-selector/permission-selector.component';
import { EditUserComponent } from '../../popups/edit-user/edit-user.component';
import {DeactivateUserComponent} from '../../popups/deactivate-user/deactivate-user.component';
import {StoreType} from '../../../../data/store.type';

@Component({
  selector: 'app-active-users',
  templateUrl: './active-users-table.component.html',
  styleUrls: ['./active-users-table.component.scss']
})

export class ActiveUsersTableComponent implements OnInit {

  @Input('activeUsers') activeUsers: Array<SysUserType>;
  @Input('storesOfMyOrg') storesOfMyOrg: Array<StoreType>;
  @Output('reloadTable') reloadTable: EventEmitter<Number> = new EventEmitter();

  loginUser: SysUserType;

  constructor(
    private userService: UserService,
    private toastService: ToastrService,
    private permissionService: PermissionsService,
    private modalService: BsModalService,
    private authService: AuthService
  ) {}

  reloadUserTable() {
    this.userService.getAllUsersByStatusAndOrgId(true, this.loginUser.orgId).then((res: Array<SysUserType>) => {
      this.activeUsers = res;
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
    const config = {
      initialState: {
        editUser: user,
        stores: this.storesOfMyOrg.map((store: StoreType) => {
          return { text: store.branchName, id: store.id};
        })
      }
    };
    const updateUserModelRef = this.modalService.show(EditUserComponent, config);
    updateUserModelRef.content.onClose.subscribe((result) => {
      if (result) {
        this.reloadUserTable();
      }
    });
  }

  getBranchName(branchId) {
    if (!branchId) return '';
    let branch: StoreType = null;
    this.storesOfMyOrg.forEach((store: StoreType) => {
      if (store.id === branchId) {
        branch = store;
      }
    });

    if (branch) return branch.branchName;
    else return '';
  }

  openDeactivateUserModel(user) {
    const updateUserModelRef = this.modalService.show(DeactivateUserComponent);
    updateUserModelRef.content.editUser = user;
    updateUserModelRef.content.action = 'deactivate';
    updateUserModelRef.content.actionCaption = 'Deactivate';
    updateUserModelRef.content.message = 'deactivating';
    updateUserModelRef.content.onClose.subscribe((result) => {
      if (result) {
        this.reloadTable.emit(1);
      }
    });
  }

  ngOnInit() {
    this.loginUser = this.authService.getProfileOfAuthorizedUser();
  }

}
