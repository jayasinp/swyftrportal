import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BsModalService} from 'ngx-bootstrap';
import {RiderType} from '../../../../data/user.type';
import {UserService} from '../../../../services/user.service';
import {AuthService} from '../../../../services/auth.service';
import {EditRiderComponent} from '../../popups/edit-rider/edit-rider.component';
import {RIDER_STATUS} from '../../../../utility/constants';

@Component({
  selector: 'app-rider-table',
  templateUrl: './rider-table.component.html',
  styleUrls: ['./rider-table.component.scss']
})
export class RiderTableComponent implements OnInit {

  @Input('riders') riders: Array<RiderType>;

  constructor (
    private modalService: BsModalService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.riders) {
      const myId = this.authService.getProfileOfAuthorizedUser().userId;
      this.riders = this.riders.filter((r: RiderType) => {
        if (r.userId !== myId) return r;
      });
    }
  }

  reloadRiders() {
    this.userService.getAllRiders('' + this.authService.getOrganizationOfAuthorizedUser().orgId).then((riders) => {
      const myId = this.authService.getProfileOfAuthorizedUser().userId;
      this.riders = riders.filter((r: RiderType) => {
        if (r.userId !== myId) return r;
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  openEditRiderProfile(rider: RiderType) {
    const config = {
      initialState: {
        riderUser: rider
      }
    };
    const updatePartnerModelRef = this.modalService.show(EditRiderComponent, config);
    updatePartnerModelRef.content.onClose.subscribe((result) => {
      if (result) {
        this.reloadRiders();
      }
    });
  }

  viewRiderProfile(rider: RiderType) {
    this.router.navigate(['/home/rider-profile', rider]);
  }

  getRiderStatus(status) {
    return RIDER_STATUS[status];
  }

}
