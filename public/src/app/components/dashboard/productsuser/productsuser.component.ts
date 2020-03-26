import { Component, Input, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { StoreType } from '../../../data/store.type';
import { ProductType, ProductTypeAvalab } from '../../../data/product.type';
import { CreateProductuserComponent } from '../popups/create-productuser/create-productuser.component';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { EditProductuserComponent} from '../popups/edit-productuser/edit-productuser.component';
import { FileService } from '../../../services/file.service';

@Component({
  selector: 'app-productsuser',
  templateUrl: './productsuser.component.html',
  styleUrls: ['./productsuser.component.scss']
})
export class ProductsuserComponent implements OnInit {

  @Input('products') products: Array<ProductType>;
  @Input('store') store: StoreType;

  isAvailable: boolean;

  constructor(
    private toastService: ToastrService,
    private modalService: BsModalService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private toasterService: ToastrService,
    private fileService: FileService
  ) { }

  ngOnInit() {
  }

  prepareAvailability( product: ProductTypeAvalab) {
    if (product.availability == "IN") {
      return true;
    } else {
      return false;
    }
  }

  onCreateProductClicked(store) {
    var storeIds = [];
    var branchNames = [];
    var branchNamesId = store;
      for(let i=0;i<store.length;i++){
        
          storeIds.push(store[i].id);
          branchNames.push(store[i].branchName);
          branchNamesId = store;
          console.log("       @@@@@@@@@@")
console.log(storeIds)
console.log(branchNames)
      }

    this.categoryService.getAllSubCategories(null).then((categories) => {
      const config = {
        initialState: {
          mainCategoryArr: categories,
          storeId: storeIds ,
          branchName:branchNames ,
          partnerTags: this.store.partnerTags,
          branchNamesIds:branchNamesId
        }
      };
      const createStoreModelRef = this.modalService.show(CreateProductuserComponent, config);
      createStoreModelRef.content.onClose.subscribe((result) => {
        if (result) {
          this.reloadProducts();
        }
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  //reloadProducts() {
  //  this.productService.getProductsByStoreId(this.store.id).then((products) => this.products = products).catch((err) => {
   //   console.log(err);
  //  });
  //}

reloadProducts() {
console.log("this.store");
console.log(this.store);
console.log(this.products );
console.log(this.store[0].managerId);

    this.productService.getProductsByUserStoreId(this.store[0].managerId).then((products) => this.products = products).catch((err) => {
      console.log(err);
    });
  }

  openUpdateProductModel(product) {
    const config = {
      initialState: {
        partnerTags: this.store.partnerTags,
        productTags: product.tags,
	productImages:product.assetIds[0].image 
      }
    };
 console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$product$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
    console.log(product)
 console.log(config)
    const updateUserModelRef = this.modalService.show(EditProductuserComponent, config);
    updateUserModelRef.content.editProduct = product;
    updateUserModelRef.content.onClose.subscribe((result) => {
      if (result) {
        this.reloadProducts();
      }
    });
  }

  updateAvailability(product: ProductType) {
    console.log("get updateAvailability product");
  console.log(product);
    if (product.availability == "OUT") {
      product.availability = "IN";
    } else {
      product.availability = "OUT";
    }

    let productAvalab: ProductTypeAvalab = {"availability":product.availability,"id": product.id,"productName":product.productName,"productCode" :product.productCode, "branchId":product.branchId, "categoryId":product.categoryId}
    //let productAvalab2: ProductTypeAvalab = {product.availability, product.id,product.productName,product.productCode}
    //const address: [number,string, string,string] = [product.id,product.productName,product.productCode ,product.availability]

    this.productService.updateProductAvailability(productAvalab).then(() => {
      this.toasterService.success(
        `${productAvalab.productName} updated.`,
        'Product Updated Successfully'
      );
      this.reloadProducts();
    }).catch((err) => {
      this.toasterService.error(`Fail to update product due to ${err.message}`, 'Update Product Failed');
      console.log(err);
    });
  }

}
