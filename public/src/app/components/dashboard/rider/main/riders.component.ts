import {Component, Input, OnInit} from '@angular/core';
import {RiderType} from '../../../../data/user.type';
import {ActivatedRoute} from '@angular/router';
import {CreateRiderComponent} from '../../popups/create-rider/create-rider.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import {UserService} from '../../../../services/user.service';
import {AuthService} from '../../../../services/auth.service';

@Component({
  selector: 'app-riders',
  templateUrl: './riders.component.html',
  styleUrls: ['./riders.component.scss']
})
export class RidersComponent implements OnInit {

  ridersArr: Array<RiderType>;

  constructor (
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.ridersArr = this.route.snapshot.data['riders'];
  }

  reloadRiders() {
    this.userService.getAllRiders('' + this.authService.getOrganizationOfAuthorizedUser().orgId).then((riders) => {
      this.ridersArr = riders;
    }).catch((err) => {
      console.log(err);
    });
  }

  openCreateRiderModel() {
    const config = {
      initialState: {
      }
    };
    const createRiderModelRef = this.modalService.show(CreateRiderComponent, config);
    createRiderModelRef.content.onClose.subscribe((result) => {
      if (result) {
        this.reloadRiders();
      }
    });
  }
}
