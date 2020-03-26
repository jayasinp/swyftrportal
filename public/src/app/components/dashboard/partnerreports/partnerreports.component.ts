import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormControl, Form } from '@angular/forms';


import { PartnerType } from '../../../data/partner.type';
import { ProductType } from '../../../data/product.type';
import { StoreService } from '../../../services/store.service';
import { PartnerReportService } from '../../../services/partnerreport.service';
import { ReportType } from '../../../data/report.type';
import { ParamService } from '../../../services/param.service';

@Component({
  selector: 'app-partner-reports',
  templateUrl: './partnerreports.component.html',
  styleUrls: ['./partnerreports.component.scss']
})

export class PartnerReportsComponent implements OnInit {

  @Input('partner') partner: PartnerType;
  @Input('reports') reports: Array<ReportType>;

  public dtOptions: DataTables.Settings = {searching: false};
  public rt = true;
  public searchClicked = false;
  public status  : string;
  public fromDate : Date = new Date();
  public toDate : Date = new Date();
  public productArr: Array<ProductType>;
  public maxDate = new Date();
  public statusArr: Array<any>;
  public selectStatus: Array<any>;
  public paymentpercentage  : any = 0;

  constructor(
    private reportService: PartnerReportService,
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
      this.reports =[];
      this.rt = true;
      this.search();
    } else {
      $("#srTab").removeClass("active");
      $("#prTab").addClass("active");
      this.reports =[];
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

  setDefaultStatus() {
    this.selectStatus =[{ text: `ANY`, id: 'ANY' }];
  }

  search() {
    this.status = this.selectStatus[0].id;
    this.fromDate.setHours(0,0,0,0);
    this.toDate.setHours(23,59,59,999);
    this.reportService.getReportByPartnerId(this.partner.orgId, this.status, this.fromDate.getTime(), this.toDate.getTime()).then((orders) => this.reports = orders).catch((err) => {
      console.log(err);
    });
  }

  getProfit(report: ReportType) {
    return (100-this.paymentpercentage) * report.totalPrice/100;
  }

}
