import Decorator from '../../helpers/decorator';
import * as serverConfigs from "../../../utils/serverConfigs";
import FileUtils from '../../../utils/fileUtils';
import RestClient from '../../../utils/restClient';
import logger from '../../../utils/logger'

const TO_NUMBER_LENGTH = 11;

class SmsService extends Decorator {
  /**
   * Constructor
   */
  constructor() {
    super();

    this.configs = FileUtils.loadConfigs(serverConfigs.CONFIGS.SMS);
    const headers = this._creatHeaders();
    this.restClient = new RestClient(headers);
  }

  _creatHeaders () {
    const headers = {}
    headers['accept'] = 'application/json'
    headers['content-type'] = 'application/json'
    return headers;
  }

  sendSms(to, message) {
    return new Promise((resolve, reject) => {
      if (!to) {
        let err = new Error(`invalid to number`);
        err.customMessage = err.message;
        err.appendDetails("SmsService", "sendSms");
        return reject(err);
      }

      if (!message) {
        let err = new Error(`invalid message`);
        err.customMessage = err.message;
        err.appendDetails("SmsService", "sendSms");
        return reject(err);
      }

      if (to.length !== TO_NUMBER_LENGTH) {
        if (to.charAt(0) === '0') {
          to = '94' + to.substr(1, to.length -1)
        } else {
          to = '94' + to
        }
      }

      const url = `${this.configs[serverConfigs.SMS_PROPS.URL]}/send`;
      const payLoad = {
        user_id: this.configs[serverConfigs.SMS_PROPS.USER_ID],
        api_key: this.configs[serverConfigs.SMS_PROPS.API_KEY],
        sender_id: this.configs[serverConfigs.SMS_PROPS.SENDER_ID],
        to: to,
        message: message
      }

      logger.info('logName=debugSms', JSON.stringify(payLoad));
      this.restClient.sendPostWithBody(url, payLoad).then(resolve).catch(reject)
      resolve();
    });
  }
}

export default new SmsService();
