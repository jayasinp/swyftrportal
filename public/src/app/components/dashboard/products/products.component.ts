import { Component, Input, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { StoreType } from '../../../data/store.type';
import { ProductType, ProductTypeAvalab  } from '../../../data/product.type';
import { CreateProductComponent } from '../popups/create-product/create-product.component';
import { CreateProductuserComponent } from '../popups/create-productuser/create-productuser.component';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { EditProductComponent } from '../popups/edit-product/edit-product.component';
import { EditProductuserComponent} from '../popups/edit-productuser/edit-productuser.component';
import { FileService } from '../../../services/file.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

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

  public prepareAvailability(availability ) {
    if (availability == "IN") {
	
      return true;
    } else {


      return false;
    }
  }

  onCreateProductClicked() {
    this.categoryService.getAllSubCategories(null).then((categories) => {
      const config = {
        initialState: {
          mainCategoryArr: categories,
          storeId: this.store.id,
          branchName: this.store.branchName,
          partnerTags: this.store.partnerTags
        }
      };
      const createStoreModelRef = this.modalService.show(CreateProductComponent , config);
      createStoreModelRef.content.onClose.subscribe((result) => {
        if (result) {
          this.reloadProducts();
        }
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  reloadProducts() {
    this.productService.getProductsByStoreId(this.store.id).then((products) => this.products = products).catch((err) => {
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
	
console.log("this is my test"+product);
console.log(product);
console.log("this is my test id"+product.id);
    if (product.availability == "OUT") {
      product.availability = "IN";
    } else {
      product.availability = "OUT";
    }
let productAvalab: ProductTypeAvalab = {"availability":product.availability,"id": product.id,"productName":product.productName,"productCode" :product.productCode, "branchId":product.branchId, "categoryId":product.categoryId}
        console.log("this is my test"+productAvalab);
console.log(productAvalab);
console.log("this is my test id"+productAvalab.id);
    this.productService.updateProductAvailability(productAvalab).then(() => {
      this.toasterService.success(
        `${productAvalab.productName} updated.`,
        'Product Updated Successfully');


      this.reloadProducts();
    }).catch((err) => {
      this.toasterService.error(`Fail to update product due to ${err.message}`, 'Update Product Failed');

      console.log(err);
    });
  }


}
