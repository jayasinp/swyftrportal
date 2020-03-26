import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {LoginService} from '../../../services/login.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password-email-step',
  templateUrl: './email-step.component.html',
  styleUrls: ['./email-step.component.scss']
})
export class EmailStepComponent implements OnInit{

  email: string;
  emailFormCntrl: FormControl;
  isSendButtonClicked = false;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  ) {}

  ngOnInit() {
    this.emailFormCntrl = new FormControl('', [Validators.required, Validators.email]);
  }

  back() {
    this.router.navigate(['/']);
  }

  requestResetPassword() {
    if (this.emailFormCntrl.valid) {
      this.isSendButtonClicked = true;
      this.loginService.sendResetPasswordLink(this.email).then((resp) => {
        this.isSendButtonClicked = false;
        this.toastService.success(`${resp['message']}. Check your email account.`, 'Reset Password Link Sent.');
        this.back();
      }).catch((err) => {
        console.log(err);
        this.isSendButtonClicked = false;
        this.toastService.error('Error requesting send reset password link to your email address', 'Request Failed');
      });
    } else {
      this.toastService.error('Email is invalid', 'Invalid Field');
    }
  }

}
