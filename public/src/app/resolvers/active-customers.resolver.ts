import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {UserService} from '../services/user.service';
import {UserType} from '../data/user.type';

@Injectable()
export class GetActiveCustomersResolver implements Resolve<Array<UserType>> {

  constructor(
    private userService: UserService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Promise<Array<UserType>> {
    return this.userService.getAllCustomerUsersByStatus(true);
  }

}
