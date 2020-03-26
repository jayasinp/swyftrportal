import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PartnerType} from '../../../../data/partner.type';
import {PREFERED_PAYMENT_TYPES, PARTNER_NAME_TO_TYPE} from '../../../../utility/constants';
import {TabsetComponent} from 'ngx-bootstrap';
import {StoreType} from '../../../../data/store.type';
import {FileService} from '../../../../services/file.service';
import {SysUserType} from '../../../../data/user.type';
import {ReportType} from '../../../../data/report.type';
import {PartnerReportService} from '../../../../services/partnerreport.service';


declare var $: JQueryStatic;

@Component({
  selector: 'app-partner-profile',
  templateUrl: './partner-profile.component.html',
  styleUrls: ['./partner-profile.component.scss']
})
export class PartnerProfileComponent implements OnInit, AfterViewInit {

  @ViewChild('partnerTabs') partnerTabs: TabsetComponent;

  partner: PartnerType;
  stores: Array<StoreType>;
  riders: Array<SysUserType>
  partnerLogo;
  fromDate: Date = new Date();
  startDate: Date = new Date();
  toDate: Date = new Date();
  reports: Array<ReportType>;

  constructor(
    private route: ActivatedRoute,
    private fileService: FileService,
    private reportService: PartnerReportService
  ) {}

  ngOnInit() {
    this.partner = this.route.snapshot.data['partner'];
    this.stores = this.route.snapshot.data['stores'];
    this.riders = this.route.snapshot.data['riders'];
    console.log(this.riders)
    this.downloadPartnerLogo();
  }

  ngAfterViewInit() {
    $('.tab-container ul').css('display', 'none');
  }

  getPreferedPaymentMethodText(type) {
    let preferedPaymentMethodName;
    PREFERED_PAYMENT_TYPES.forEach((p) => {
      if (p.id === type) preferedPaymentMethodName = p.text;
    });
    return preferedPaymentMethodName;
  }

  getPartnerType(partner: PartnerType) {
    return PARTNER_NAME_TO_TYPE[partner.orgType];
  }

  downloadPartnerLogo() {
    if (this.partner.logoId) {
      this.fileService.downloadImageFromSystemByFileId(this.partner.logoId).then((image) => {
        this.partnerLogo = image;
      }).catch((err) => console.log(err));
    }
  }

  selectTab(tabIndex) {
    this.partnerTabs.tabs[tabIndex].active = true;

    if (tabIndex === 0) {
     
    } else if (tabIndex === 1) {
      
    } else if (tabIndex === 2) {
      this.fromDate.setHours(0, 0, 0, 0);
      this.toDate.setHours(23, 59, 59, 999);
      this.reportService.getReportByPartnerId(this.partner.orgId, "ANY", this.fromDate.getTime(), this.toDate.getTime()).then((orders) => this.reports = orders).catch((err) => {
        console.log(err);
      });
    }

  }

}
