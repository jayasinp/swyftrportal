import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {ProductType} from '../data/product.type';
import {ProductService} from '../services/product.service';

@Injectable()
export class GetAllProductsOfAStore implements Resolve<Array<ProductType>> {

  constructor(
    private productService: ProductService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Promise<Array<ProductType>> {
    const storeId = route.params['id'];
 console.log("route.params['id']")

 console.log(route.params['id'])
console.log("this.productService.getProductsByStoreId(storeId)")

 console.log(this.productService.getProductsByStoreId(storeId))
    return this.productService.getProductsByStoreId(storeId);
  }

}