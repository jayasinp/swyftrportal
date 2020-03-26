import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { PartnerType } from '../../../../data/partner.type';
import { PartnerService } from '../../../../services/partner.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subject } from 'rxjs/Subject';
import { ToastrService } from 'ngx-toastr';
//import { FileUploader } from 'ng2-file-upload';

import { PARTNER_NAME_TO_TYPE, prepareFileUploader } from '../../../../utility/constants';

import { FileService } from './file.service';
import {saveAs} from 'file-saver';

import { HttpClient } from '@angular/common/http';

const uri = 'http://52.220.138.167/file/upload123';

@Component({
  selector: 'app-edit-partneruser',
  templateUrl: './edit-partneruser.component.html',
  styleUrls: ['./edit-partneruser.component.scss'],
  providers:[FileService]
})
export class EditPartneruserComponent implements OnInit {

  
  attachmentList:any = [];
  images;
  multipleImages = [];

  partnersArray: Array<PartnerType>;

  editPartner: PartnerType = new PartnerType();
  updateButtonClicked = false;
  nameCntrl: FormControl;
  addressCntrl: FormControl;
  contactNoCntrl: FormControl;
  pocNameCntrl: FormControl;
  pocMobileCntrl: FormControl;
  tagCntrl: FormControl;

  //fileUploader: FileUploader;
  currentFileItem;

  public onClose: Subject<boolean>;
  mainTags: string;
  partnerTags: string;
  mainTagArr: Array<any>;
  partnerTagArr: Array<any>;

  constructor(
    public activeModel: BsModalRef,
    private partnerService: PartnerService,
    private toasterService: ToastrService,
    private _fileService:FileService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.nameCntrl = new FormControl('', [Validators.required]);
    this.addressCntrl = new FormControl('', [Validators.required]);
    this.contactNoCntrl = new FormControl('', [Validators.required]);
    this.pocNameCntrl = new FormControl('', [Validators.required]);
    this.pocMobileCntrl = new FormControl('', [Validators.required]);
    this.tagCntrl = new FormControl('', [Validators.required]);
    this.onClose = new Subject();

    this.setMainTagList(this.mainTags.split(','));
    this.setPartnerTagList(this.partnerTags.split(','));
    this.configureFileUploader();
  }

  dismiss() {
    this.activeModel.hide();
    this.onClose.next(false);
  }

  onUpdatePartnerClicked() {
    this.editPartner.tags = this.tagsToString(this.partnerTagArr);
    if (this.nameCntrl.valid && this.addressCntrl.valid && this.contactNoCntrl.valid
      && this.pocNameCntrl.valid && this.pocMobileCntrl.valid) {
      this.updateButtonClicked = true;
      this.partnerService.updatePartner(this.editPartner).then(() => {
        this.updateButtonClicked = false;
        this.toasterService.success(
          `${this.editPartner.name} updated.`,
          'Partner Updated Successfully'
        );
        this.onClose.next(true);
        this.activeModel.hide();
      }).catch((err) => {
        this.updateButtonClicked = false;
        this.toasterService.error(`Fail to update partner due to ${err.message}`, 'Update Partner Failed');
        console.log(err);
      });
    } else {
      this.toasterService.error('One or more required fields are invalid', 'Can not proceed');
    }
  }

  getPartnerType(partner: PartnerType) {
    return PARTNER_NAME_TO_TYPE[partner.orgType];
  }

  // configureFileUploader() {
  //   this.fileUploader = prepareFileUploader((item: any, response: any, status: any, headers: any) => {
  //     if (status === 200) {
  //       this.editPartner.logoId = JSON.parse(response)['fileId'];
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
         this.editPartner.logoId = JSON.parse(response)['fileId'];
         //this.product.assetIds.push(this.product.imageId);
      } else {
        console.log(`Got server HTTP Status: ${status}, message: ${response}`);
       }
     }, (item) => {
        this.currentFileItem = item;
      });
   }

  setMainTagList(mainTagList: Array<string>) {
    this.mainTagArr = mainTagList.map((tag: string) => {
      return { text: `${tag}`, id: tag };
    });
  }

  setPartnerTagList(partnerTagList: Array<string>) {
    this.partnerTagArr = partnerTagList.map((tag: string) => {
      return { text: `${tag}`, id: tag };
    });
  }

  public refreshValue(value: any): void {
    this.partnerTagArr = value;
  }

  public tagsToString(value: Array<any> = []): string {
    return value.map((item: any) => {
      return item.text;
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
  
  
    
      this.editPartner.logoId = res.fileId;
    //  this.partnerOrg.assetIds.push(this.partnerOrg.logoId);
  console.log(this.editPartner.logoId);
   
    },
   (err) => {
     console.log(err)
    }
  );
  
  
    }
  }






}
