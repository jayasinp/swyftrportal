import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap';

import { StoreType } from '../../../../data/store.type';
import { ProductType } from '../../../../data/product.type';
import { ProductService } from '../../../../services/product.service';
import { StoreReportService } from '../../../../services/storereport.service';
import { ReportType } from '../../../../data/report.type';
import { ParamService } from '../../../../services/param.service';

declare var $: JQueryStatic;

@Component({
  selector: 'app-partner-profile',
  templateUrl: './store-profile.component.html',
  styleUrls: ['./store-profile.component.scss']
})
export class StoreProfileComponent implements OnInit, AfterViewInit {

  @ViewChild('storeTabs') storeTabs: TabsetComponent;

  store: StoreType;
  products: Array<ProductType>;
  locations: Array<Array<number>> = [];
  fromDate: Date = new Date();
  startDate: Date = new Date();
  toDate: Date = new Date();
  reports: Array<ReportType>;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private reportService: StoreReportService,
    private paramService: ParamService
  ) { }

  ngOnInit() {
    this.store = this.route.snapshot.params;
    this.products = this.route.snapshot.data['products'];
    this.locations.push([this.store.latitude, this.store.longitude]);
  }

  ngAfterViewInit() {
    $('.tab-container ul').css('display', 'none');
  }

  selectTab(tabIndex) {
    this.storeTabs.tabs[tabIndex].active = true;

    if (tabIndex === 0) {
     
    } else if (tabIndex === 1) {
      this.productService.getProductsByStoreId(this.store.id).then((products) => this.products = products).catch((err) => {
        console.log(err);
      });
    } else if (tabIndex === 2) {
      this.fromDate.setHours(0, 0, 0, 0);
      this.toDate.setHours(23, 59, 59, 999);
      this.reportService.getReportByStoreId(this.store.id, "ANY", this.fromDate.getTime(), this.toDate.getTime()).then((orders) => this.reports = orders).catch((err) => {
        console.log(err);
      });
    }

  }

}
