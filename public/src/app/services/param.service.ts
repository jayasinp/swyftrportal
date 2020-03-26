import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getEndpoint, prepareHeaders} from '../utility/constants';
import {reject} from 'q';

@Injectable()
export class ParamService {

  constructor(
    private http: HttpClient
  ) {
    this._prepare();
  }
  endpointUrl: String;
  endpointUrl1: String;
  _prepare() {
    this.endpointUrl = `${getEndpoint(true)}/params/byKey`;
  }


  getCommonParams(key : string): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/${key}`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.get(url, options).subscribe(
        (response) => {
          return resolve(response['value']);
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }


}