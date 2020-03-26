import {Component, OnInit} from '@angular/core';
import {Validators, FormControl} from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';
import {Subject} from 'rxjs/Subject';
//import { FileUploader } from 'ng2-file-upload';

import {PartnerType} from '../../../../data/partner.type';
import {PartnerService} from '../../../../services/partner.service';
import {PARTNER_TYPES, PARTNER_NAME_TO_TYPE, PREFERED_PAYMENT_TYPES, prepareFileUploader} from '../../../../utility/constants';

import { FileService } from './file.service';
import {saveAs} from 'file-saver';

import { HttpClient } from '@angular/common/http';

const uri = 'http://52.220.138.167/file/upload123';

@Component({
  selector: 'app-create-partneruser',
  templateUrl: './create-partneruser.component.html',
  styleUrls: ['./create-partneruser.component.scss'],
	providers:[FileService]
})
export class CreatePartneruserComponent implements OnInit {

  
  attachmentList:any = [];
  images;
  multipleImages = [];
 

  public onClose: Subject<boolean>;
  public mainTags: string;
  mainTagArr: Array<any>;
  partnerTagArr: Array<any>;

  orgNameCntrl: FormControl;
  headOfficeAddressCntrl: FormControl;
  headOfficeContactNoCntrl: FormControl;
  pointOcContactNameCntrl: FormControl;
  pointOcContactNoCntrl: FormControl;
  tagCntrl: FormControl;

  partnerOrg: PartnerType = new PartnerType();
  partnerTypeArr = PARTNER_TYPES;
  paymentMethodArr = PREFERED_PAYMENT_TYPES;
  createButtonClicked = false;

  //fileUploader: FileUploader;
  currentFileItem;

  constructor(
    private partnerService: PartnerService,
    public activeModel: BsModalRef,
    private toasterService: ToastrService,
    private _fileService:FileService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.onClose = new Subject();
    this.partnerOrg = new PartnerType();

    this.orgNameCntrl = new FormControl('', [Validators.required]);
    this.headOfficeAddressCntrl = new FormControl('', [Validators.required]);
    this.headOfficeContactNoCntrl = new FormControl('', [Validators.required]);
    this.pointOcContactNameCntrl = new FormControl('', [Validators.required]);
    this.pointOcContactNoCntrl = new FormControl('', [Validators.required]);
    this.tagCntrl = new FormControl('', [Validators.required]);

    this.mainTagArr  = this.mainTags.split(',');
    this.configureFileUploader();
  }

  dismiss() {
    this.onClose.next(false);
    this.activeModel.hide();
  }

  onPartnerTypeChanged(partnerType) {
    this.partnerOrg.orgType = partnerType.type;
  }

  onPaymentMethodSelected(type) {
    this.partnerOrg.preferedPaymentMethod = type;
  }

  getPartnerName(type) {
    return PARTNER_NAME_TO_TYPE[type];
  }

  createPartner() {
    if (Object.keys(PARTNER_NAME_TO_TYPE).indexOf(this.partnerOrg.orgType) === -1) {
      return this.toasterService.error('A partner should belong to an organization type', 'Invalid Partner Type');
    }

    if (this.orgNameCntrl.valid && this.headOfficeAddressCntrl.valid && this.headOfficeContactNoCntrl.valid
          && this.pointOcContactNameCntrl.valid && this.pointOcContactNoCntrl.valid && this.tagCntrl.valid) {

      if (this.partnerOrg.preferedPaymentMethod === 'online_transfers') {
        if (!this.partnerOrg.bank || !this.partnerOrg.bankSwiftCode || !this.partnerOrg.branch ||
              !this.partnerOrg.branchCode || !this.partnerOrg.accountNo) {
          return this.toasterService.error('One or more mandatory fields for online transfer payment method is missing',
            'Invalid Payment Details');
        }
      }

      if (!this.partnerOrg.logoId) {
        return this.toasterService.error('Please upload partner logo.', 'Empty Partner Logo');
      }

      this.partnerOrg.tags = this.tagsToString(this.partnerTagArr);
      this.createButtonClicked = true;
      return this.partnerService.createPartner(this.partnerOrg).then((orgId) => {
        this.createButtonClicked = false;
        this.toasterService.success(`${this.partnerOrg.name} created in system`, 'Partner Creation Successful');
        this.onClose.next(true);
        this.dismiss();
      }).catch((err) => {
        this.createButtonClicked = false;
        console.log(err);
        return this.toasterService.error(`Error creating partner ${err.message}`, 'Error');
      });
    } else {
      return this.toasterService.error('One or more required field are missing', 'Can not submit');
    }
  }

  // configureFileUploader() {
  //   this.fileUploader = prepareFileUploader((item: any, response: any, status: any, headers: any) => {
  //     if (status === 200) {
  //       this.partnerOrg.logoId = JSON.parse(response)['fileId'];
  //     } else {
  //       console.log(`Got server HTTP Status: ${status}, message: ${response}`);
  //     }
  //   }, (item) => {
  //     this.currentFileItem = item;
  //   });
  // }

  configureFileUploader() {
    prepareFileUploader((item: any, response: any, status: any, headers: any) => {
        if (status === 200) {
         this.partnerOrg.logoId = JSON.parse(response)['fileId'];
         //this.product.assetIds.push(this.product.imageId);
      } else {
        console.log(`Got server HTTP Status: ${status}, message: ${response}`);
       }
     }, (item) => {
        this.currentFileItem = item;
      });
   }

  public refreshValue(value:any):void {
    this.partnerTagArr = value;
  }

  public tagsToString(value:Array<any> = []):string {
    return value.map((tag:any) => {
        return tag.text;
      }).join(',');
  }



  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
  
      this.images = file;
  
  const formData = new FormData();
  formData.append('xxx', this.images);
  
  this.http.post<any>('http://52.220.138.167/file/file', formData).subscribe(
   (res) =>{
    console.log(res)
  
  
    
      this.partnerOrg.logoId = res.fileId;
    //  this.partnerOrg.assetIds.push(this.partnerOrg.logoId);
  console.log(this.partnerOrg.logoId);
   
    },
   (err) => {
     console.log(err)
    }
  );
  
  
    }
  }

}
