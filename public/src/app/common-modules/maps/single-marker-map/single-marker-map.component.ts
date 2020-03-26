import {Component, Input, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import {DrawingManager} from '@ngui/map';
import {} from '@types/googlemaps';

let _self;

@Component({
  selector: 'app-map-marker',
  templateUrl: './single-marker-map.component.html'
})
export class SingleMarkerMapComponent implements OnInit {

  public points: Array<Array<number>> = [];

  constructor() {
    _self = this;
  }

  @ViewChild(DrawingManager) drawingManager: DrawingManager;
  @Output('onLocationMarked') onLocationMarked: EventEmitter<any> = new EventEmitter<any>();
  @Input('center') center;
  @Input('points') public set onPoints(points) {
    if (points) this.points = points;
  }
  public overlay: any;

  ngOnInit() {
    this.configureDrawingManager();
  }

  configureDrawingManager() {
    this.drawingManager['initialized$'].subscribe((dm) => {
      google.maps.event.addListener(dm, 'overlaycomplete', function (event) {
        _self.deleteSelectedOverlay();
        const overlay = event.overlay;
        _self.overlay = overlay;
        _self.points = []; // Reseting old locations on view
        _self.onLocationMarked.emit(event);
      });
    });
  }

  deleteSelectedOverlay() {
    if (_self.overlay) {
      _self.overlay.setMap(null);
    }
  }

}
