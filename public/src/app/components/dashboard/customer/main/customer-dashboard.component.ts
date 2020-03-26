import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import {ActivatedRoute} from '@angular/router';
import {UserType} from '../../../../data/user.type';
import {TabsetComponent} from 'ngx-bootstrap';
import {UserService} from '../../../../services/user.service';
import {ToastrService} from 'ngx-toastr';

declare var $: JQueryStatic;

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent implements OnInit, AfterViewInit {

  activeUserArray: Array<UserType>;
  inActiveUserArray: Array<UserType>;

  @ViewChild('customerTabs') customerTabs: TabsetComponent;
  public activeTab = 'active_cus';

  constructor(
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private userService: UserService,
    private toastService: ToastrService
  ) {}

  ngOnInit() {
    this.activeUserArray = this.route.snapshot.data['activeCustomers'];
    this.inActiveUserArray = this.route.snapshot.data['inactiveCustomers'];
  }

  ngAfterViewInit() {
    $('.tab-container ul').css('display', 'none');
  }

  selectTab(index) {
    this.customerTabs.tabs[index].active = true;
    this.activeTab = index === 0 ? 'active_cus' : 'inactive_cus';
  }

  reloadAndSelectTables(tableIndex) {
    switch (tableIndex) {
      case 0 :
        this.userService.getAllCustomerUsersByStatus(true).then((userArr: Array<UserType>) => {
          this.activeUserArray = userArr;
          this.selectTab(0);
        }).catch((err) => {
          console.log(err);
          this.toastService.error('Can not reload active users please try again', 'Refres Failed');
        });
        break;
      case 1:
        this.userService.getAllCustomerUsersByStatus(false).then((userArr: Array<UserType>) => {
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
