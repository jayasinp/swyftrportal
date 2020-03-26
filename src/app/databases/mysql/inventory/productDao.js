import * as query from './product.query';
import executor from '../executor';

/**
 * Product Dao
 */
export default class ProductDao {

  static createProduct(product) {
    const {productName, productCode, quantity, unitPrice, branchId,
      categoryId, description, discount,sftrDiscount, availability, specialNote, tags} = product;
    const updatedDate = Date.now();

    const args = [productName, productCode, quantity, unitPrice, branchId, 
      updatedDate, categoryId, description, discount,sftrDiscount, availability, specialNote, tags];
console.log("Args update ProductDuo By Damith"+args);
console.log(args);

    return executor.execute(query.INSERT_PRODUCT, [args]);

	
  }

  static insertProductSystemAsset(productId, assetIds) {
    const updatedDate = Date.now();
    const arr1 = [];
    for(let assetId of assetIds) {
        arr1.push([productId,assetId,updatedDate]);
    }
    return executor.execute(query.INSERT_STOCK_ASSET, [arr1]);
  }

static insertUserProductSystemAsset(productId, assetIds) {
console.log("******************************************************************&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
console.log(productId)
console.log(assetIds)
    const updatedDate = Date.now();
    const arr1 = [productId,assetIds,updatedDate];
    // for(let assetId of assetIds) {
    //     arr1.push([productId,assetId,updatedDate]);
    // }
    return executor.execute(query.INSERT_STOCK_ASSET, [arr1]);
  }

  static deleteProductSystemAssetByProduct(productId) {

    return executor.execute(query.DELETE_STOCK_ASSET, [productId]);
  }

  static updateProductById(product, id) {
    const {productName, productCode, quantity, unitPrice, branchId,
      categoryId, description, discount,sftrDiscount, availability, specialNote, tags} = product;
    const updatedDate = Date.now();

    const args = [productName, productCode, quantity, unitPrice, branchId, 
      updatedDate, categoryId, description, discount,sftrDiscount, 
      availability, specialNote, tags, id];
console.log("productupdate ProductDuo By Damith  " + product);
console.log(product);
console.log("Args update ProductDuo By Damith  "+args);
console.log(args);


    return executor.execute(query.UPDATE_PRODUCT, args);
  }


static updateAvalibProductById(product, id) {
    const {productName, productCode, quantity, unitPrice, branchId,
      categoryId, description, discount, availability, specialNote, tags} = product;
    const updatedDate = Date.now();

    const args = [productName, productCode, updatedDate, availability, id];


      console.log("productupdateAvalib ProductDuo By Damith  "+product);
console.log("Args update ProductDuo By Damith  "+args);


    return executor.execute(query.UPDATE_PRODUCT_AVALIB, args);
  }




  static updateProductQuantity(productId, quantity) {

    return executor.execute(query.UPDATE_PRODUCT_QUANTITY, [productId,quantity]);
  }

  static deleteProduct(orgId) {

    return executor.execute(query.DELETE_PRODUCT, [orgId]);
  }

  static getProducts(branchId) {

    return executor.execute(query.GET_PRODUCT_BY_BRANCH, [branchId]);
  }

  static getProductsByIds(ids) {

    return executor.execute(query.GET_PRODUCT_BY_IDS, [ids]);
  }

  static getAssetProductsByProductIds(ids, isImageReq) {
    if(isImageReq){
//console.log(ids)
 //console.log("getAssetProductsByProductIds")
     // console.log(ids)
      return executor.execute(query.GET_STOCK_ASSET_AND_IMAGES_BY_PRODUCTS, [ids]);
    }
      
    return executor.execute(query.GET_STOCK_ASSET_BY_PRODUCTS, [ids]);
  }

  /**
   * Search Product by name
   * @param {string} name - name of the organization
   * @returns {Promise} Promise
   */
  static searchProductByName(name) {
    let args = [`%${name}%`];
    return executor.execute(query.GET_PRODUCT_BRANCH_ORG_BY_NAME, args);
  }

}
