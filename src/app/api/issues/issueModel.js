import * as Constants from '../../helpers/constants';
import Decorator from '../../helpers/decorator';
import EmailClient from '../../../utils/emailClient';
import IssuesDao from '../../databases/mysql/issues/issuesDao';
import OrderDao from '../../databases/mysql/order/orderDao';
import ProfileDao from '../../databases/mysql/profile/profileDao';
import SysUserProfileDao from '../../databases/mysql/sysUserProfile/sysUserProfileDao';

/**
 * Issue Model
 */
class IssueModel extends Decorator {

  constructor() {
    super();
  }

  addIssue(issue, adminId) {
    return new Promise((resolve, reject) => {
      if (!issue.subject) {
        let err = new Error('Empty Subject')
        err.customMessage = err.message
        err.appendDetails('IssueModel', 'addIssue')
        return reject(err)
      }
      if (!issue.description) {
        let err = new Error('Empty Content')
        err.customMessage = err.message
        err.appendDetails('IssueModel', 'addIssue')
        return reject(err)
      }
      if (!issue.categoryId) {
        let err = new Error('Empty Category')
        err.customMessage = err.message
        err.appendDetails('IssueModel', 'addIssue')
        return reject(err)
      }
      if (!issue.orderId) {
        let err = new Error('Empty Order Id')
        err.customMessage = err.message
        err.appendDetails('IssueModel', 'addIssue')
        return reject(err)
      }
      IssuesDao.insertIssue(issue).then((result) => {
        let issueId = result['insertId'];
        let p1, p2 = null;
        OrderDao.getOrderById(issue.orderId).then((order) => {
          p1 = ProfileDao.getUserByEmailOrUserId(order[0].customer).then((customer) => {
            EmailClient.sendEmail({
              to: customer[0].email,
              from: '',
              subject: "Your Case Has Been Raised, Case ID : " + issueId,
              html: this._generateIssueEmailForUser(customer[0].first_name, customer[0].last_name, issue.subject, issue.description)
            });
          }).catch(reject);
          p2 = SysUserProfileDao.getUserByEmailOrUserId(adminId).then((adminUser) => {
            EmailClient.sendEmail({
              to: adminUser[0].email,
              from: '',
              subject: "Your Case Has Been Raised, Case ID : " + issueId,
              html: this._generateIssueEmailForUser(adminUser[0].first_name, adminUser[0].last_name, issue.subject, issue.description)
            });
          }).catch(reject);
        }).catch(reject);
        Promise.all([p1, p2, resolve({
          status: Constants.SUCCESS,
          issueId: issueId
        })]);
      }).catch(reject);
    }
    );

  }

  _generateIssueEmailForUser(firstName, lastName, subject, content) {
    let emailContent =
      `<h3>Dear ${firstName} ${lastName},<br><br> ${subject} <br><br> <b>${content}<br><br> Regards.</h3>`;

    return emailContent;
  }

  _buildIssue(dbArray) {
    let list = [];
    for (let dbObject of dbArray) {
      let category = {
        id: dbObject.id,
        description: dbObject.description
      };
      list.push(category);
    }
    return list;
  }

}

export default new IssueModel();
