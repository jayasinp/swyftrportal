import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DataTablesModule } from 'angular-datatables';
import { DialogModule } from 'custom-angular-dialog';

// Bootstrap
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SelectModule } from 'ng2-select';
import { ToastrModule } from 'ngx-toastr';
import { MapModule } from './common-modules/maps/map.module';
import { KanbanModule } from './common-modules/kanban/kanban.module';
import { FileUploadModule } from 'ng2-file-upload';
import { BsDatepickerModule } from 'ngx-bootstrap';

import {AppComponent} from './components/main/app.component';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/login/login.component';
import {DashboardMainComponent} from './components/dashboard/main/dashboard-main.component';
import {CreateUserComponent} from './components/dashboard/popups/create-user/create-user.component';
import {EditUserComponent} from './components/dashboard/popups/edit-user/edit-user.component';
import {PermissionSelectorComponent} from './components/dashboard/popups/permission-selector/permission-selector.component';
import {CreatePartnerComponent} from './components/dashboard/popups/create-partner/create-partner.component';
import {CreatePartneruserComponent} from './components/dashboard/popups/create-partneruser/create-partneruser.component';
import {EditPartnerComponent} from './components/dashboard/popups/edit-partner/edit-partner.component';
import {EditPartneruserComponent} from './components/dashboard/popups/edit-partneruser/edit-partneruser.component';
import {DeactivatePartnerComponent} from './components/dashboard/popups/deactivate-partner/deactivate-partner.component';
import {UpdatePasswordComponent} from './components/dashboard/popups/update-password/update-password.component';
import {StoresComponent} from './components/dashboard/stores/main/stores.component';
import {CreateStoreComponent} from './components/dashboard/popups/create-store/create-store.component';
import {ActiveUsersTableComponent} from './components/dashboard/users/active-users/active-users-table.component';
import {InactiveUsersTableComponent} from './components/dashboard/users/inactive-users/inactive-users-table.component';
import {DeactivateUserComponent} from './components/dashboard/popups/deactivate-user/deactivate-user.component';
import {ProductsComponent} from './components/dashboard/products/products.component';
import {ProductsuserComponent} from './components/dashboard/productsuser/productsuser.component';
import {CreateProductComponent } from './components/dashboard/popups/create-product/create-product.component';
import {CreateProductuserComponent } from './components/dashboard/popups/create-productuser/create-productuser.component';
import {EditProductComponent} from './components/dashboard/popups/edit-product/edit-product.component';
import {EditProductuserComponent} from './components/dashboard/popups/edit-productuser/edit-productuser.component';
import {ActiveCustomersComponent} from './components/dashboard/customer/active-customers/active-customers.component';
import {InactiveCustomersComponent} from './components/dashboard/customer/inactive-customers/inactive-customers.component';
import {EditStoreComponent} from './components/dashboard/popups/edit-store/edit-store.component';
import {RiderListComponent} from './components/dashboard/rider/riders-dashboard/rider-list.component';
import {RiderTableComponent} from './components/dashboard/rider/rider-table/rider-table.component';
import {CreateRiderComponent} from './components/dashboard/popups/create-rider/create-rider.component';
import {EditRiderComponent} from './components/dashboard/popups/edit-rider/edit-rider.component';
import {RiderProfileComponent} from './components/dashboard/rider/profile/rider-profile.component';
import {RiderOrdersComponent} from './components/dashboard/rider-orders/rider-orders.component';
import {StoreReportsComponent} from './components/dashboard/storereports/storereports.component';
import {StoreOverViewComponent} from './components/dashboard/storeoverview/storeoverview.component';
import {PartnerOverViewComponent} from './components/dashboard/partneroverview/partneroverview.component';
import {PartnerReportsComponent} from './components/dashboard/partnerreports/partnerreports.component';


import {LoginService} from './services/login.service';
import {UserService} from './services/user.service';
import {OrderService} from './services/order.service';
import {AuthService} from './services/auth.service';
import {PartnerService} from './services/partner.service';
import {PermissionsService} from './services/permissions.service';
import {StoreService} from './services/store.service';
import {FileService} from './services/file.service';
import {ProductService} from './services/product.service';
import {CategoryService} from './services/category.service';
import {ParamService} from './services/param.service';
import {StoreReportService} from './services/storereport.service';
import {PartnerReportService} from './services/partnerreport.service';



import {CanActivateAuthguard} from './utility/can-activate.authguard';
import {FourZeroOneInterceptor} from './interceptors/FourZeroOneInterceptor';

import {APP_ROUTES, ROUTER_COMPONENTS, RESOLVERS} from './app.routes';
import {RiderService} from './services/rider.service';
import {AssignRiderComponent} from './components/dashboard/popups/assign-rider/assign-rider.component';

const ENTRY_COMPONENTS = [CreateUserComponent, EditUserComponent, PermissionSelectorComponent, CreatePartnerComponent, CreatePartneruserComponent
  , UpdatePasswordComponent, EditPartnerComponent,EditPartneruserComponent, DeactivatePartnerComponent, CreateStoreComponent, DeactivateUserComponent,
  CreateProductComponent,CreateProductuserComponent, EditProductComponent,EditProductuserComponent, AssignRiderComponent, EditStoreComponent, CreateRiderComponent, EditRiderComponent];

const COMPONENTS = [LoginComponent, HomeComponent, DashboardMainComponent, ActiveUsersTableComponent,
  StoresComponent, ProductsComponent, ProductsuserComponent,  InactiveUsersTableComponent,  ActiveCustomersComponent, InactiveCustomersComponent,
  RiderListComponent, RiderTableComponent, RiderProfileComponent, RiderOrdersComponent, StoreReportsComponent, StoreOverViewComponent, PartnerOverViewComponent, PartnerReportsComponent,
  ...ENTRY_COMPONENTS];

const SERVICES = [LoginService, UserService, OrderService, AuthService, PartnerService, PermissionsService, StoreService,
                  FileService, RiderService, ProductService, CategoryService, ParamService, StoreReportService, PartnerReportService];

const INTERCEPTORS = [{
  provide: HTTP_INTERCEPTORS,
  useClass: FourZeroOneInterceptor,
  multi: true,
}];

@NgModule({
  declarations: [
    AppComponent,
    ...ROUTER_COMPONENTS,
    ...COMPONENTS
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      APP_ROUTES,
      {enableTracing: false}
    ),
    NgxChartsModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot(),
    TabsModule.forRoot(),
    SelectModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DataTablesModule,
    NgxPermissionsModule.forRoot(),
    DialogModule,
    MapModule,
    FileUploadModule,
    KanbanModule
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
  ],
  entryComponents: ENTRY_COMPONENTS,
  providers: [ ...SERVICES, CanActivateAuthguard, ...RESOLVERS, ...INTERCEPTORS],
  bootstrap: [AppComponent]
})
export class AppModule { }
