import {Component, Input, OnInit} from '@angular/core';
import {RiderLocationType} from '../../../data/user.type';

let _self;

@Component({
  selector: 'app-show-rider-marker',
  templateUrl: './show-riders.component.html',
  styleUrls: ['./show-riders.component.scss']
})
export class ShowRidersComponent implements OnInit {

  public points: Array<RiderLocationType> = [];
  public center = '6.869761, 79.873438';

  public selectedPointForInfoWindow: RiderLocationType;

  @Input('points') public set onPoints(points) {
    this.points = points;
    if (points.length) {
      const fe: RiderLocationType = points[0]
      this.center = `${fe.location._lat}, ${fe.location._long}`;
    }
  }

  constructor(

  ) {_self = this; }

  ngOnInit() {

  }

  markerClicked({target: marker}, point: RiderLocationType) {
    this.selectedPointForInfoWindow = point
    marker.nguiMapComponent.openInfoWindow('iw', marker);
  }

  getIcon(point: RiderLocationType) {
    const icon = {
      anchor: [16, 16],
      size: [32, 32],
      scaledSize: [32, 32]
    };

    switch (point.status) {
      case 'OFFLINE':
        icon['url'] = '/img/rider-offline.png';
        break;
      case 'AVAILABLE':
        icon['url'] = '/img/rider-online.png';
        break;
      default:
        icon['url'] = '/img/rider-delivery.png';
        break;
    }

    return icon;
  }
}
