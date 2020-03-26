import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getEndpoint, prepareHeaders} from '../utility/constants';
import {reject} from 'q';
import {ProductType, ProductTypeAvalab } from '../data/product.type';

@Injectable()
export class ProductService {

  constructor(
    private http: HttpClient
  ) {
    this._prepare();
  }
  endpointUrl: String;
  endpointUrl1: String;
  endpointUrl2: String;

  _prepare() {
    this.endpointUrl = `${getEndpoint(true)}/product`;
    this.endpointUrl1 = `${getEndpoint(true)}/store`;
    this.endpointUrl2 = `${getEndpoint(true)}/product/availab`;
  }

  getProductsByStoreId(storeid : number): Promise<Array<ProductType>> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl1}/allProducts/${storeid}`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.get(url, options).subscribe(
        (response) => {
          return resolve(response['products']);
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }

getProductsByUserStoreId(storeIds: number): Promise<Array<ProductType>> {
    return new Promise((resolve, reject) => {
  console.log("storeIds by Damith")
  console.log(storeIds)
      const url = `${this.endpointUrl1}/allUserProducts/${storeIds}`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.get(url, options).subscribe(
        (response) => {
          return resolve(response['products']);
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }


  createProduct(product: ProductType): Promise<number> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.post(url, product, options).subscribe(
        (response) => {
          return resolve(response['productId']);
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }




uploadImage(image: any):any{
    //return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/image`;
  console.log(url)
     // const options = prepareHeaders();
      // if (!options) {
      //   return reject(new Error('Empty options object'));
      // }
      this.http.post(url, image).subscribe(
        (res) => console.log(res),
      (err) => console.log(err)
      );
    //});
  }





  updateProduct(product: ProductType): Promise<number> {
console.log("222222222222222222222222222222222@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

	console.log(product)
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.post(url, product, options).subscribe(
        (response) => {
          return resolve(response['productId']);
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }

 updateUserProduct(product: ProductType): Promise<number> {
console.log("222222222222222222222222222222222@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

	console.log(product)
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/upPro`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.post(url, product, options).subscribe(
        (response) => {
          return resolve(response['productId']);
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }


updateProductAvailability(productAvalab: ProductTypeAvalab ): Promise<number> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl2}/`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.post(url, productAvalab, options).subscribe(
        (response) => {
          return resolve(response['productId']);
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }

}