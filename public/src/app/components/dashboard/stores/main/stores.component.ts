import {Component, Input, OnInit} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';

import {StoreType, OnlineStatusRequestType} from '../../../../data/store.type';
import {PartnerType} from '../../../../data/partner.type';
import {CreateStoreComponent} from '../../popups/create-store/create-store.component';

import {StoreService} from '../../../../services/store.service';
import {UserService} from '../../../../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';

import {EditStoreComponent} from '../../popups/edit-store/edit-store.component';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss']
})
export class StoresComponent implements OnInit {

  @Input('stores') stores: Array<StoreType>;
  @Input('partner') partner: PartnerType;

  constructor(
    private toastService: ToastrService,
    private modalService: BsModalService,
    private storeService: StoreService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
  }

  toggleStatus(store: StoreType) {

    store.onlineStatus = !store.onlineStatus;

    const statusRequest: OnlineStatusRequestType = new OnlineStatusRequestType();
    statusRequest.onlineStatus = store.onlineStatus;
    statusRequest.id = store.id;

    this.storeService.updateStoreOnlineStatus(statusRequest).then((isSuccess: boolean) => {
      isSuccess ? store.onlineStatus = store.onlineStatus : store.onlineStatus = !store.onlineStatus;
    }).catch((err) => {
      store.onlineStatus = !store.onlineStatus;
      console.log(JSON.stringify(err));
    });
  }

  onCreateStoreClicked(store) {
    this.userService.getAllUsersByStatusAndOrgId(true, this.partner.orgId).then((users) => {
      const config = {
        initialState: {
          employeeArr: users,
          orgId: this.partner.orgId,
          orgName: this.partner.name
        }
      };
      const createStoreModelRef = this.modalService.show(CreateStoreComponent, config);
      createStoreModelRef.content.onClose.subscribe((result) => {
        if (result) {
          this.reloadStores();
        }
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  reloadStores() {
    this.storeService.getStoresByPartnerId(this.partner.orgId).then((stores) => this.stores = stores).catch((err) => {
      console.log(err);
    });
  }

  viewStoreProfile(store) {
    store['orgName'] = this.partner.name;
    store['partnerTags'] = this.partner.tags;
    this.router.navigate(['/home/store-profile', store]);
  }

  openEditStore(store) {
    this.userService.getAllUsersByStatusAndOrgId(true, this.partner.orgId).then((users) => {
      const config = {
        initialState: {
          store: store,
          employeeArr: users
        }
      };

      const editStoreModelRef = this.modalService.show(EditStoreComponent, config);
      editStoreModelRef.content.onClose.subscribe((result) => {
        if (result) this.reloadStores();
      });
    }).catch((err) => {
      console.log(err);
    });
  }

}
