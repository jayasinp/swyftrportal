import Decorator from '../../helpers/decorator';
import ProductDao from '../../databases/mysql/inventory/productDao';
import * as Constants from '../../helpers/constants';
import OrganizationDao from '../../databases/mysql/organization/organizationDao';
import StoreDao from '../../databases/mysql/store/storeDao';
import fileUtils from '../../../utils/fileUtils';

/**
 * Product Model
 */
class ProductModel extends Decorator {

  constructor () {
    super();
  }

   createProduct (product) {
//console.log("**************************************____________________________________________________________________________*************************************************************")
 
//  console.log(product)
    return new Promise((resolve, reject) => {
      if (!product.productName) {
        let err = new Error('Empty Product Name')
        err.customMessage = err.message
        err.appendDetails('ProductModel', 'createProduct')
        return reject(err)
      }
      if (!product.productCode) {
        let err = new Error('Empty Product Code')
        err.customMessage = err.message
        err.appendDetails('ProductModel', 'createProduct')
        return reject(err)
      }
      if (!product.quantity) {
        let err = new Error('Empty Quantity')
        err.customMessage = err.message
        err.appendDetails('ProductModel', 'createProduct')
        return reject(err)
      }
      if (!product.unitPrice) {
        let err = new Error('Empty Unit Price')
        err.customMessage = err.message
        err.appendDetails('ProductModel', 'createProduct')
        return reject(err)
      }
      if (!product.branchId) {
        let err = new Error('Empty Branch')
        err.customMessage = err.message
        err.appendDetails('ProductModel', 'createProduct')
        return reject(err)
      }
      if (!product.categoryId) {
        let err = new Error('Empty Category')
        err.customMessage = err.message
        err.appendDetails('ProductModel', 'createProduct')
        return reject(err)
      }
      if (product.id) {
//console.log("**************************************_______________________ if (product.id)_____________________________________________________*************************************************************")
 //      console.log(product.id)
        ProductDao.updateProductById(product, product.id).then(() => {
          if(product.assetIds && product.assetIds.length > 0) {
            ProductDao.deleteProductSystemAssetByProduct(product.id).then(()=>this.insertSytemUserAsset(product.id, product.assetIds).then((insertSystemAssetRes) => resolve({
                  status: insertSystemAssetRes.status
                })).catch(reject)).catch(reject);               
          } else {
            resolve({
              status: Constants.SUCCESS
            });
          }      
        }).catch(reject);
      } else {
        ProductDao.createProduct(product).then((result) => {
          let productId = result['insertId'];
// console.log("________________________________productId______else _________________________________________")
//console.log(productId)
          if(product.imageId && product.assetIds.length > 0) {
            return this.insertSytemUserAsset(productId,product.imageId).then((insertSystemAssetRes) => resolve({
                status: insertSystemAssetRes.status,
                productId: productId
              })).catch(reject);   
          }else {
            return resolve({
              status: Constants.SUCCESS,
              productId: productId
            });
          }
            
        }).catch(reject);
      }
    })
  }

