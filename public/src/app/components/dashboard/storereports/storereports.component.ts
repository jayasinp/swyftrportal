import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


import { StoreType } from '../../../data/store.type';
import { ProductType } from '../../../data/product.type';
import { StoreService } from '../../../services/store.service';
import { StoreReportService } from '../../../services/storereport.service';
import { ReportType } from '../../../data/report.type';
import { ParamService } from '../../../services/param.service';

@Component({
  selector: 'app-reports',
  templateUrl: './storereports.component.html',
  styleUrls: ['./storereports.component.scss']
})

export class StoreReportsComponent implements OnInit {

  @Input('store') store: StoreType;
  @Input('reports') reports: Array<ReportType>;

  public dtOptions: DataTables.Settings = {searching: false};
  public rt = true;
  public searchClicked = false;
  public fromDate : Date = new Date();
  public toDate : Date = new Date();
  public productArr: Array<ProductType>;
  public maxDate = new Date();
  public statusArr: Array<any>;
  public selectStatus: Array<any>;
  public status  : string;
  public paymentpercentage  : any = 0;

  constructor(
    private toastService: ToastrService,
    private storeService: StoreService,
    private reportService: StoreReportService,
    private paramService: ParamService
  ) {}

  ngOnInit(){
    this.paramService.getCommonParams('ORDER_STATUS').then((tags) => {
      this.setStatusList(tags.split(','));
    }).catch((err) => {
      console.log(err);
    });
    this.setDefaultStatus();
  }

  setDefaultStatus() {
    this.selectStatus =[{ text: `ANY`, id: 'ANY' }];
  }

  setStatusList(statusList: Array<string>) {
    this.statusArr = statusList.map((tag: string) => {
      return { text: `${tag}`, id: tag };
    });
  }

  change(index: number): void {
    this.reset();
    if (index == 0) {
      $("#prTab").removeClass("active");
      $("#srTab").addClass("active");
      this.rt = true;
      this.search();
    } else {
      $("#srTab").removeClass("active");
      $("#prTab").addClass("active");
      this.rt = false;
      this.search();
    }
  }

  reset() {
    this.fromDate = new Date();
    this.toDate = new Date();
    this.setDefaultStatus();
    this.search();
  }

  search() {
    this.status = this.selectStatus[0].id;
    this.fromDate.setHours(0,0,0,0);
    this.toDate.setHours(23,59,59,999);
    this.reportService.getReportByStoreId(this.store.id,  this.status, this.fromDate.getTime(), this.toDate.getTime()).then((orders) => this.reports = orders).catch((err) => {
      console.log(err);
    });
  }

  getProfit(report: ReportType) {
    return (100-this.paymentpercentage) * report.totalPrice/100;
  }


}
