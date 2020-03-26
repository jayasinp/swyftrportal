import {Component, OnInit} from '@angular/core';
import {Validators, FormControl} from '@angular/forms';
import {PartnerType} from '../../../../data/partner.type';
import {PartnerService} from '../../../../services/partner.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {Subject} from 'rxjs/Subject';
import { ToastrService } from 'ngx-toastr';

import {PARTNER_NAME_TO_TYPE} from '../../../../utility/constants';

@Component({
  selector: 'app-deactivate-partner',
  templateUrl: './deactivate-partner.component.html',
  styleUrls: ['./deactivate-partner.component.scss']
})
export class DeactivatePartnerComponent implements OnInit{

  partnersArray: Array<PartnerType>;

  editPartner: PartnerType = new PartnerType();
  deactivateButtonClicked = false;
  nameCntrl: FormControl;
  idCntrl: FormControl;

  public onClose: Subject<boolean>;

  constructor(
    public activeModel: BsModalRef,
    private partnerService: PartnerService,
    private toasterService: ToastrService
  ) {}

  ngOnInit(): void {
    this.nameCntrl = new FormControl('', [Validators.required]);
    this.idCntrl = new FormControl('', [Validators.required]);
    this.onClose = new Subject();
  }

  dismiss() {
    this.activeModel.hide();
    this.onClose.next(false);
  }

  onDeactivatePartnerClicked() {
    this.deactivateButtonClicked = true;
    this.partnerService.changePartnerStatus(this.editPartner, false).then(() => {
      this.deactivateButtonClicked = false;
      this.toasterService.success(
        `${this.editPartner.name} deactivated.`,
        'Partner Deactivated Successfully'
      );
      this.activeModel.hide();
      this.onClose.next(true);
    }).catch((err) => {
      this.deactivateButtonClicked = false;
      this.toasterService.error(`Fail to deactivate partner due to ${err.message}`, 'Deactivate Partner Failed');
      console.log(err);
    });
  }

}