  createUserProduct (product) {
// console.log("product&&&&&&createUserProduct &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&((((((((((*************************************")
 //   console.log(product)
    
        return new Promise((resolve, reject) => {
          if (!product.productName) {
            let err = new Error('Empty Product Name')
            err.customMessage = err.message
            err.appendDetails('ProductModel', 'createProduct')
            return reject(err)
          }
          if (!product.productCode) {
            let err = new Error('Empty Product Code')
            err.customMessage = err.message
            err.appendDetails('ProductModel', 'createProduct')
            return reject(err)
          }
          if (!product.quantity) {
            let err = new Error('Empty Quantity')
            err.customMessage = err.message
            err.appendDetails('ProductModel', 'createProduct')
            return reject(err)
          }
          if (!product.unitPrice) {
            let err = new Error('Empty Unit Price')
            err.customMessage = err.message
            err.appendDetails('ProductModel', 'createProduct')
            return reject(err)
          }
          if (!product.branchId) {
            let err = new Error('Empty Branch')
            err.customMessage = err.message
            err.appendDetails('ProductModel', 'createProduct')
            return reject(err)
          }
          if (!product.categoryId) {
            let err = new Error('Empty Category')
            err.customMessage = err.message
            err.appendDetails('ProductModel', 'createProduct')
            return reject(err)
          }
          if (product.id) {
   //  console.log("product.id###################################################################")
  //   console.log(product.id)
  //  console.log("product.imageId###################################################################")
   //  console.log(product.imageId)
   //  console.log(product.assetIds.length )
   // 
    
    
            ProductDao.updateProductById(product, product.id).then(() => {
              if(product.imageId && product.assetIds.length > 0) {
                ProductDao.deleteProductSystemAssetByProduct(product.id).then(()=>this.insertSytemUserAsset(product.id, product.imageId).then((insertSystemAssetRes) => resolve({
                      status: insertSystemAssetRes.status
                    })).catch(reject)).catch(reject);               
              } else {
                resolve({
                  status: Constants.SUCCESS
                });
              }      
            }).catch(reject);
          } else {
            ProductDao.createProduct(product).then((result) => {
              let productId = result['insertId'];
              if(product.assetIds && product.assetIds.length > 0) {
                return this.insertSytemAsset(productId,product.assetIds).then((insertSystemAssetRes) => resolve({
                    status: insertSystemAssetRes.status,
                    productId: productId
                  })).catch(reject);   
              }else {
                return resolve({
                  status: Constants.SUCCESS,
                  productId: productId
                });
              }
                
            }).catch(reject);
          }
        })
      }
    
    


  insertSytemAsset(productId, assetIds) {
// console.log(productId)
//    console.log(assetIds)
    return new Promise((resolve, reject) => {
      ProductDao.insertProductSystemAsset(productId, assetIds).then(() => resolve({
          status: Constants.SUCCESS
        })).catch(reject);      
    });       
  }

insertSytemUserAsset(productId, assetIds) {
// console.log(productId)
//    console.log(assetIds)
    return new Promise((resolve, reject) => {
      ProductDao.insertUserProductSystemAsset(productId, assetIds).then(() => resolve({
          status: Constants.SUCCESS
        })).catch(reject);      
    });       
  }


  deleteProduct (id) {
    return new Promise((resolve, reject) => {
      if (!id) {
        let err = new Error('Empty Product ID')
        err.customMessage = err.message
        err.appendDetails('ProductModel', 'deleteProduct')
        return reject(err)
      }

      return ProductDao.deleteProduct(id).then(() =>resolve({
          status: Constants.SUCCESS
        })).catch(reject);
    });
  }

  getProducts (organizationId, branchId, user) {
    return new Promise((resolve, reject) => {
      if (!organizationId) {
        let err = new Error('Empty Organization ID');
        err.customMessage = err.message;
        err.appendDetails('ProductModel', 'getProducts');
        return reject(err);
      }
      if (!branchId) {
        let err = new Error('Empty Branch ID');
        err.customMessage = err.message;
        err.appendDetails('ProductModel', 'getProducts');
        return reject(err);
      }

      if (!user.org_id) {
        let err = new Error('Empty Organization ID');
        err.customMessage = err.message;
        err.appendDetails('ProductModel', 'getProducts');
        return reject(err);
      }

      return OrganizationDao.getOrganizationByOrgId (user.org_id).then((userOrg) =>{
        OrganizationDao.getOrganizationByOrgId (organizationId).then((result) => {
          if(result.length === 1 && result[0].org_type && (userOrg[0].org_type === Constants.USER_TYPE.SWYFTR || userOrg[0].org_type === result[0].org_type)) {
            return StoreDao.getStoreById (branchId).then((result) =>{              
              if(result.length == 1){
                if(result[0].org_id && result[0].org_id == organizationId) {
                  return ProductDao.getProducts(branchId).then((result) =>{
                    this._buildProduct(result).then((builtProduct) => resolve({
                        status: Constants.SUCCESS,
                        products: builtProduct
                      })).catch(reject);
                  }).catch(reject)
                   
                } else {
                  let err = new Error('Branch Does Not Belong to Organization');
                  err.customMessage = err.message;
                  err.appendDetails('ProductModel', 'getProducts');
                  return reject(err);
                }
              } else {
                  let err = new Error('Invalid Branch');
                  err.customMessage = err.message;
                  err.appendDetails('ProductModel', 'getProducts');
                  return reject(err);
              }
              
            }).catch(reject);
          } else {
            let err = new Error('Invalid Organization Type');
            err.customMessage = err.message;
            err.appendDetails('ProductModel', 'getProducts');
            return reject(err);
          }
        }).catch(reject);
      }).catch(reject);
    });
  }

