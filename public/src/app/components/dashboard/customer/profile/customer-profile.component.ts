import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserType} from '../../../../data/user.type';
import {FileService} from '../../../../services/file.service';

declare var $: JQueryStatic;

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss']
})
export class CustomerProfileComponent implements OnInit, AfterViewInit {

  customer: UserType;
  customerProfilePicture;

  constructor(
    private activateRoute: ActivatedRoute,
    private fileService: FileService,
  ) {}

  ngOnInit() {
    this.customer = this.activateRoute.snapshot.data['customer'];
    this.downloadCustomerProfilePicture();
  }

  ngAfterViewInit() {
    $('.tab-container ul').css('display', 'none');
  }

  downloadCustomerProfilePicture() {
    if (this.customer.profilePicId) {
      this.fileService.downloadImageFromSystemByFileId(this.customer.profilePicId).then((image) => {
        this.customerProfilePicture = image;
      }).catch((err) => console.log(err));
    }
  }

  selectTab(index) {
    // TODO implement if more than 1 tab in this component
  }

}
