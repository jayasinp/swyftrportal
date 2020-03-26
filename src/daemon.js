import * as sourceMaps from 'source-map-support';
import * as configConstants from './utils/configConstants';

/**
 * All daemon services that should be instantiated before starting the https server, or that can be
 * initiated asynchronously will be initiated/instantiated here
 */
export default class Daemon {

  /**
   * Instantiate daemon service proxy
   * @param {object} server - HTTPS Server if in case needed by other services
   */
  static init (server) {
    Daemon.server = server;
  }

  /**
   * Instantiate and/or initiate daemon services that are required before starting the https server
   * @returns {Promise} - task success
   */
  static initSyncServices() {
    return new Promise(function (resolve, reject) {
      Daemon.modifyErrorPrototype()
        .then(Daemon.enableSourceMaps)
        .then(resolve)
        .catch(function (err) {
          err.appendDetails("Daemon", "initSyncServices", "Failed while initializing some service");
          return reject(err);
        });
    });
  }

  /**
   * Instantiate and/or initiate daemon services that run independent of the https server
   */
  static initAsyncServices() {
  }

  /**
   * Enable Source-map support in dev environments
   * @returns {Promise} - promise
   */
  static enableSourceMaps () {
    return new Promise(function (resolve) {
      if (configConstants.SOURCE_MAPS_SUPPORT) {
        sourceMaps.install();
        return resolve();
      }
      return resolve();
    });
  }

  /**
   * Appends additional details to the standard error object
   * @param {string} [pathOverrider] - String to override the error propagation path
   * @param {string} [causesOverrider] - String to override the error causes list
   * @returns {Promise} - task success
   */
  static modifyErrorPrototype (pathOverrider, causesOverrider) {
    return new Promise(function (resolve) {
      /**
       * @param {string} className - Name of the module in which the error was detected
       * @param {string} method - Name of the module-method in which the error was detected
       * @param {string} cause - More details about the cause of the error
       */
      Error.prototype.appendDetails = function (className = "*NULL*", method = "*NULL*", cause = "*NULL*") {
        this.path = pathOverrider || (this.path || "#") + ` -> [${className}]|(${method})`;
        this.causes = causesOverrider || (this.causes || "#") + ` -> (${method})|${cause}`;
      };
      return resolve();
    });
  }

}
