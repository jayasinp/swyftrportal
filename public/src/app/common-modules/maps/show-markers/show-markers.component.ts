import {Component, Input, OnInit} from '@angular/core';
import {} from '@types/googlemaps';

let _self;

@Component({
  selector: 'app-show-markers',
  templateUrl: './show-markers.component.html'
})
export class ShowMarkersComponent implements OnInit {

  public points: Array<Array<number>> = [];
  public center = '6.869761, 79.873438';

  @Input('points') public set onPoints(points) {
    this.points = points;
    if (points.length) {
      this.center = `${points[0][0]}, ${points[0][1]}`;
    }
  }

  constructor() {
    _self = this;
  }

  ngOnInit() {
  }

}
