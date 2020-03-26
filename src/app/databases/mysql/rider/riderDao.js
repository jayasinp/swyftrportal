import * as query from './rider.query';
import executor from '../executor';

/**
 * Store Dao
 */
export default class RiderDao {

  static createOrUpdateRiderInfo(userId, license, vehicleNo, nic) {
    const args = [userId, nic, license, vehicleNo, nic, license, vehicleNo];

    return executor.execute(query.CREATE_OR_UPDATE_RIDER_INFO, args)
  }

  static getRiderInfoByUserId(userId) {
    const args = [userId];

    return executor.execute(query.GET_RIDER_INFO, args);
  }

  static updateRiderStatus(userId, status) {
    const args = [status, userId];
console.log("status updateRiderStatus")
console.log(status)
console.log("userId updateRiderStatus")
console.log(userId)
 

 

    return executor.execute(query.UPDATE_RIDER_STATUS, args);
  }

  static getOnGoingDeliveryLocationsForRider(userId, orderStatus) {
    const args = [userId, orderStatus];

    executor.execute(query.GET_ONGOING_DELIVERY_LOCATIONS_FOR_RIDER, args);
  }

  static getRiderInfoForCustomer(orderId) {
    const args = [orderId];
    return executor.execute(query.GET_RIDER_INFO_AND_RIDER_PROFILE, args);
  }

  static getAllRidersOfOrg(orgId) {
    const args = [orgId];
    return executor.execute(query.GET_RIDERS_OF_ORG, args)
  }

  static getAllOrdersAssignedToRiderPartner(orgId) {
    const args = [orgId];
    return executor.execute(query.GET_ALL_ORDERS_ASSIGNED_TO_RIDERS, args);
  }

  static getRiderForAdmin(riderId) {
    const args = [riderId]
    return executor.execute(query.GET_RIDER_FOR_ADMIN, args)
  }

}
