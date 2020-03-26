import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {RiderLocationType} from '../data/user.type';
import {RiderService} from '../services/rider.service';

@Injectable()
export class AllRiderLocationsResolver implements Resolve<Array<RiderLocationType>> {

  constructor(
    private riderService: RiderService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Promise<Array<RiderLocationType>> {
    return this.riderService.getAllRiderLastLocations();
  }

}
