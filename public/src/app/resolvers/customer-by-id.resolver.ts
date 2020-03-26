import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {UserType} from '../data/user.type';
import {UserService} from '../services/user.service';

@Injectable()
export class CustomerByIdResolver implements Resolve<UserType> {

  constructor(
    private userService: UserService
  ) {}

  resolve(activateRoute: ActivatedRouteSnapshot): Promise<UserType> {
    const customerId = activateRoute.params['id'];
    return this.userService.getCustomerById(customerId);
  }

}
