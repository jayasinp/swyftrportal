import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {PartnerType} from '../data/partner.type';
import {PartnerService} from '../services/partner.service';

@Injectable()
export class GetAllActivePartnersResolver implements Resolve<Array<PartnerType>> {

  constructor(
    private partnerService: PartnerService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Promise<Array<PartnerType>> {
    return this.partnerService.getAllPartners(true);
  }

}
