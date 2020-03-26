import * as query from './organization.query';
import executor from '../executor';

/**
 * Organization Dao
 */
export default class OrganizationDao {

  /**
   * Insert new organization entry
   * @param {object} organization - organization entry
   * @returns {Promise} Promise
   */
  static insertOrganization(organization) {
    let {name, headOfficeAddress, headOfficeContactNo, orgType, bank, branch, accountNo, preferedPaymentMethod,
         branchCode, bankSwiftCode, pointOfContactName, pointOfContactMobile, logoId, tags } = organization;
    let addedDate = Date.now();
    let isActive = true;
    let args = [name, headOfficeAddress, headOfficeContactNo, orgType, bank, branch, accountNo, preferedPaymentMethod,
      branchCode, bankSwiftCode, pointOfContactName, pointOfContactMobile, addedDate, logoId, isActive, tags];

    return executor.execute(query.INSERT_ORGANIZATION, [args]);
  }

  /**
   * Get organization by org id
   * @param {string} orgId - organization id
   * @returns {Promise} promise
   */
  static getOrganizationByOrgId(orgId) {
    let args = [orgId];
    return executor.execute(query.GET_ORGANIZATION_BY_ORG_ID, args);
  }

/**
   * Get organization by user id
   * @param {string} userId - organization id
   * @returns {Promise} promise
   */
  static getOrganizationByUserId(userId) {
    let args = [userId];
    return executor.execute(query.GET_ORGANIZATION_BY_USER_ID, args);
  }


  /**
   * Get organization logos by org ids
   * @param {array} orgId - organization id
   * @returns {Promise} promise
   */
  static getOrganizationLogosByOrgIds(ids) {
    return executor.execute(query.GET_ORGANIZATION_LOGOS_BY_ORG_IDS, [ids]);
  }

  /**
   * Search organization by name
   * @param {string} name - name of the organization
   * @param {boolean} status - active or deactive status
   * @returns {Promise} Promise
   */
  static searchOrgByName(name, status) {
    let args = [`%${name}%`, status];
    return executor.execute(query.GET_ORGANIZATION_BY_NAME, args);
  }

    /**
   * Search organization by name with logo image
   * @param {string} name - name of the organization
   * @param {boolean} status - active or deactive status
   * @returns {Promise} Promise
   */
  static searchOrgByNameWithLogo(name, status) {
    let args = [`%${name}%`, status];
    return executor.execute(query.GET_ORGANIZATION_BY_NAME_IMAGE, args);
  }


  /**
   * Update organization details
   * @param {object} updateObj - update details
   * @returns {Promise} Promise
   */
  static updateOrgByOrgId(updateObj) {
    let {name, headOfficeAddress, headOfficeContactNo, pointOfContactName, pointOfContactMobile, logoId, orgId, tags} = updateObj;
    let args = [name, headOfficeAddress, headOfficeContactNo, pointOfContactName, pointOfContactMobile, logoId, tags, orgId];
    return executor.execute(query.UPDATE_ORGANIZATION, args);
  }

  static changePartnerStatus(partnerId, status) {
    let args = [status, partnerId];
    return executor.execute(query.CHANGE_PARTNER_STATUS, args);
  }
}
