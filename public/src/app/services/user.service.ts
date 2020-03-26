import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getEndpoint, prepareHeaders} from '../utility/constants';
import {RiderType, SysUserType, UserType} from '../data/user.type';
import {reject} from 'q';

@Injectable()
export class UserService {

  constructor(
    private http: HttpClient
  ) {
    this._prepare();
  }
  endpointUrl: String;
  _prepare() {
    this.endpointUrl = `${getEndpoint(true)}/user`;
  }

  getSystemUser(email): Promise<SysUserType> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/sys/by_email/${encodeURIComponent(email)}`;
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

  getAllUsers(): Promise<Array<SysUserType>> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/sys/all`;
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

  getAllUsersByStatusAndOrgId(active, orgId): Promise<Array<SysUserType>> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/sys/all?active=${active ? 'true' : 'false'}&orgId=${orgId}`;
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

  createSystemUser(user: SysUserType): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `${getEndpoint(true)}/auth/sys/register`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.post(url, user, options).subscribe(
        (resp) => {
          return resolve(resp['data']);
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }

  updateSystemUser(user: SysUserType): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `${getEndpoint(true)}/user/sys/${user.userId}`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.patch(url, user, options).subscribe(
        (resp) => {
          return resolve(resp);
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }

  changeUserActiveStatus(user: SysUserType, status: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/sys/${user.userId}/${status}`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.delete(url, options).subscribe(
        (resp) => {
          return resolve();
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }

  changeCustomerActiveStatus(user: UserType, status: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/sys/change_cus_status/${user.userId}/${status}`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.delete(url, options).subscribe(
        (resp) => {
          return resolve();
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }

  getAllCustomerUsersByStatus(active): Promise<Array<UserType>> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/sys/all_customers/${active ? 'true' : 'false'}`;
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

  getCustomerById(id: string): Promise<UserType> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/sys/get_customer/${id}`;
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

  getAllRiders(orgId: string): Promise<Array<RiderType>> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/sys/riders/${orgId}`;
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

  updateRiderInfo(riderUpdate: any): Promise<Array<RiderType>> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/sys/riders/update_rider_info`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.post(url, riderUpdate, options).subscribe(
        (resp) => {
          return resolve();
        },
        (err) => reject(err)
      );
    });
  }

}
