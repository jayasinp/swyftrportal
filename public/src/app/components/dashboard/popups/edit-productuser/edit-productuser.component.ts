import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subject } from 'rxjs/Subject';
import { ToastrService } from 'ngx-toastr';
//import { FileUploader } from 'ng2-file-upload';

import {FileService} from '../../../../services/file.service';
import {ProductService} from '../../../../services/product.service';
import {ProductType} from '../../../../data/product.type';

import {PARTNER_NAME_TO_TYPE, prepareFileUploader} from '../../../../utility/constants';

import { HttpClient } from '@angular/common/http';


//let _this;
const uri = 'http://52.220.138.167/file/upload123';

@Component({
  selector: 'app-edit-productuser',
  templateUrl: './edit-productuser.component.html',
  styleUrls: ['./edit-productuser.component.scss']
})
export class EditProductuserComponent implements OnInit{

  
  attachmentList:any = [];
images;
  multipleImages = [];
 
  editProduct: ProductType = new ProductType();
  updateButtonClicked = false;

  quantityCntrl: FormControl;
  unitPriceCntrl: FormControl;
  tagCntrl: FormControl;

  productImage;
  partnerTags: string;
  productTags: string;
  productImages:string;
  partnerTagArr: Array<any>;
  productTagArr: Array<any>;
  //fileUploader: FileUploader;

  public onClose: Subject<boolean>;
  currentFileItem;

  constructor(
    public activeModel: BsModalRef,
    private productService: ProductService,
    private toasterService: ToastrService,
    private fileService: FileService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.quantityCntrl = new FormControl('', [Validators.required]);
    this.unitPriceCntrl = new FormControl('', [Validators.required]);
    this.tagCntrl = new FormControl('', [Validators.required]);

    this.setPartnerTagList(this.partnerTags.split(','));
    this.setProductTagList(this.productTags.split(','));
   // this.configureFileUploader();
    this.onClose = new Subject();
  }

  dismiss() {
    this.activeModel.hide();
    this.onClose.next(false);
  }

  onUpdateUserClicked() {
    if (this.quantityCntrl.valid && this.unitPriceCntrl.valid && this.tagCntrl.valid) {
      this.updateButtonClicked = true;
 console.log(this.editProduct)
      this.productService.updateUserProduct(this.editProduct).then(() => {
        this.updateButtonClicked = false;
        this.toasterService.success(
          `${this.editProduct.productName} updated.`,
          'Product Updated Successfully'
        );
        this.activeModel.hide();
        this.onClose.next(true);
      }).catch((err) => {
        this.updateButtonClicked = false;
        this.toasterService.error(`Fail to update product due to ${err.message}`, 'Update Product Failed');
        console.log(err);
      });
    } else {
      this.toasterService.error('One or more required fields are invalid', 'Can not proceed');
    }
  }

  // configureFileUploader() {
  //   this.fileUploader = prepareFileUploader((item: any, response: any, status: any, headers: any) => {
  //     if (status === 200) {
  //       this.editProduct.imageId = JSON.parse(response)['fileId'];
  //       this.editProduct.assetIds.pop();
  //       this.editProduct.assetIds.push(this.editProduct.imageId);
  //     } else {
  //       console.log(`Got server HTTP Status: ${status}, message: ${response}`);
  //     }
  //   }, (item) => {
  //     this.currentFileItem = item;
  //   });
  // }

  setPartnerTagList(partnerTagList: Array<string>) {
    this.partnerTagArr = partnerTagList.map((tag: string) => {
      return { text: `${tag}`, id: tag };
    });
  }

  setProductTagList(productTagList: Array<string>) {
    this.productTagArr = productTagList.map((tag: string) => {
      return { text: `${tag}`, id: tag };
    });
  }

  onSelectTag(tagId) {
    this.editProduct.tags = tagId;
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


    
      this.editProduct.imageId = res.fileId;
      this.editProduct.assetIds.push(this.editProduct.imageId);
  console.log(this.editProduct.imageId);
   
    },
   (err) => {
     console.log(err)
    }
 );


    }
  }





}
