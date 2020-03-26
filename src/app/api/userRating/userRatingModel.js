import Decorator from '../../helpers/decorator';
import UserRatingDao from '../../databases/mysql/userRating/userRatingDao';
import * as Constants from '../../helpers/constants';

/**
 * UserRating Model
 */
class UserRatingModel extends Decorator {

  constructor () {
    super();
  }

  createUserRating(rating) {
    return new Promise((resolve, reject)=>{
      if (!rating.orderId) {
        let err = new Error("Empty Order id");
        err.customMessage = err.message;
        err.appendDetails("UserRating Model", "createUserRating");
        return reject(err);
      }
      if (!rating.userId) {
        let err = new Error("Empty User id");
        err.customMessage = err.message;
        err.appendDetails("UserRating Model", "createUserRating");
        return reject(err);
      }
      if (!rating.userType) {
        let err = new Error("Empty User type");
        err.customMessage = err.message;
        err.appendDetails("UserRating Model", "createUserRating");
        return reject(err);
      }
      if (!rating.storeRating) {
        rating.storeRating = null;
      }
      if (!rating.swyftrRating) {
        rating.swyftrRating = null;
      }
      if (!rating.customerRating) {
        rating.customerRating = null;
      }
      if (!rating.riderRating) {
        rating.riderRating = null;
      }

      UserRatingDao.getUserRatingByOrderIdUserId(rating.orderId, rating.userId, rating.userType).then((result) => {
        if(result[0]) {
          resolve({
            status: Constants.BAD_REQUEST,
            message: "Rating already submitted to Order "+rating.orderId
          });
        }else {          
          UserRatingDao.createRating(rating).then(() => {
            resolve({
              status: Constants.SUCCESS
            })
          }).catch(reject);
        }
      }).catch(reject);
      
    })
  }

  getRatingByOrder(orderId) {
    return new Promise((resolve, reject)=>{
      if (!orderId) {
        let err = new Error("Empty Order id");
        err.customMessage = err.message;
        err.appendDetails("UserRating Model", "getRatingByOrder");
        return reject(err);
      }

      UserRatingDao.getUserRatingByOrderId(orderId).then((rows) => {
        resolve({
          status: 200,  
          ratings: this._buildRating(rows)
        }); 
      }).catch(reject);
    })
  }

  _buildRating(dbArray) {
    let list = [];  
    for(let dbObject of dbArray){
      let rating = {
        orderId: dbObject.order_id,
        userId: dbObject.user_id,
        userType: dbObject.user_type,
        customerRating: dbObject.customer_rating,
        riderRating: dbObject.rider_rating,
        storeRating: dbObject.store_rating,
        swyftrRating: dbObject.swyftr_rating,
      };
      list.push(rating);
    }    
    return list;
  }

}

export default new UserRatingModel();
