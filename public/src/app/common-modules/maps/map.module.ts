import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {NguiMapModule} from '@ngui/map';
import {GOOGLE_API_KEY} from '../../utility/constants';

import {SingleMarkerMapComponent} from './single-marker-map/single-marker-map.component';
import {ShowMarkersComponent} from './show-markers/show-markers.component';
import {ShowRidersComponent} from './show-riders/show-riders.component';

const MAP_COMPONENTS = [SingleMarkerMapComponent, ShowMarkersComponent, ShowRidersComponent];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    NguiMapModule.forRoot({ apiUrl: `https://maps.google.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=visualization,places,drawing` })
  ],
  exports: [
    ...MAP_COMPONENTS
  ],
  declarations: [
    ...MAP_COMPONENTS
  ],
  providers: [],
  entryComponents: [],
})
export class MapModule {

}
