import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';

import { PartnerType } from '../../../../data/partner.type';
import { PartnerService } from '../../../../services/partner.service';
import { PARTNER_NAME_TO_TYPE } from '../../../../utility/constants';
import { CreatePartnerComponent } from '../../popups/create-partner/create-partner.component';
import { CreatePartneruserComponent } from '../../popups/create-partneruser/create-partneruser.component';

import { ToastrService } from 'ngx-toastr';
import { EditPartnerComponent } from '../../popups/edit-partner/edit-partner.component';
import { EditPartneruserComponent } from '../../popups/edit-partneruser/edit-partneruser.component';
import { DeactivatePartnerComponent } from '../../popups/deactivate-partner/deactivate-partner.component';
import { FileService } from '../../../../services/file.service';
import { ParamService } from '../../../../services/param.service';


@Component({
  selector: 'app-store-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.scss']
})
export class PartnersComponent implements OnInit {

  partnersArray: Array<PartnerType>;
  partnerLogos: any;

  constructor(
    private toastService: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private partnerService: PartnerService,
    private modalService: BsModalService,
    private fileService: FileService,
    private paramService: ParamService,
  ) { }

  ngOnInit(): void {
    this.partnersArray = this.route.snapshot.data['allPartners'];
    this.partnerLogos = {};
    this.loadPartnersLogos();
  }

  getPartnerType(partner: PartnerType) {
    return PARTNER_NAME_TO_TYPE[partner.orgType];
  }

  openCreatePartnerModel() {
    this.paramService.getCommonParams('TAGS').then((tags) => {
      const config = {
        initialState: {
          mainTags: tags
        }
      };
      const createPartnerModelRef = this.modalService.show(CreatePartneruserComponent, config);
      createPartnerModelRef.content.onClose.subscribe((result) => {
        if (result) {
          this.reloadPartnerTable(true);
        }
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  viewPartnerProfile(partner: PartnerType) {
    this.router.navigate(['/home/partner-profile', partner.orgId]);
  }

  openUpdatePartnerModel(partner) {
    this.paramService.getCommonParams('TAGS').then((tags) => {
      const config = {
        initialState: {
          mainTags: tags,
          partnerTags: partner.tags
        }
      };
      const updatePartnerModelRef = this.modalService.show(EditPartneruserComponent , config);
      updatePartnerModelRef.content.editPartner = partner;
      updatePartnerModelRef.content.onClose.subscribe((result) => {
        if (result) {
          this.reloadPartnerTable(true);
        }
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  reloadPartnerTable(status) {
    this.partnerService.getAllPartners(status).then((res: Array<PartnerType>) => {
      this.partnersArray = res;
      this.loadPartnersLogos();
    }).catch((err) => {
      console.log(err);
      this.toastService.error('Partner table reloead failed', 'Error Reloading Partner table');
    });
  }

  openDeactivatePartnerModel(partner) {
    const updatePartnerModelRef = this.modalService.show(DeactivatePartnerComponent);
    updatePartnerModelRef.content.editPartner = partner;
    updatePartnerModelRef.content.onClose.subscribe((result) => {
      if (result) {
        this.reloadPartnerTable(true);
      }
    });
  }

  loadPartnersLogos() {
    this.partnersArray.forEach((partner: PartnerType) => {
 //console.log("  this.partnersArray.forEach((partner: PartnerType) => {_+____________________________")
   //   console.log(partner)
      if (partner.logoId) {
        if (!this.partnerLogos[partner.orgId] ||
          (this.partnerLogos[partner.orgId] && this.partnerLogos[partner.orgId].logoId !== partner.logoId)) {
          this.fileService.downloadImageFromSystemByFileId(partner.logoId).then((image) => {
 console.log("  this.partnersArray.forEach((partner: PartnerType) => {_+____________________________")
      console.log(image)
            image.logoId = partner.logoId;
            this.partnerLogos[partner.orgId] = image;
          }).catch((err) => console.log(err));
        }
      }
    });
  }

}
