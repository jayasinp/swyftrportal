import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, Form } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/Subject';
//import { FileSelectDirective, FileUploader } from 'ng2-file-upload';


import { ProductService } from '../../../../services/product.service';
import { StoreType } from '../../../../data/store.type';
import { ProductType } from '../../../../data/product.type';
import { CategoryType } from '../../../../data/category.type';
import { prepareFileUploader} from '../../../../utility/constants';
import { CategoryService } from '../../../../services/category.service';

import { FileService } from './file.service';
import {saveAs} from 'file-saver';

import { HttpClient } from '@angular/common/http';


let _this;
const uri = 'http://52.220.138.167/file/upload123';

@Component({
  selector: 'app-create-productuser',
  templateUrl: './create-productuser.component.html',
  styleUrls: ['./create-productuser.component.scss'],
providers:[FileService]
})
export class CreateProductuserComponent implements OnInit {

//uploader:FileUploader = new FileUploader({url:uri});

  attachmentList:any = [];
images;
  multipleImages = [];
 



  currentStore: StoreType = new StoreType();
  public product: ProductType;
  public onClose: Subject<boolean>;
  createButtonClicked = false;
  public storeId;
  public branchName;
  public mainCategoryArr: Array<CategoryType>;
  public subCategoryArr: Array<CategoryType>;

  public branchNamesIds: Array<StoreType>;

  productName: FormControl;
  productCode: FormControl;
  quantity: FormControl;
  unitPrice: FormControl;
  maincategory: FormControl;
  categoryId: FormControl;
  tagCntrl: FormControl;

  mainstor: FormControl;

  mainCatArr: Array<any>;
  subCatArr: Array<any>;
  //fileUploader: FileUploader;
  currentFileItem;
  isAvailable: boolean;
  subCat: any;
  partnerTags: string;
  partnerTagArr: Array<any>;

  mainStorArr: Array<any>;

  //public branchNamesIds: Array<any>;


  constructor(
    private productService: ProductService,
    public activeModel: BsModalRef,
    private toasterService: ToastrService,
    private categoryService: CategoryService,
private _fileService:FileService,
private http: HttpClient
  ) {
    _this = this;
 
  }

  ngOnInit() {
    this.onClose = new Subject();
    this.product = new ProductType();
    this.branchName = this.branchName;
    this.isAvailable = false;


    this.productName = new FormControl('', [Validators.required]);
    this.productCode = new FormControl('', [Validators.required]);
    this.quantity = new FormControl('', [Validators.required]);
  //  this.unitPrice = new FormControl('', [Validators.required]);
	this.unitPrice = new FormControl('', [ Validators.required,Validators.pattern("^\\d{0,8}(\.\\d{1,4})?$")]);
    this.maincategory = new FormControl('', [Validators.required]);
    this.categoryId = new FormControl('', [Validators.required]);
    this.tagCntrl = new FormControl('', [Validators.required]);

    this.mainstor = new FormControl('', [Validators.required]);

    this.product.assetIds = [];
    this.setPartnerTagList(this.partnerTags.split(','));
    this.setMainCategoryList(this.mainCategoryArr);
   this.configureFileUploader();

    this.setBranchNamesIds(this.branchNamesIds);
  }

  

  dismiss() {
    this.onClose.next(false);
    this.activeModel.hide();
  }

  setMainCategoryList(mainCategoryList: Array<CategoryType>) {

    _this.mainCatArr = mainCategoryList.map((cat: CategoryType) => {
   
      return { text: `${cat.categoryName}`, id: cat.id };
    });
  }

  setBranchNamesIds(mainBranchList: Array<StoreType>) {
  
    _this.mainStorArr = mainBranchList.map((stor: StoreType) => {
     
      return { text: `${stor.branchName}`, id: stor.id };
    });
  }

  loadSubCategory(mainCatId) {
    this.subCat = null;
    this.categoryService.getAllSubCategories(mainCatId).then((categories) => {
      this.subCategoryArr = categories;
      this.setSubCategoryList(this.subCategoryArr);
    }).catch((err) => {
      console.log(err);
    });
  }

  setSubCategoryList(subCategoryList: Array<CategoryType>) {
    _this.subCatArr = subCategoryList.map((subcat: CategoryType) => {
      return { text: `${subcat.categoryName}`, id: subcat.id };
    });
  }

  onSelectCategory(subSorId) {
    this.product.categoryId = subSorId;
  }

  onSelectTag(tagId) {
    this.product.tags = tagId;
  }

  onSelectStor(storId) {
    this.product.branchId = storId;
  }



  createProduct() {
    if (this.isAvailable) {
      this.product.availability = 'IN';
    } else {
      this.product.availability = 'OUT';
    }

    if (this.productName.valid && this.productCode.valid && this.categoryId.valid && this.quantity.valid && this.unitPrice.valid && this.tagCntrl.valid) {
      this.createButtonClicked = true;
      this.productService.createProduct(this.product).then(() => {
        this.createButtonClicked = false;
        this.toasterService.success(`${this.product.productName} created successfully`, `Product Created For ${this.branchName}`);
        this.onClose.next(true);
        this.activeModel.hide();
      }).catch((err) => {
        this.createButtonClicked = false;
        this.toasterService.error(`Error creating product : ${err.message}`, 'Error creating product');
      });
    } else {
      return this.toasterService.error('One or more mandatory fields are missing', 'Invalid Store Details');
    }
  }



  configureFileUploader() {
  prepareFileUploader((item: any, response: any, status: any, headers: any) => {
      if (status === 200) {
       this.product.imageId = JSON.parse(response)['fileId'];
       this.product.assetIds.push(this.product.imageId);
    } else {
      console.log(`Got server HTTP Status: ${status}, message: ${response}`);
     }
   }, (item) => {
      this.currentFileItem = item;
    });
 }

  setPartnerTagList(partnerTagList: Array<string>) {
    this.partnerTagArr = partnerTagList.map((tag: string) => {
      return { text: `${tag}`, id: tag };
    });
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


    
      this.product.imageId = res.fileId;
      this.product.assetIds.push(this.product.imageId);
  console.log(this.product.imageId);
   
    },
   (err) => {
     console.log(err)
    }
 );


    }
  }








 
    
 




}
