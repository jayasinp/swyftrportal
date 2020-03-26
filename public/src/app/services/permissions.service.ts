import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getEndpoint, prepareHeaders} from '../utility/constants';
import {Permission, PermissionItem} from '../data/permission.type';
import {reject} from 'q';

@Injectable()
export class PermissionsService {

  constructor(private http: HttpClient) {
    this._prepare();
  }

  endpointUrl: String;

  _prepare() {
    this.endpointUrl = `${getEndpoint(true)}/auth`;
  }

  grantOrRevokePermissions(userId, permissions: Array<PermissionItem>) {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/sys/permission`;
      const body = {userId, permissions};
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.post(url, body, options).subscribe(
        (resp) => {
          return resolve(resp);
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }

  getAllPermissionsInSystem(): Promise<Array<Permission>> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/sys/permission/all`;
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

  getAllPermissionsOfUser(): Promise<Array<Permission>> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/sys/permission`; // User Email is set in header
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

  getUserPermissionsByUserId(userId): Promise<Array<Permission>> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/sys/permission/other/${userId}`;
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

  getAllPermissionNamesOfUser(): Promise<Array<String>> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/sys/permission/names`; // User Email is set in header
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
