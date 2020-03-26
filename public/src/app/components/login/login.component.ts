import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {Validators, FormControl} from '@angular/forms';
import { NgxPermissionsService } from 'ngx-permissions';

import {LoginService} from '../../services/login.service';
import {UserService} from '../../services/user.service';
import {AuthService} from '../../services/auth.service';
import {PartnerService} from '../../services/partner.service';
import {PermissionsService} from '../../services/permissions.service';
import {FileService} from '../../services/file.service';

import {LoginRequestType, UserToken} from '../../data/login.type';
import {SysUserType} from '../../data/user.type';
import {PartnerType} from '../../data/partner.type';
import {Permission} from '../../data/permission.type';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private authService: AuthService,
    private partnerService: PartnerService,
    private router: Router,
    private permissionService: PermissionsService,
    private permissionValidationService: NgxPermissionsService,
    private fileService: FileService
  ) { }

  loginEmailController: FormControl;
  loginPasswordController: FormControl;
  isLoginClicked = false;
  email: string;
  password: string;
  userNameErrorMessage: string;
  passwordErrorMessage: string;
  loginError: string;

  ngOnInit() {
    this.loginEmailController = new FormControl('', [Validators.required, Validators.email]);
    this.loginPasswordController = new FormControl('', [Validators.required]);

    if (this.authService.isAuthenticated()) {
      return this.goToHome();
    }
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  login() {
    this._resetErrorMessages();
    if (!this.loginEmailController.valid) {
      this.userNameErrorMessage = 'Invalid Email';
      return;
    }
    if (!this.loginPasswordController.valid) {
      this.passwordErrorMessage = 'Password should not be empty';
      return;
    }
    const loginRequest: LoginRequestType = new LoginRequestType();
    loginRequest.userName = this.email;
    loginRequest.password = this.password;
    this.isLoginClicked = true;
    this.loginService.login(loginRequest).then((token: UserToken) => {
      token.email = loginRequest.userName;
      token.loginAt = Date.now();
      localStorage.setItem('session', JSON.stringify({
        auth: token
      }));
      this.userService.getSystemUser(loginRequest.userName).then((profile: SysUserType) => {
        this.partnerService.getOrganizationById(profile.orgId).then((organization: PartnerType) => {
          this.permissionService.getAllPermissionNamesOfUser().then((myPermissions: Array<string>) => {
            const session = {
              auth: token,
              profile: profile,
              organization: organization,
              permissions: myPermissions
            };
            if (profile.profilePicId) {
              this.fileService.downloadImageFromSystemByFileId(profile.profilePicId).then((image) => {
                session['profilePicture'] = image
                this.isLoginClicked = false;
                this.permissionValidationService.loadPermissions(myPermissions);
                localStorage.setItem('session', JSON.stringify(session));
                this.goToHome();
              }).catch((err) => {
                this.isLoginClicked = false;
                console.log(JSON.stringify(err));
                this.loginError = err.error.message;
              });
            } else {
              this.isLoginClicked = false;
              this.permissionValidationService.loadPermissions(myPermissions);
              localStorage.setItem('session', JSON.stringify(session));
              this.goToHome();
            }
          }).catch((err) => {
            this.isLoginClicked = false;
            console.log(JSON.stringify(err));
            this.loginError = err.error.message;
          });
        }).catch((err) => {
          this.isLoginClicked = false;
          console.log(JSON.stringify(err));
          this.loginError = err.error.message;
        });
      }).catch((err) => {
        this.isLoginClicked = false;
        console.log(JSON.stringify(err));
        this.loginError = err.error.message;
      });
    }).catch((err) => {
      this.isLoginClicked = false;
      console.log(JSON.stringify(err));
      this.loginError = err.error.message;
    });
  }

  _resetErrorMessages() {
    this.userNameErrorMessage = '';
    this.passwordErrorMessage = '';
    this.loginError = '';
  }

  onForgotPasswordClicked() {
    this.router.navigate(['fp-email']);
  }
}
