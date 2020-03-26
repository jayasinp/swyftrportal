import {Component, OnInit} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {Permission, PermissionItem} from '../../../../data/permission.type';
import {SysUserType} from '../../../../data/user.type';
import {PermissionsService} from '../../../../services/permissions.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-permission-selector',
  templateUrl: './permission-selector.component.html',
  styleUrls: ['./permission-selector.component.scss']
})
export class PermissionSelectorComponent implements OnInit {

  public userPermissions: Array<Permission>;
  public allPermissions: Array<Permission>;
  public user: SysUserType;

  resultPermission: any= {};
  saveButtonClicked = false;

  constructor(
    private permissionService: PermissionsService,
    public activeModel: BsModalRef,
    private toasterService: ToastrService
  ) { }

  ngOnInit(): void {
    this.preparePermissions();
  }

  preparePermissions() {
    this.userPermissions.forEach((perm) => {
      this.resultPermission[perm.id] = true;
    });
  }

  dismiss() {
    this.activeModel.hide();
  }

  onPermissionClicked(permId) {
    if (this.resultPermission[permId]) {
      this.resultPermission[permId] = false;
    } else {
      this.resultPermission[permId] = true;
    }
  }

  onSavePermissionClicked() {
    const result: Array<PermissionItem> = [];
    Object.keys(this.resultPermission).forEach((key) => {
      const permItem: PermissionItem = new PermissionItem();
      permItem.permissionId = parseInt(key);
      permItem.allowed = this.resultPermission[key];
      result.push(permItem);
    });

    this.saveButtonClicked = true;
    this.permissionService.grantOrRevokePermissions(this.user.userId, result).then(() => {
      this.saveButtonClicked = false;
      this.toasterService.success('New permissions saved to user successful. User may required to logout and login again.',
        'Permission Saved');
      this.dismiss();
    }).catch((err) => {
      console.log(err);
      this.saveButtonClicked = false;
      this.toasterService.error(`Error saving permissions: ${err.message}`, 'Unable to save permissions');
    });
  }

}
