import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {PartnerType} from '../data/partner.type';
import {PartnerService} from '../services/partner.service';

@Injectable()
export class PartnerByIdResolver implements Resolve<PartnerType> {

  constructor(
    private partnerService: PartnerService
  ) {}

  resolve(activateRoute: ActivatedRouteSnapshot): Promise<PartnerType> {
    const partnerId = activateRoute.params['id'];
    return this.partnerService.getOrganizationById(partnerId);
  }

}