  getProductsByName(name) {
    return new Promise((resolve, reject) => {
console.log("Name")
console.log(name)

let isImageReq = "TURE";
      if (!name) {
        let err = new Error('Empty Search String');
        err.customMessage = err.message;
        err.appendDetails('ProductModel', 'getProductsByName');
        return reject(err);
      }
      return ProductDao.searchProductByName(name).then((result) =>{
        this._buildProduct(result,isImageReq ).then((builtProduct) => resolve({
            status: Constants.SUCCESS,
            products: builtProduct.products
          })).catch(reject);
      }).catch(reject);
    });
  }

  getProductsByIds(items) {
    return new Promise((resolve, reject) => {
      ProductDao.getProductsByIds(items).then((itemResult) => {
        let products = [];
        for(let element of itemResult){
          products.push(element);
        }
        this._buildProduct(products).then((builtProduct) => resolve({
          status: Constants.SUCCESS,
          products: builtProduct.products
        })).catch(reject);
      }).catch(reject);
    });
  }

  _buildProduct(dbArray, isImageReq) {  
   console.log("dbArray by damith foe 24/7")  
   console.log(dbArray)
 console.log(isImageReq) 
    return new Promise((resolve, reject) => {
      let list = [];
      let productIds = [];

      if (!Array.isArray(dbArray) || !dbArray.length) {
        console.log(dbArray)
     console.log("storeIds")
        return resolve({
          products: list
          
        });
      }

      dbArray.forEach((row) => productIds.push(row.id))
//console.log("$$$$$$$$$$$-------storeIds-------")
//console.log(productIds)
      return ProductDao.getAssetProductsByProductIds(productIds, isImageReq).then((assets) => {
        let formattedAssetList = this._buildProductAssets(assets, isImageReq);
        for(let dbObject of dbArray){
          let assetArray = [];
          formattedAssetList.forEach((asset) => {       
            if(asset.productId === dbObject.id) {
              if(isImageReq) {
                assetArray.push(asset);
              } else {
                assetArray.push(asset.assetId);
                
              }
              
            }
          })

//console.log("_____________________damith_____formattedAssetList _____________________________")
//console.log(formattedAssetList )


//console.log("_____________________damith______dbObject ____________________________")
//console.log(dbObject)




          let product = {
            id: dbObject.id,
            productName: dbObject.product_name,
            productCode: dbObject.product_code,
            quantity: dbObject.qty,
            unitPrice: dbObject.unit_price,
            organizationId: dbObject.org_id,
            organizationName: dbObject.org_name,
            branchId: dbObject.branch_id,
            branchName: dbObject.branch_name,
            categoryId: dbObject.category_id,
            categoryName: dbObject.category_name,
            description: dbObject.description,
            discount: dbObject.discount,
 	    sftrDiscount: dbObject.sftrDiscount,

            availability: dbObject.availability,
            specialNote: dbObject.special_note,
            assetIds: assetArray,
            tags: dbObject.tags,
            branchLogo: dbObject.branch_logo          };
//console.log("_____________________damith______product ____________________________")
//console.log(product )



          list.push(product);
        }

        return resolve({
          products: list
        });
      }).catch(reject);
    });
  }

