import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import {ActivatedRoute} from '@angular/router';
import {CreateUserComponent} from '../../popups/create-user/create-user.component';
import {SysUserType} from '../../../../data/user.type';
import {PartnerService} from '../../../../services/partner.service';
import {TabsetComponent} from 'ngx-bootstrap';
import {UserService} from '../../../../services/user.service';
import {ToastrService} from 'ngx-toastr';
import {StoreType} from '../../../../data/store.type';

declare var $: JQueryStatic;

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './users-dashboard.component.html',
  styleUrls: ['./users-dashboard.component.scss']
})
export class UsersDashboardComponent implements OnInit, AfterViewInit {

  activeUserArray: Array<SysUserType>;
  inActiveUserArray: Array<SysUserType>;
  storesOfMyOrg: Array<StoreType>;

  @ViewChild('userTabs') userTabs: TabsetComponent;
  public activeTab = 'activate_users';

  constructor(
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private partnerService: PartnerService,
    private userService: UserService,
    private toastService: ToastrService
  ) {}

  openCreateUserModel() {
    this.partnerService.getAllPartners(true).then((partnerArr) => {
      const config = {
        initialState: {
          organizationList: partnerArr
        }
      };
      const createUserModelRef = this.modalService.show(CreateUserComponent, config);
      createUserModelRef.content.onClose.subscribe((result) => {
        if (result) {
          this.reloadAndSelectTables(0);
        }
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  ngOnInit() {
    this.activeUserArray = this.route.snapshot.data['activeUsers'];
    this.inActiveUserArray = this.route.snapshot.data['inativeUsers'];
    this.storesOfMyOrg = this.route.snapshot.data['storesOfMyOrg'] || [];
  }

  ngAfterViewInit() {
    $('.tab-container ul').css('display', 'none');
  }

  selectTab(index) {
    this.userTabs.tabs[index].active = true;
    this.activeTab = index === 0 ? 'activate_users' : 'deactivate_users';
  }

  reloadAndSelectTables(tableIndex) {
    switch (tableIndex) {
      case 0 :
        this.userService.getAllUsersByStatusAndOrgId(true, '').then((userArr: Array<SysUserType>) => {
          this.activeUserArray = userArr;
          this.selectTab(0);
        }).catch((err) => {
          console.log(err);
          this.toastService.error('Can not reload active users please try again', 'Refres Failed');
        });
        break;
      case 1:
        this.userService.getAllUsersByStatusAndOrgId(false, '').then((userArr: Array<SysUserType>) => {
          this.inActiveUserArray = userArr;
          this.selectTab(1);
        }).catch((err) => {
          console.log(err);
          this.toastService.error('Can not reload deactivated users please try again', 'Refres Failed');
        });
        break;
    }
  }

}
