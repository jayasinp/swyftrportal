import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getEndpoint, prepareHeaders} from '../utility/constants';
import {RiderType, RiderLocationType, RiderWithLocation} from '../data/user.type';
import {reject} from 'q';
import {RiderManagerOrder} from '../data/order.type';

@Injectable()
export class RiderService {

  constructor(
    private http: HttpClient
  ) {
    this._prepare();
  }

  endpointUrl: String;

  _prepare() {
    this.endpointUrl = `${getEndpoint(true)}/rider`;
  }

  getRiderLastKnownLocation(riderId: string): Promise<RiderLocationType> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/last_known_location/${riderId}`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.get(url, options).subscribe(
        (resp) => {
          return resolve(resp['data']);
        },
        (err) => reject(err)
      );
    });
  }

  getAllRiderLastLocations(): Promise<Array<RiderLocationType>> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/all/last_known_location`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.get(url, options).subscribe(
        (resp) => {
          return resolve(resp['data']);
        },
        (err) => reject(err)
      );
    });
  }

  getAllOngoingOrderForRiderPartner(): Promise<Array<RiderManagerOrder>> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/all/ongoing_orders`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.get(url, options).subscribe(
        (resp) => {
          return resolve(resp['data']);
        },
        (err) => reject(err)
      );
    });
  }

  getUnAssignedOrders(): Promise<Array<RiderManagerOrder>> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/unassigned_orders`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.get(url, options).subscribe(
        (resp) => {
          return resolve(resp['data']);
        },
        (err) => reject(err)
      );
    });
  }

  getNearestRidersForOrderPickupLocation(orderId): Promise<Array<RiderWithLocation>> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/near_by_riders/${orderId}`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.get(url, options).subscribe(
        (resp) => {
          return resolve(resp['data']);
        },
        (err) => reject(err)
      );
    });
  }

  assignRiderToOrderManually(orderId, riderId) {
    return new Promise((resolve, reject)  => {
      const url = `${this.endpointUrl}/assign_rider`;
      const options = prepareHeaders();
      const body = {orderId, riderId};

      if (!options) {
        return reject(new Error('Empty options'));
      }
      this.http.post(url, body, options).subscribe(
        resp => resolve(),
        err => reject(err)
      );
    });
  }

  getOrdersOfARider(riderId): Promise<Array<RiderManagerOrder>> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/order_of_rider/${riderId}`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.get(url, options).subscribe(
        (resp) => {
          return resolve(resp['data']);
        },
        (err) => reject(err)
      );
    });
  }
}
