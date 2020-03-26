import {Component, OnInit} from '@angular/core';
import {SysUserType} from '../../../data/user.type';
import {PartnerType} from '../../../data/partner.type';
import {AuthService} from '../../../services/auth.service';
import {PermissionsService} from '../../../services/permissions.service';
import {beautifyUnderscoreConcatinatedString} from '../../../utility/constants';
import {Permission} from '../../../data/permission.type';
import {ToastrService} from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import {UpdatePasswordComponent} from '../popups/update-password/update-password.component';
import { FileUploader } from 'ng2-file-upload';
import {prepareFileUploader} from '../../../utility/constants';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{

  profile: SysUserType;
  organization: PartnerType;
  isEditable = false;
  permissions = [];
  profilePicture;
  fileUploader: FileUploader;
  currentFileItem;
  updateButtonClicked = false;

  constructor(
    private authService: AuthService,
    private permissionService: PermissionsService,
    private toastService: ToastrService,
    private modalService: BsModalService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.profile = this.authService.getProfileOfAuthorizedUser();
    this.organization = this.authService.getOrganizationOfAuthorizedUser();
    this.profilePicture = this.authService.getProfilePictureOfAuthorizedUser();
    this.preparePermissions();
    this.configureFileUploader();
  }

  updateProfile() {
    if (this.isEditable) {
      this.isEditable = false;
    } else {
      this.isEditable = true;
    }
  }

  updateData() {
    this.updateButtonClicked = true;
    this.userService.updateSystemUser(this.profile).then(() => {
      this.updateButtonClicked = false;
      this.toastService.success(
        'Your profile updated. To apply new changes you have to re login to the system. ' +
        'You will be automatically logout from system now....',
        'Successful'
      );
      setTimeout(() => this.authService.logout(), 5000);
    }).catch((err) => {
      this.updateButtonClicked = false;
      this.toastService.error('Profile update failed', 'Failed');
      console.log(err);
    });
  }

  preparePermissions() {
    const permissionNames = this.authService.getLoginUserPermissions();
    if (permissionNames.indexOf('SUPER_USER_SWYFTR') !== -1) {
      this.permissionService.getAllPermissionsInSystem().then((permissions: Array<Permission>) => {
        permissions.forEach((perm: Permission) => {
          this.permissions.push(beautifyUnderscoreConcatinatedString(perm.name));
        });
      }).catch((err) => console.log(err));
    } else {
      this.permissions = permissionNames.map((perm) => {
        return beautifyUnderscoreConcatinatedString(perm);
      });
    }
  }

  openChangePasswordDialog() {
    const updatePasswordComponentRef = this.modalService.show(UpdatePasswordComponent);
  }

  configureFileUploader() {
    this.fileUploader = prepareFileUploader((item: any, response: any, status: any, headers: any) => {
      if (status === 200) {
        this.profile.profilePicId = JSON.parse(response)['fileId'];
      } else {
        console.log(`Got server HTTP Status: ${status}, message: ${response}`);
      }
    }, (item) => {
      this.currentFileItem = item;
    });
  }

}
