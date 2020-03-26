import * as query from './userRating.query';
import executor from '../executor';

/**
 * UserRating Dao
 */
export default class UserRatingDao {

    static createRating(rating) {
        const {orderId, userId, userType, customerRating, riderRating,
          storeRating, swyftrRating} = rating;
    
        const args = [orderId, userId, userType, customerRating, riderRating,
            storeRating, swyftrRating];
        return executor.execute(query.INSERT_RATING, [args]);
      }

    static getUserRatingByOrderId(orderId) {
        return executor.execute(query.GET_RATING_ORDER, [orderId]);
    }

    static getUserRatingByOrderIdUserId(orderId, userId, userType) {
        return executor.execute(query.GET_RATING_ORDER_BY_ORDER_AND_USER_AND_USERTYPE, [orderId, userId, userType]);
    }
}