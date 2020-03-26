import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AuthService} from '../services/auth.service';
import {ToastrService} from 'ngx-toastr';

@Injectable()
export class FourZeroOneInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private toasterService: ToastrService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).catch((err: HttpErrorResponse) => {
      if ([401, 403].indexOf(err.status) !== -1) {
        this.toasterService.error('Your login has expired. Please login again to continue', 'Invalid Auth Token');
        this.authService.logout();
      }
      return Observable.throw(err);
    });
  }

}
