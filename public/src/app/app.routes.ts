import {Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import {HomeComponent} from './components/home/home.component';
import {UsersDashboardComponent} from './components/dashboard/users/main/users-dashboard.component';
import {GadgetComponent} from './components/dashboard/gadgets/gadget.component';
import {ProfileComponent} from './components/dashboard/profile/profile.component';
import {LoginComponent} from './components/login/login.component';
import {PartnersComponent} from './components/dashboard/partners/main/partners.component';
import {OrdersComponent} from './components/dashboard/orders/orders.component';
import {PartnerProfileComponent} from './components/dashboard/partners/partner-profile/partner-profile.component';
import {EmailStepComponent} from './components/forgot-password/email-step/email-step.component';
import {TokenStepComponent} from './components/forgot-password/token-step/token-step.component';
import {StoreProfileComponent} from './components/dashboard/stores/store-profile/store-profile.component';
import {CustomerDashboardComponent} from './components/dashboard/customer/main/customer-dashboard.component';
import {CustomerProfileComponent} from './components/dashboard/customer/profile/customer-profile.component';
import {RidersComponent} from './components/dashboard/rider/main/riders.component';
import {RiderProfileComponent} from './components/dashboard/rider/profile/rider-profile.component';
import {RiderOrdersComponent} from './components/dashboard/rider-orders/rider-orders.component';
import {RiderMapComponent} from './components/dashboard/rider-map/rider-map.component';
import {ProductDashboardComponent} from './components/dashboard/product-dashboard/product-dashboard.component'

import {GetAllUserResolver} from './resolvers/all-user.resolver';
import {GetAllActivePartnersResolver} from './resolvers/all-partners.resolver';
import {GetAllOrdersResolver} from './resolvers/all-orders.resolver';
import {GetAllStoresOfAPartnerResolver} from './resolvers/all-stores-for-partner.resolver';
import {GetAllStoresOfAUserResolver} from './resolvers/all-stores-for-user.resolver';
import {GetActiveUserResolver} from './resolvers/active-users.resolver';
import {GetInactiveUserResolver} from './resolvers/inactive-users.resolver';
import {GetAllProductsOfAStore} from './resolvers/all-products-for-store.resolver';
import {GetAllProductsOfAStoreUser} from './resolvers/all-products-for-store-user.resolver';
import {GetActiveCustomersResolver} from './resolvers/active-customers.resolver';
import {GetInactiveCustomerResolver} from './resolvers/inactive-customer.resolver';
import {CustomerByIdResolver} from './resolvers/customer-by-id.resolver';
import {PartnerByIdResolver} from './resolvers/partner-by-id.resolver';
import {GetAllRidersForAPartnerResolver} from './resolvers/all-riders-for-partner.resolver';
import {GetAllStoresByUserResolver} from './resolvers/all-stores-by-user.resolver';

import {CanActivateAuthguard} from './utility/can-activate.authguard';
import {AllRiderLocationsResolver} from './resolvers/all-rider-locations.resolver';
import {AllRiderPartnerOrdersResolver} from './resolvers/all-rider-partner-orders.resolver';
import {RiderUnassignedOrderResolver} from './resolvers/rider-unassigned-order.resolver';
import {GetStoreByUserIdResolver} from './resolvers/get-store-by-user-id.resolver';

export const ROUTER_COMPONENTS = [HomeComponent, UsersDashboardComponent, GadgetComponent, ProfileComponent,
  PartnersComponent, PartnerProfileComponent, EmailStepComponent, TokenStepComponent, OrdersComponent, StoreProfileComponent,
  CustomerDashboardComponent, CustomerProfileComponent, RidersComponent, RiderMapComponent, ProductDashboardComponent];

export const RESOLVERS = [GetAllUserResolver, GetAllActivePartnersResolver, GetAllOrdersResolver, GetAllStoresOfAPartnerResolver,
  GetAllProductsOfAStore, GetActiveUserResolver, GetInactiveUserResolver, GetAllStoresByUserResolver,  GetActiveCustomersResolver,
  GetInactiveCustomerResolver, CustomerByIdResolver, AllRiderLocationsResolver, AllRiderPartnerOrdersResolver, PartnerByIdResolver,
  RiderUnassignedOrderResolver, GetAllRidersForAPartnerResolver, GetStoreByUserIdResolver, GetAllStoresOfAUserResolver, GetAllProductsOfAStoreUser];

export const APP_ROUTES: Routes = [
  { path: 'reset-password', component: TokenStepComponent },
  { path: 'fp-email', component: EmailStepComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [CanActivateAuthguard], children: [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'manage-users', component: UsersDashboardComponent, resolve: {
      activeUsers: GetActiveUserResolver,
      inativeUsers: GetInactiveUserResolver,
      storesOfMyOrg: GetAllStoresByUserResolver
    }},
    { path: 'manage-partners', component: PartnersComponent, resolve: {
        allPartners: GetAllActivePartnersResolver
      }
    },
    { path: 'manage-riders', component: RidersComponent, resolve: {
      riders: GetAllRidersForAPartnerResolver
    }},
    { path: 'manage-orders  ', component: OrdersComponent, resolve: {
        allOrders: GetAllOrdersResolver
      }
    },
    { path: 'manage-customers', component: CustomerDashboardComponent, resolve: {
        activeCustomers: GetActiveCustomersResolver,
        inactiveCustomers: GetInactiveCustomerResolver
      }
    },
    { path: 'dashboard', component: GadgetComponent},
    { path: 'customer-profile/:id', component: CustomerProfileComponent, resolve: {
        customer: CustomerByIdResolver
      }
    },
    { path: 'profile', component: ProfileComponent },
    { path: 'partner-profile/:id', component: PartnerProfileComponent, resolve: {
      partner: PartnerByIdResolver,
      stores: GetAllStoresOfAPartnerResolver,
      riders: GetAllRidersForAPartnerResolver
    }},
    { path: 'store-profile', component: StoreProfileComponent, resolve: {
      products: GetAllProductsOfAStore
    }},
    {
      path: 'rider-profile', component: RiderProfileComponent
    },
    {
      path: 'rider-orders', component: RiderOrdersComponent, resolve: {
        riderOrders: AllRiderPartnerOrdersResolver,
        riderUnassignedOrders: RiderUnassignedOrderResolver
      }
    },
    {
      path: 'rider-map', component: RiderMapComponent, resolve: {
        riderLocations: AllRiderLocationsResolver
      }
    },
    {
      path: 'unassigned-orders', component: OrdersComponent, resolve: {
        riderUnassignedOrders: RiderUnassignedOrderResolver
      }
    },
    {
      path: 'manage-product:id', component: ProductDashboardComponent, resolve: {
        store: GetAllStoresOfAUserResolver,
	// store: GetAllStoresOfAPartnerResolver,
	//store:GetAllStoresByUserResolver,
        //products: GetAllProductsOfAStore
	products: GetAllProductsOfAStoreUser
      }
    }
  ]},
  { path: '', redirectTo: 'login', pathMatch: 'full'}
];
