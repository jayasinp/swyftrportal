import {Component, OnInit} from '@angular/core';
import {Validators, FormControl} from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {SysUserType} from '../../../../data/user.type';
import {SYS_USER_TYPE} from '../../../../utility/constants';
import {UserService} from '../../../../services/user.service';
import {AuthService} from '../../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import {Subject} from 'rxjs/Subject';
import {PartnerType} from '../../../../data/partner.type';

@Component({
  selector: 'app-create-user-popup',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit{

  firstNameCntrl: FormControl;
  lastNameCntrl: FormControl;
  emailCntrl: FormControl;
  mobileCntrl: FormControl;
  nicCntrl: FormControl;
  orgIdCntrl: FormControl;
  designationCntrl: FormControl;
  addressCntrl: FormControl;

  _me: SysUserType;

  public organizationList: Array<any>;
  userObj: SysUserType = new SysUserType();
  userTypeArr = SYS_USER_TYPE;
  userType: string;
  orgArr: Array<any> = [];
  createButtonClicked = false;

  public onClose: Subject<boolean>;

  constructor(
    public activeModel: BsModalRef,
    private userService: UserService,
    private toasterService: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.orgArr = this.organizationList.map((org: PartnerType) => {
      return { text: org.name, id: org.orgId};
    });
    this.firstNameCntrl = new FormControl('', [Validators.required]);
    this.lastNameCntrl = new FormControl('', [Validators.required]);
    this.emailCntrl = new FormControl('', [Validators.required, Validators.email]);
    this.mobileCntrl = new FormControl('', [Validators.required]);
    this.nicCntrl = new FormControl('', [Validators.required]);
    this.orgIdCntrl = new FormControl('', [Validators.required]);
    this.designationCntrl = new FormControl('', [Validators.required]);
    this.addressCntrl = new FormControl('', [Validators.required]);
    this.onClose = new Subject();
    this._me = this.authService.getProfileOfAuthorizedUser();

    if (this._me.userType !== 'swyftr') {
      this.userObj.userType = this._me.userType;
      this.userObj.orgId = this._me.orgId;
    }
  }

  dismiss() {
    this.onClose.next(false);
    this.activeModel.hide();
  }

  onUserTypeChange(type) {
    this.userObj.userType = type.type;

    if (type.type === 'swyftr') {
      this.userObj.orgId = this._me.orgId;
    }
  }

  getOrgArray() {
    let orgArr = [];

    switch (this.userObj.userType) {
      case 'swyftr':
        // No organization selection for swyftr users
        break;

      case 'rider':
        orgArr = this.organizationList.filter((org: PartnerType) => {
          if (org.orgType === 'partner_rider') {
            return org;
          }
        });
        break;

      case 'partner':
        orgArr = this.organizationList.filter((org: PartnerType) => {
          if (org.orgType !== 'partner_rider' && org.orgType !== 'swyftr') {
            return org;
          }
        });
        break;

      default:
        break;
    }

    return orgArr.map((org: PartnerType) => {
      return { text: org.name, id: org.orgId};
    });
  }

  onOrganizationSelected(orgId) {
    this.userObj.orgId = orgId;
  }

  createSystemUser() {
    if (this.firstNameCntrl.valid && this.lastNameCntrl.valid && this.emailCntrl.valid && this.mobileCntrl.valid &&
          this.nicCntrl.valid && this.userObj.orgId && this.addressCntrl.valid) {

      if (this.userObj.userType === 'swyftr' && this.userObj.orgId !== 1) {
        return this.toasterService.error('User type "Swyftr employee" only allowed for those who works in "Swyfter organization"',
          'User type and organization he/she works for mismatch');
      }

      if (this._me.userType === 'swyftr') {
        if (!this.userObj.userType) {
          return this.toasterService.error('Please select valid user type',
            'Empty User Type');
        }

        if (!this.userObj.orgId) {
          return this.toasterService.error('Please select a partner organization user belongs to',
            'User Should Attach To a Partner Organization');
        }

        if (this.userObj.userType !== 'swyftr') {
          let userOrg: PartnerType;
          this.organizationList.forEach((org: PartnerType) => {
            if (org.orgId === this.userObj.orgId) {
              userOrg = org;
            }
          });

          if (!userOrg) return this.toasterService.error('Not valid organization', 'Invalid operation');
          if (userOrg.orgType === 'partner_store' && this.userObj.userType !== 'partner') {
            return this.toasterService.error('If user works for a "Partner Store", user type should be partner',
              'User\'s organization type and user\'s type mismatch');
          }
          if (userOrg.orgType === 'partner_rider' && this.userObj.userType !== 'rider') {
            return this.toasterService.error('If user works for a "Rider Provider", user type should be rider',
              'User\'s organization type and user\'s type mismatch');
          }
        }
      }

      this.createButtonClicked = true;
      this.userService.createSystemUser(this.userObj).then(() => {
        this.createButtonClicked = false;
        this.toasterService.success(
          `${this.userObj.firstName} ${this.userObj.lastName} registered with the system. 
          A system generated password will be send to user's official email.`,
          'User Created Successfully'
          );
        this.onClose.next(true);
        this.activeModel.hide();
      }).catch((err) => {
        this.createButtonClicked = false;
        this.toasterService.error(`Fail to create user due to ${err.message}`, 'Create User Failed');
        console.log(err);
      });
    } else {
      this.toasterService.error('One or more required field are missing', 'Can not submit');
    }
  }

}
