import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {RiderType} from '../data/user.type';
import {UserService} from '../services/user.service';
import {AuthService} from '../services/auth.service';
@Injectable()
export class GetAllRidersForAPartnerResolver implements Resolve<Array<RiderType>> {

  constructor(
    private userServicer: UserService,
    private authService: AuthService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Promise<Array<RiderType>> {
    let partnerId = route.params['id'];

    if (!partnerId) {
      partnerId = this.authService.getOrganizationOfAuthorizedUser().orgId
    }

    return this.userServicer.getAllRiders(partnerId);
  }

}
