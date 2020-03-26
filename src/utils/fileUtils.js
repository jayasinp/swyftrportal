import fs from 'fs';
import * as serverConfigs from './serverConfigs';

const loadedConfigs = {};

/**
 * All types of operations with files will be done by static methods of this util class
 */
export default class FileUtils {

  /**
   * Reads configurations from a json formatted file
   * @param {!string} name - Filename, with extension, of the configuration to be loaded
   * @returns {object} - Configuration object
   */
  static loadConfigs (name) {
    const env = process.env.NODE_ENV;

    if (loadedConfigs[name]) {
      return loadedConfigs[name];
    }
    loadedConfigs[name] = require(serverConfigs.CONFIG_PATH[env] + name);
    return loadedConfigs[name];
  }

  /**
   * Reads a file synchronously
   * @param {!string} name - Filename, with extension, of the file to be loaded
   * @returns {object} - File
   */
  static readCertificateSync (name) {
    const platformConfig = this.loadConfigs(serverConfigs.CONFIGS.PLATFORM),
      env = platformConfig[serverConfigs.SSL_CONFIG],
      certificateName = platformConfig[serverConfigs.CERTIFICATES][name],
      url = serverConfigs.CERTIFICATE_PATH[env] + certificateName;

    return fs.readFileSync(url);
  }

  /**
   * Convert blob to string
   * @param {blob} - File
   * @returns {String} - File
   */
  static convertBlobToBase64(blob) {
    if(blob) {
      let buffer = new Buffer( blob );
      return buffer.toString('base64');
    } else {
      return null;
    }

  }
}
