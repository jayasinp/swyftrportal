import dbManager from './manager';

/**
 * Responsible for execute queries using db manager connection
 */
export default class QueryExecutor {

  /**
   * Execute a query with given arguments
   * @param {string} query - query string
   * @param {Array} args -  argument arrays
   * @return {Promise} promise
   */
  static execute(query, args) {
    return new Promise((resolve, reject)=>{
      if(!query) {
        return reject(new Error("No query specified"));
      }

      if(args && !Array.isArray(args)) {
        return reject(new Error("Data should be an array"));
      }

      dbManager.getPool().query(query, args, (err, rows)=>{
        if(err){
          err.appendDetails("QueryExecutor", "execute");
          return reject(err);
        }
        return resolve(rows);
      });
    });
  }

}
