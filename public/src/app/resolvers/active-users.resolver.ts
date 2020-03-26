import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {UserService} from '../services/user.service';
import {SysUserType} from '../data/user.type';

@Injectable()
export class GetActiveUserResolver implements Resolve<Array<SysUserType>> {

  constructor(
    private userService: UserService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Promise<Array<SysUserType>> {
    return this.userService.getAllUsersByStatusAndOrgId(true, '');
  }

}