  _buildUserProduct(dbArray, isImageReq) { 
//console.log("dbArray by damith")   
//console.log(dbArray) 
//console.log("isImageReqby damith")   
//console.log(isImageReq)  

    return new Promise((resolve, reject) => {
      let list = [];
      let productIds = [];

      if (!Array.isArray(dbArray) || !dbArray.length) {
         return resolve({
          products: list
        });
      }

     // dbArray.forEach((row) => productIds.push(row.id))
//console.log("dbArray.forEach((row) => productIds.push(row.id))_________________________________________________________________") 
//console.log(dbArray) 
dbArray.forEach((row) => productIds.push(row.id))
//console.log("$$$$$$$$$$$-------storeIds-------")
//console.log(productIds)

      return ProductDao.getAssetProductsByProductIds(productIds, isImageReq).then((assets) => {
        let formattedAssetList = this._buildUserProductAssets(assets, isImageReq);
        for(let dbObject of dbArray){
          let assetArray = [];
          formattedAssetList.forEach((asset) => {       
            if(asset.productId === dbObject.id) {
              if(isImageReq) {
                assetArray.push(asset);
              } else {
                assetArray.push(asset.assetId);
              }
              
            }
          })



//console.log("_____________________damith__________________________________")
//console.log(formattedAssetList )

//console.log("_____________________damith______dbObject ____________________________")
//console.log(dbObject)





          let product = {
            id: dbObject.id,
            productName: dbObject.product_name,
            productCode: dbObject.product_code,
            quantity: dbObject.qty,
            unitPrice: dbObject.unit_price,
            organizationId: dbObject.org_id,
            organizationName: dbObject.org_name,
            branchId: dbObject.branch_id,
            branchName: dbObject.branch_name,
            categoryId: dbObject.category_id,
            categoryName: dbObject.category_name,
            description: dbObject.description,
            discount: dbObject.discount,
 	    sftrDiscount: dbObject.sftrDiscount,
            availability: dbObject.availability,
            specialNote: dbObject.special_note,
            assetIds: assetArray,
            tags: dbObject.tags,
            branchLogo: fileUtils.convertBlobToBase64(dbObject.branch_logo)
          };
//console.log(product)
          list.push(product);
        }

        return resolve({
          products: list
        });
      }).catch(reject);
    });
  }

  _buildProductAssets(dbArray, isImageReq) {
    let assetList = [];
    for(let dbObject of dbArray){
      let asset = {
        productId: dbObject.stock_id,
        assetId: dbObject.system_asset_id
      };
      if(isImageReq) {
        //asset.image = fileUtils.convertBlobToBase64(dbObject.file);
asset.image = dbObject.given_name;

      }
      assetList.push(asset);
//console.log("isImageReq")
  //   console.log(assetList.push(asset))
//return 
    }    
 //console.log("assetList.push(asset)  assetList")
// console.log(assetList)


    return assetList;
  }


_buildUserProductAssets(dbArray, isImageReq) {
    let assetList = [];
    for(let dbObject of dbArray){
      let asset = {
        productId: dbObject.stock_id,
        assetId: dbObject.system_asset_id
      };
      if(isImageReq) {
        asset.image = dbObject.given_name;
      }
      assetList.push(asset);
//return 
    }    
 //console.log("assetList.push(asset)  assetList -------------------------------------------------------------=-====------===")
 //console.log(dbArray)
 //console.log(isImageReq)

//console.log("assetList.push(asset)  assetList -------------------------------------------------------------=-====------===")
//console.log("assetList.push(asset)  assetList -------------------------------------------------------------=-====------===")


    return assetList;
  }


  updateAvalibProduct (product) {
    return new Promise((resolve, reject) => {
     
     
      
      if (!product.branchId) {
        let err = new Error('Empty Branch')
        err.customMessage = err.message
        err.appendDetails('ProductModel', 'createProduct')
        return reject(err)
      }
      if (!product.categoryId) {
        let err = new Error('Empty Category')
        err.customMessage = err.message
        err.appendDetails('ProductModel', 'createProduct')
        return reject(err)
      }
      if (product.id) {
        ProductDao.updateAvalibProductById(product, product.id).then(() => {
          if(product.assetIds && product.assetIds.length > 0) {
            ProductDao.deleteProductSystemAssetByProduct(product.id).then(()=>this.insertSytemAsset(product.id, product.assetIds).then((insertSystemAssetRes) => resolve({
                  status: insertSystemAssetRes.status
                })).catch(reject)).catch(reject);               
          } else {
            resolve({
              status: Constants.SUCCESS
            });
          }      
        }).catch(reject);
      } 
    })
  }



}



export default new ProductModel()