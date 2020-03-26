import * as query from './store.query';
import executor from '../executor';

/**
 * Store Dao
 */
export default class StoreDao {

  static createStore(store) {
    const {orgId, branchName, address, longitude, latitude,
      district, province, managerId, phone, logo, displayImage, slogan} = store;
    const addedDate = Date.now();
    const active = true;

    const args = [orgId, branchName, address, longitude, 
      latitude, district, province, managerId,
    addedDate, active, phone, logo, displayImage, slogan];

    return executor.execute(query.CREATE_STORE, args);
  }

  static getPartnerBranchByName(name, orgId) {
    const args = [name, orgId];
    return executor.execute(query.GET_STORE_BY_NAME, args);
  }

  static getStoreById(id) {
    const args = [id];

    return executor.execute(query.GET_STORE_BY_STORE_ID, args)
  }

  static getStoreWithImagesById(id) {
    const args = [id];
    return executor.execute(query.GET_STORE_WITH_IMAGES_BY_STORE_ID, args)
  }


  static getUserStoreWithImagesById(ids) {
    const args = [ids];

    return executor.execute(query.GET_USER_STORE_WITH_IMAGES_BY_STORE_ID, args)
  }


  static updateStoreById(id, store) {
    const {address, longitude, latitude, district, 
      province, managerId, phone, logo, displayImage, slogan} = store;
    const args = [address, longitude, latitude, district, province, 
      managerId, phone, logo, displayImage, slogan, id];

    return executor.execute(query.UPDATE_STORE_BY_STORE_ID, args);
  }

  static updateStoreoOnlineStatusById(id, status) {

    return executor.execute(query.UPDATE_STORE_ONLINE_STATUS_BY_STORE_ID, [status, id]);
  }

  static updateStoreOnlineStatusById(id, status) {

    return executor.execute(query.UPDATE_STORE_ONLINE_STATUS_BY_ID, [status, id]);
  }

  static getStoresBelongToPartner(partnerId) {
    const args = [partnerId];

    return executor.execute(query.GET_STORES_BY_PARTNER_ID, args);
  }

  static getStoresBelongToUser(userId) {
    const args = [userId];

    return executor.execute(query.GET_STORES_BY_USER_ID, args);
  }


  static getProductsByStore(storeId) {
    return executor.execute(query.GET_PRODUCTS_BY_STORE, [storeId]);
  }

static getUserProductsByStore(storeIds) {

     return executor.execute(query.GET_USER_PRODUCTS_BY_STORE,[storeIds]);
  }

  /**
   * Get All Store Count
   * @returns {Promise} promise
   */
  static getStoreCount() {
    return executor.execute(query.GET_STORES_COUNT);
  }

  /**
   * Get All Stores
   * @returns {Promise} promise
   */
  static getAllStores(lower, upper) {
    return executor.execute(query.GET_ALL_STORES, [lower, upper]);
  }

}
