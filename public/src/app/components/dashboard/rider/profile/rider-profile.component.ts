import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RiderType, SysUserType, RiderLocationType, FireStoreLocationType} from '../../../../data/user.type';
import {AuthService} from '../../../../services/auth.service';
import {RiderService} from '../../../../services/rider.service';

@Component({
  selector: 'app-rider-profile',
  templateUrl: './rider-profile.component.html',
  styleUrls: ['./rider-profile.component.scss']
})
export class RiderProfileComponent implements OnInit, AfterViewInit {

  rider: RiderType;
  loginUser: SysUserType;
  riderLocationArr = [];

  riderOdersArr = [];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private riderService: RiderService
  ) {}

  ngOnInit () {
    this.rider = this.route.snapshot.params;
    this.loginUser = this.authService.getProfileOfAuthorizedUser();
    this.loadRiderLocation();
    this.loadRiderOrders();
  }

  ngAfterViewInit() {
    $('.tab-container ul').css('display', 'none');
  }

  loadRiderLocation() {
    this.riderService.getRiderLastKnownLocation(`${this.rider.userId}`).then((data: RiderLocationType) => {
      this.riderLocationArr = [];
      if (data && data.location) {
        this.riderLocationArr.push(data);
      }
    }).catch(err => console.log(err));
  }

  loadRiderOrders() {
    this.riderService.getOrdersOfARider(`${this.rider.userId}`).then( (data) => {
      this.riderOdersArr = data;
    }).catch(err => console.log(err));
  }
}
