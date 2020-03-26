import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {LoginService} from '../../../services/login.service';

@Component({
  selector: 'app-token-step',
  templateUrl: './token-step.component.html',
  styleUrls: ['./token-step.component.scss']
})
export class TokenStepComponent implements OnInit {

  token: string;
  isSendButtonClicked = false;

  passwordContrl: FormControl;
  retypePasswordContrl: FormControl;

  password: string;
  retypePassword: string;

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private toastService: ToastrService,
    private loginService: LoginService
  )  {}

  ngOnInit() {
    this.passwordContrl = new FormControl('', [Validators.required]);
    this.retypePasswordContrl = new FormControl('', [this.validatePasswordMatching()]);

    this.activateRoute.queryParams.subscribe((data) => {
      this.token = data.token;
    });
  }

  resetPassword() {
    if (this.token && this.token !== '' && this.passwordContrl.valid && this.retypePasswordContrl.valid) {
console.log(this.token );
      this.isSendButtonClicked = true;
      this.loginService.resetForgotPassword(this.token, this.password, this.retypePassword).then(() => {
        this.isSendButtonClicked = false;
        this.toastService.success('Your password has successfully reset. Please login with new password', 'Password Reset Successfull');
        this.router.navigate(['/']);
      }).catch((err) => {
        this.isSendButtonClicked = false;
        console.log(err)
        this.toastService.error(`${err.message}. Please request a reset password again.`, 'Failed To Reset Password')
        if (err.status === 401) {
          this.router.navigate(['fp-email']);
        } else {
          this.router.navigate(['/']);
        }
      });
    } else {
      this.toastService.error('One or more field is invalid (or token is expired).', 'Invalid Field');
    }
  }

  validatePasswordMatching() {
    return (c: FormControl) => {
      let isValid = true;
      if (!this.password || !this.retypePassword
        || this.password !== this.retypePassword) {
        isValid = false;
      }
      return isValid ? null : {
        retypePassword: {
          valid: false
        }
      };
    };
  }

  back() {
    this.router.navigate(['/']);
  }

}
