import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {StoreType} from '../../../data/store.type';
import {ProductType} from '../../../data/product.type';
import {AuthService} from '../../../services/auth.service';
import {PartnerType} from '../../../data/partner.type';

@Component({
  selector: 'app-manage-product',
  templateUrl: './product-dashboard.component.html'
})
export class ProductDashboardComponent implements OnInit {
  	store: StoreType;
	prodcutArr: Array<ProductType> = [];
  org: PartnerType;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.store = this.route.snapshot.data['store'];
    this.prodcutArr = this.route.snapshot.data['products'];

    this.org = this.authService.getOrganizationOfAuthorizedUser();

    this.store['partnerTags'] = this.org.tags;

  //this.store['partnerTags'] = this.org.orgId;
    console.log("get local storage by Damith store +this.store " )

    console.log(this.store)
    console.log(this.store.id)
    console.log("get local storage by Damith store +this.prodcutArr " )
    console.log(this.prodcutArr)
    console.log("get local storage by Damith store +this.org " )
    console.log(this.org) 
console.log("get local storage by Damith store +this.store" )
    console.log(this.store) 


 }


}

