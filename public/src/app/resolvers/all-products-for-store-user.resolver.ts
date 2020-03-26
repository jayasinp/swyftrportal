import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, ActivatedRoute} from '@angular/router';
import {ProductType} from '../data/product.type';
import {StoreType} from '../data/store.type';
import {ProductService} from '../services/product.service';
import {StoreService} from '../services/store.service';
import { GetAllStoresOfAUserResolver } from './all-stores-for-user.resolver';

@Injectable()
export class GetAllProductsOfAStoreUser implements Resolve<void |Array<ProductType>> {

    store: StoreType;
    prodcutArr: Array<ProductType> = [];
   // org: PartnerType;
   orgStore:Promise<Array<StoreType>>;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private storeService:StoreService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Promise<void |Array<ProductType>> {
    const storeId = route.params['id'];
    const userId = route.params['id'];
    
  //  function doAsyncTasks(storeService:StoreService) {
  //    var promise =new Promise<Array<StoreType>>(async (resolve, reject) => {
  //     var orgStore  =storeService.getStoresByUserId(userId);
  //     if ((await orgStore).length > 0){
 //       resolve(orgStore);
  //     }else{
  //      reject("errorrrrr");
  //     }
   //   });
    //  return promise;
   // }
   // var x =  doAsyncTasks(this.storeService).then((val)=>{
 //console.log(val);

//var storeIds = [];
    //  for(let i=0;i<val.length;i++){
        
       //   storeIds.push(val[i].id);
      //}
//console.log("storeIds ");

//console.log(storeIds );

// storeIds = "("+storeIds+")";
//console.log("this.productService.getProductsByUserStoreId(storeIds)");
//console.log(this.productService.getProductsByUserStoreId(storeIds));


//return this.productService.getProductsByUserStoreId(storeIds);


   // },(err) => {console.error(err)});
//console.log("storeIds is in outside xxx");
console.log("this.productService.getProductsByUserStoreId(userId )");  
console.log(this.productService.getProductsByUserStoreId(userId ));  
return this.productService.getProductsByUserStoreId(userId );

  //var storeIdss =16;
  // return x;
 //return this.productService.getProductsByStoreId(storeIdss);
  }







}