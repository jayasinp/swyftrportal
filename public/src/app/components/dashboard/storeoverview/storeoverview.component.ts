import { Component, NgModule, Input, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { StoreType } from '../../../data/store.type';
import { ReportType } from '../../../data/report.type';
import { StoreReportService } from '../../../services/storereport.service';

@Component({
  selector: 'app-products-overview',
  templateUrl: './storeoverview.component.html',
  styleUrls: ['./storeoverview.component.scss']
})

export class StoreOverViewComponent implements OnInit {

  public fromDate: Date = new Date();
  public startDate: Date = new Date();
  public toDate: Date = new Date();
  public store: StoreType;
  public pieChartArr: Array<any>;
  public barChartArr: Array<any>;
  public showChart: boolean = false;

  viewpie: any[] = [500, 200];
  viewbar: any[] = [600, 300];
  label: string = "Total Amount";

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
    private reportService: StoreReportService
  ) {
    this.store = this.route.snapshot.params;
    this.startDate.setDate(this.fromDate.getDate() - 30);
    this.startDate.setHours(0, 0, 0, 0);
    this.toDate.setHours(23, 59, 59, 999);
    this.reportService.getReportByStoreId(this.store.id, "ANY", this.startDate.getTime(), this.toDate.getTime()).then((orders) => {
      this.setDataList(orders);
    }).catch((err) => {
      console.log(err);
    });
  }

  setDataList(dataList: Array<ReportType>) {
    if(dataList.length > 0){
      this.showChart = true;
    }

    if(dataList.length == 1) {
      this.viewbar = [100, 300];
    }
    if(dataList.length == 2) {
      this.viewbar = [250, 300];
    }
    if(dataList.length == 3) {
      this.viewbar = [400, 300];
    }
    if(dataList.length == 4) {
      this.viewbar = [450, 300];
    }
    if(dataList.length > 4) {
      this.viewbar = [600, 300];
    }
    this.pieChartArr = dataList.map((data: ReportType) => {
      return { name: `${data.productName}`, value: data.totalPrice };
    });
    this.barChartArr = dataList.map((data: ReportType) => {
      return { name: `${data.productName}`, value: `${data.total}` };
    });
  }

  ngOnInit() {
  }


}