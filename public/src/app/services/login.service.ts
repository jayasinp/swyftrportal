import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {getEndpoint, prepareHeaders} from '../utility/constants';
import {LoginRequestType, LoginResponseType, UserToken} from '../data/login.type';
import {UpdatePasswordType} from '../data/user.type';
import {reject} from 'q';

@Injectable()
export class LoginService {

  constructor(
    private http: HttpClient
  ) {
    this._prepare();
  }

  endpointUrl: String;
  options: any;
  headers: any;

  _prepare () {
    this.endpointUrl = `${getEndpoint(true)}/auth`;
    this.headers = new HttpHeaders();
    this.headers.set('Content-Type', 'application/json');
    this.options = {
      headers: this.headers,
      responseType: 'json',
      observe: 'body'
    };
  }

  login(loginReq: LoginRequestType): Promise<UserToken> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/sys/login`;
      this.http.post(url, loginReq, this.options).subscribe(
        (data) => {
          const tokenInfo: UserToken = new UserToken();
          tokenInfo.email = loginReq.userName;
          tokenInfo.token = data['accessToken'];
          tokenInfo.ttl = data['timeToLiveInMilliSeconds'];
          return resolve(tokenInfo);
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }

  updatePassword(passwords: UpdatePasswordType): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/sys/update_password`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.post(url, passwords, options).subscribe(
        (resp) => {
          return resolve();
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }

  sendResetPasswordLink(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/sys/send_reset_password_link`;
      const body = {
        email: email
      };
      this.http.post(url, body, this.options).subscribe(
        (resp) => {
          return resolve(resp);
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }

  resetForgotPassword(token, password, retypePassword): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/sys/reset_password`;
      const body = {token, password, retypePassword};
      this.http.post(url, body, this.options).subscribe(
        (resp) => {
          return resolve(resp);
        },
        (err) => {
          return reject(err.error);
        }
      );
    });
  }
}
