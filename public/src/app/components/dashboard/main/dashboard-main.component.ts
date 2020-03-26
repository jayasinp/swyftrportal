import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {SysUserType} from '../../../data/user.type';
import {PartnerType} from '../../../data/partner.type';

import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';

let _this;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.css']
})
export class DashboardMainComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    _this = this;
  }

  @Output('onLogout') onLogout: EventEmitter<any> = new EventEmitter();
  activeSideBarLink: string;
  profilePicture;
  loginUser: SysUserType;

  ngOnInit() {
    this.authService.preparePermissions();
    this.getProfilePicture();
    this.loginUser = this.authService.getProfileOfAuthorizedUser();

    if (this.authService.getOrganizationOfAuthorizedUser().orgType === 'partner_rider') {
      this.navigateSideBar('rider-orders');
      this.router.navigateByUrl('/home/rider-orders');
    } else {
      this.navigateSideBar('dashboard');
      this.router.navigateByUrl('/home/dashboard');
    }
  }

  logout() {
    this.onLogout.emit();
  }

  getFullName() {
    try {
      const profile: SysUserType = this.authService.getProfileOfAuthorizedUser();
      if (!profile) {
        return null;
      }
      return `${profile.firstName} (${profile.designation})`;
    } catch (err) {
      console.log(err);
      return '';
    }
  }

  getOrgName() {
    try {
      const org: PartnerType = this.authService.getOrganizationOfAuthorizedUser();
      if (!org) {
        return null;
      }
      return org.name;
    } catch (err) {
      console.log(err);
      return '';
    }
  }

  navigateSideBar(linkName) {
    this.activeSideBarLink = linkName;
  }

  getHeight() {
    return window.screen.availHeight + 100;
  }

  getProfilePicture() {
    this.profilePicture = this.authService.getProfilePictureOfAuthorizedUser();
  }
}
