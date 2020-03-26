import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { DialogModule } from 'custom-angular-dialog';

import {KanbanDashboardComponent} from './kanban-dashboard/kanban-dashboard.component';
import {KanbanColumnComponent} from './kanban-column/kanban-column.component';
import {OrderItemComponent} from './order-item/order-item.component';
import {ViewOrderPopupComponent} from './view-order-popup/view-order-popup.component';

const ENTRY_COMPONENTS = [ViewOrderPopupComponent];

const KANBAN_COMPONENTS = [KanbanDashboardComponent, KanbanColumnComponent, OrderItemComponent, ...ENTRY_COMPONENTS];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ToastrModule.forRoot(),
    DialogModule
  ],
  exports: [
    ...KANBAN_COMPONENTS
  ],
  declarations: [
    ...KANBAN_COMPONENTS
  ],
  providers: [],
  entryComponents: ENTRY_COMPONENTS,
  schemas: [NO_ERRORS_SCHEMA]
})
export class KanbanModule {

}
