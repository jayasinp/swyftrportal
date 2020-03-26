import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getEndpoint, prepareHeaders} from '../utility/constants';
import {OrderInfo, OrderType} from '../data/order.type';
import {reject} from 'q';

@Injectable()
export class OrderService {

  constructor(private http: HttpClient) {
    this._prepare();
  }

  endpointUrl: String;

  _prepare() {
    this.endpointUrl = `${getEndpoint(true)}/order`;
  }

  getAllOrdersByStatus(status): Promise<Array<OrderType>> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/sys/all?status=${status || ''}`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.get(url, options).subscribe(
        (response) => {
          return resolve(response['data']);
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }

  getOrderInfo(id: number): Promise<OrderInfo> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/sys/info/${id}`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.get(url, options).subscribe(
        (response) => {
          return resolve(response['data']);
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }

  updateOrderStatus(orderId: number, status: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/sys/change_status/${orderId}`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      const body = {
        status: status
      };
      this.http.post(url, body, options).subscribe(
        (resp) => resolve(),
        (err) => reject(err)
      );
    });
  }

}
