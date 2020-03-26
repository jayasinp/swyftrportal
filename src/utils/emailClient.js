import nodeEmail from 'nodemailer';
import Decorator from '../app/helpers/decorator';
import FileUtils from './fileUtils';
import * as serverConfigs from './serverConfigs';

/**
 * Email client
 */
class EmailClient extends Decorator {

  /**
   * Constructor
   */
  constructor() {
    super();
    this._configure();
  }

  /**
   * configure client
   * @private
   */
  _configure() {
    let configs = FileUtils.loadConfigs(serverConfigs.CONFIGS.EMAIL);
    this.transporter = nodeEmail.createTransport({
      service: configs["SERVICE_PROVIDER"],
      auth: {
        user: configs["USER"],
        pass: configs["PASSWORD"]
      }
    });
  }

  /**
   * Send email
   * @param {Object} email - email
   * @param {String} email.from - from email address
   * @param {String} email.to - to email address
   * @param {String} email.subject - subject of the email
   * @param {String} email.html - email content in HTML
   * @return {Promise} promise
   */
  sendEmail(email) {
    return new Promise((resolve, reject)=>{
      this.transporter.sendMail(email, (err, info)=>{
        if(err) return reject(err);
        return resolve(info);
      });
    });
  }

}

export default new EmailClient();
