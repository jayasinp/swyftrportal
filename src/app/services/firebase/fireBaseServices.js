import FCM from 'fcm-push';
import FileUtils from '../../../utils/fileUtils';
import * as serverConfigs from '../../../utils/serverConfigs';
import ProfileDao from '../../databases/mysql/profile/profileDao';
import logger from '../../../utils/logger'

/**
 * This class encapsulate firebase functionalities
 */
class FireBaseService {

  /**
   * constructor
   */
  constructor() {
    let configs = FileUtils.loadConfigs(serverConfigs.CONFIGS.FIRE_BASE)[serverConfigs.FIREBASE_CONFIGS.PUSH_NOTIFICATION];
    let serverKey = configs.serverKey;
    this.fcm = new FCM(serverKey);
  }

  sendCloudMessageToDevice(deviceId, collapseKey, data, notification) {
    let message = {
      to: deviceId,
      collapse_key: collapseKey,
      data: data,
      notification: notification
    };

    return this.fcm.send(message);
  }

  sendCloudMessageToUserByUserid(userId, collapseKey, data, notification) {
    ProfileDao.getUserByEmailOrUserId(userId, null).then((rows)=> {
      if (!rows.length) {
        logger.error(`Customer with userId ${userId} does not exists`);
      }

      this.sendCloudMessageToDevice(rows[0]['device_id'], collapseKey, data, notification).then((data)=>{
        logger.info('FCM success, message=%s', JSON.stringify(data))
      }).catch((err)=> {
        logger.error('push notification failed userId=%s, data=%s, err=%s',userId, JSON.stringify(data), JSON.stringify(err))
      });
    }).catch((err)=> {
      logger.error(err);
    });
  }

}

export default new FireBaseService();
