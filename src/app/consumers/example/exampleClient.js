import Decorator from '../../helpers/decorator';
import RestClient from '../../../utils/restClient';
import * as apiConstants from './exampleApiConstants';

let _this = this;

/**
 * Restful client for communicating with the mockable REST API
 */
class ExampleClient extends Decorator {
    /**
     * Instance with an embedded instance of the rest-client
     */
    constructor() {
        super();
        _this = this;
        _this.restClient = new RestClient();
    }

    /**
     * Fetch some data from an external API
     * @returns {Promise} - Data from external api
     */
    getExampleData() {
        return new Promise(function (resolve, reject) {
            _this.restClient.send({
                method: 'get',
                url: `${apiConstants.BASE_PATH}${apiConstants.EXAMPLE_ENDPOINT}`
            }).then(resolve).catch(function (err) {
                err.appendDetails("ExampleClient", "getExampleData", "");
                return reject(err);
            });
        });
    }
}

export default new ExampleClient();
