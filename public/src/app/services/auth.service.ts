import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';

import {SysUserType, UpdatePasswordType} from '../data/user.type';
import {PartnerType} from '../data/partner.type';
import {Permission} from '../data/permission.type';

@Injectable()
export class AuthService {

  constructor(
    private router: Router,
    private permissionValidationService: NgxPermissionsService
  ) {}

  isAuthenticated(): boolean {
    try {
      const session = JSON.parse(localStorage.getItem('session'));
      if (!session) return false;
      const auth = session['auth'];
      if (!auth || !auth || !auth.hasOwnProperty('email') || !auth.hasOwnProperty('token')) return false;
      if (Date.now() - auth.loginAt > auth.ttl) return false;
      return true;
    } catch (ex) {
      console.log(ex);
      return false;
    }
  }

  logout() {
    this.permissionValidationService.flushPermissions();
    localStorage.removeItem('session');
    this.router.navigate(['/']);
  }

  getProfileOfAuthorizedUser(): SysUserType {
    try {
      const session = JSON.parse(localStorage.getItem('session'));
      return session['profile'];
    } catch (e) {
      console.log('Logout, Can not parse profile: ', e)
      this.logout();
    }
  }

  getOrganizationOfAuthorizedUser(): PartnerType {
    try {
      const session = JSON.parse(localStorage.getItem('session'));
 //console.log("get local storage by Damith   "+session)
 //console.log(session)

      return session['organization'];
    } catch (e) {
      console.log('Logout, Can not parse organization: ', e)
      this.logout();
    }
  }

  getLoginUserPermissions(): Array<string> {
    try {
      const session = JSON.parse(localStorage.getItem('session'));
console.log("session ")
    console.log(session )
      return session['permissions'] || [];
    } catch (e) {
      console.log('Logout, Can not parse organization: ', e)
      this.logout();
    }
  }

  preparePermissions() {
    const permissions = this.getLoginUserPermissions();
    this.permissionValidationService.loadPermissions(permissions);
  }

  getProfilePictureOfAuthorizedUser(): PartnerType {
    try {
      const session = JSON.parse(localStorage.getItem('session'));
      return session['profilePicture'];
    } catch (e) {
      console.log('Logout, Can not parse profilePicture: ', e)
      this.logout();
    }
  }

}
