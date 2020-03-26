import Decorator from '../../helpers/decorator';

import CategoryDao from '../../databases/mysql/category/categoryDao';
import OrganizationDao from '../../databases/mysql/organization/organizationDao';
import StoreModel from '../store/storeModel';
import OrganizationModel from '../partner/partnerModel';

/**
 * Category Model
 */
class CategoryModel extends Decorator {

  constructor () {
    super();
  }

  getSubCategories(categoryId) {
    return new Promise((resolve, reject)=>{
      if (!categoryId) {
        let err = new Error("Invalid category id");
        err.customMessage = err.message;
        err.appendDetails("Category Model", "getSubCategories");
        return reject(err);
      }

      CategoryDao.getSubCategories(categoryId).then((rows)=> resolve({
        status: 200,
        subSubCategories: this._buildCategory(rows)
      })).catch(reject);
    })
  }

  getStoresByCategory(categoryId) {
    return new Promise((resolve, reject)=>{
      if (!categoryId) {
        let err = new Error("Invalid category id");
        err.customMessage = err.message;
        err.appendDetails("Category Model", "getStoresByCategory");
        return reject(err);
      }

      CategoryDao.getStoresByCategory(categoryId).then((rows)=> {
          let list = [];
          let orgIdSet = new Set();
          console.log(rows)
          for(let row of rows){
            orgIdSet.add(row.org_id);
            list.push(StoreModel._buildStore(row));
          }
          let orgIdArray = [...orgIdSet];
          let orgList = [];
          if(orgIdArray.length > 0){
            OrganizationDao.getOrganizationLogosByOrgIds(orgIdArray).then((orgResults) => {
              for(let orgResult of orgResults){
                orgList.push(OrganizationModel._buildPartner(orgResult));
              }
              resolve({
                status: 200,  
                stores: list,
                partners: orgList
              });             
            }).catch(reject);
          } else {
            resolve({
              status: 200,  
              stores: list,
              partners: orgList
            }); 
          }
        }
      ).catch(reject);
    })
  }

  _buildCategory(dbArray) {
 //console.log("20202020202020202020202020202020202020202020202020202020202020202")
   //   console.log(dbArray)
    let list = [];  
    for(let dbObject of dbArray){
      let category = {
        id: dbObject.id,
        categoryName: dbObject.category_name,
        parentCategory: dbObject.parent_category,
        assetId: dbObject.asset_id
      };
      list.push(category);
    }   
// console.log("________________________________________________________________________________")

 //console.log(list)
 
    return list;
  }

}

export default new CategoryModel();
