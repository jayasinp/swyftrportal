import { Component, NgModule, Input, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PartnerType } from '../../../data/partner.type';
import { PartnerReportService } from '../../../services/partnerreport.service';
import { ReportType } from '../../../data/report.type';

@Component({
  selector: 'app-partner-overview',
  templateUrl: './partneroverview.component.html',
  styleUrls: ['./partneroverview.component.scss']
})

export class PartnerOverViewComponent implements OnInit {
  public partner: PartnerType;
  public fromDate: Date = new Date();
  public startDate: Date = new Date();
  public toDate: Date = new Date();
  public pieChartArr: Array<any>;
  public showChart: boolean = false;

  view: any[] = [700, 300];

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };


  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Product';
  showYAxisLabel = true;
  yAxisLabel = 'Quantity';


  constructor(
    private route: ActivatedRoute,
    private reportService: PartnerReportService
  ) {
    this.partner = this.route.snapshot.data['partner'];
    this.startDate.setDate(this.fromDate.getDate() - 30);
    this.startDate.setHours(0, 0, 0, 0);
    this.toDate.setHours(23, 59, 59, 999);
    this.reportService.getReportByPartnerId(this.partner.orgId, "ANY", this.startDate.getTime(), this.toDate.getTime()).then((orders) => {
      this.setDataList(orders);
    }).catch((err) => {
      console.log(err);
    });

  }

  setDataList(dataList: Array<ReportType>) {
    if(dataList.length > 0){
      this.showChart = true;
    }
    this.pieChartArr = dataList.map((data: ReportType) => {
      return { name: `${data.branchName}`, value: data.totalPrice };
    });
  }

  ngOnInit() {
  }


}