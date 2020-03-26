import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getEndpoint, prepareHeaders} from '../utility/constants';
import {PartnerType} from '../data/partner.type';
import {reject} from 'q';

@Injectable()
export class PartnerService {

  constructor(
    private http: HttpClient
  ) {
    this._prepare();
  }
  endpointUrl: String;
  _prepare() {
    this.endpointUrl = `${getEndpoint(true)}/partner`;
  }

  getOrganizationById(orgId): Promise<PartnerType> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/sys?orgId=${orgId}`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.get(url, options).subscribe(
        (response) => {
          return resolve(response);
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }

  getAllPartners(status): Promise<Array<PartnerType>> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/sys/all/${status ? 'active' : 'inactive'}`;
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

  createPartner(partnerOrg: PartnerType) {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.post(url, partnerOrg, options).subscribe(
        (resp) => {
          return resolve(resp['orgId']);
        },
        (err) => reject(err)
      );
    });
  }

  updatePartner(partner: PartnerType): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}?orgId=${partner.orgId}`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.patch(url, partner, options).subscribe(
        (resp) => {
          return resolve(resp);
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }

  changePartnerStatus(partner: PartnerType, status): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/sys/${partner.orgId}/${status ? 'activate' : 'deactivate'}`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.delete(url, options).subscribe(
        (resp) => {
          return resolve(resp);
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }

}
