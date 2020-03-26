import * as mysql from 'mysql';
import FileUtils from '../../../utils/fileUtils';
import * as configs from '../../../utils/serverConfigs';

/**
 * DbManager Class
 */
class DbManager {

  /**
   * Constructor
   */
  constructor() {
    let dbConfig = FileUtils.loadConfigs(configs.CONFIGS.MYSQL);
    this.connectionLimit = Math.floor(dbConfig.connectionLimit);
    this.pool = mysql.createPool(dbConfig);
  }

  /**
   * Get connection pool
   * @return {Pool|*} pool
   */
  getPool() {
    return this.pool;
  }

}

export default new DbManager();
