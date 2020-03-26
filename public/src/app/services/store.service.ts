import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getEndpoint, prepareHeaders} from '../utility/constants';
import {StoreType, OnlineStatusRequestType} from '../data/store.type';
import {reject} from 'q';
import {ProductType} from '../data/product.type';

@Injectable()
export class StoreService {

  constructor(
    private http: HttpClient
  ) {
    this._prepare();
  }
  endpointUrl: String;
  _prepare() {
    this.endpointUrl = `${getEndpoint(true)}/store`;
  }

  createStore(store: StoreType): Promise<number> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.post(url, store, options).subscribe(
        (response) => {
          return resolve(response['storeId']);
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }

  getStoreById(storeId: number): Promise<StoreType> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}?storeId=${storeId}`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.get(url, options).subscribe(
        (response) => {
          return resolve(response['store']);
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }

  getStoresByPartnerId(partnerId: number): Promise<Array<StoreType>> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/all/${partnerId}`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.get(url, options).subscribe(
        (response) => {
          return resolve(response['stores']);
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }

getStoresByUserId(userId: number): Promise<Array<StoreType>> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/allStore/${userId}`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.get(url, options).subscribe(
        (response) => {
          return resolve(response['stores']);
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }

  getStoresByOrganizationLoginUserWorksFor(): Promise<Array<StoreType>> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/branches_by_user_org`;
      const options = prepareHeaders();
      if (!options) {

        return reject(new Error('Empty options object'));
      }
      this.http.get(url, options).subscribe(
        (response) => {
           return resolve(response['stores']);
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }

  updateStore(store: StoreType): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.patch(url, store, options).subscribe(
        (response) => {
          return resolve();
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }

  updateStoreOnlineStatus(store: OnlineStatusRequestType): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/onlineStatusById`;
      const options = prepareHeaders();
      if (!options) {
        return false;
      }
      this.http.post(url, store, options).subscribe(
        (response) => {
          return true;
        },
        (err) => {
          return false;
        }
      );
    });
  }

  getProductsByStoreId(storeId: number): Promise<Array<ProductType>> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/allProducts/${storeId}`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.get(url, options).subscribe(
        (response) => {
          return resolve(response['products']);
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }

}
