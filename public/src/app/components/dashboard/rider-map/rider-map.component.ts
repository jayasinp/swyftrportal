import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RiderLocationType} from '../../../data/user.type';
import {RiderService} from '../../../services/rider.service';

@Component({
  selector: 'app-rider-map',
  templateUrl: './rider-map.component.html'
})
export class RiderMapComponent implements OnInit {

  riderLocationsArr: Array<RiderLocationType> = [];
  timerId

  constructor(
    private route: ActivatedRoute,
    private riderService: RiderService
  ) { }

  ngOnInit () {
    this.riderLocationsArr = this.route.snapshot.data['riderLocations'];
    this.startRiderLocationQueryRefresher();
  }

  startRiderLocationQueryRefresher() {
    this.timerId = setInterval(()=> {
      this.riderService.getAllRiderLastLocations().then((locs: Array<RiderLocationType>) => {
        this.riderLocationsArr = locs;
      }).catch(err => console.error(err));
    }, 30 * 1000);
  }
}
