import * as query from './params.query';
import executor from '../executor';

/**
 * Params Dao
 */
export default class ParamsDao {

    static getParamValueByKey(key) {
        return executor.execute(query.GET_PARAM_VALUE_BY_KEY, [key]); 
    }
}