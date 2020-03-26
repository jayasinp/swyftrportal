import Decorator from '../../helpers/decorator';
import ParamsDao from '../../databases/mysql/params/paramsDao';

/**
 * Params Model
 */
class ParamsModel extends Decorator {

  constructor () {
    super();
  }

  getParamValues(key) {
    return new Promise((resolve, reject)=>{
      if (!key) {
        let err = new Error("Empty Param Key");
        err.customMessage = err.message;
        err.appendDetails("Params Model", "getParamValues");
        return reject(err);
      }

      ParamsDao.getParamValueByKey(key).then((rows)=> {
      if (rows && rows.length > 0 && rows[0].param_value) {
        resolve({
          status: 200,
          value:  rows[0].param_value
        })
      } else {
        let err = new Error("Invalid Param Key");
        err.customMessage = err.message;
        err.appendDetails("Params Model", "getParamValues");
        reject(err);
      }
      }).catch(reject);
    })
  }

}

export default new ParamsModel();