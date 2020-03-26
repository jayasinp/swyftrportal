import Decorator from '../app/helpers/decorator';
import unirest from 'unirest';
import FileUtils from './fileUtils';
import * as serverConfigs from './serverConfigs';

let platformConfig = FileUtils.loadConfigs(serverConfigs.CONFIGS.PLATFORM);

/**
 * This is a restful client built as a wrapper on unirest to expose simple interfaces for other clients.
 */
export default class RestClient extends Decorator {
    /**
     * Create instance with optional headers
     * @param {object} [headers] - headers
     */
    constructor(headers) {
        super();
        this.headers = headers || {};
    }

    /**
     * Append or Replace header in headers object
     * @param {!string} key - header key
     * @param {!string} value - header value
     */
    putHeader(key, value) {
        this.headers[key] = value;
    }

    /**
     * Remove header from headers object
     * @param {string} key - header key
     */
    detachHeader(key) {
        delete this.headers[key];
    }

    /**
     * Retrieve all headers
     * @returns {object} - Headers of the referenced instance
     */
    get allHeaders() {
        return this.headers;
    }

    /**
     * Process params and pass to private method to send request to given url using unirest module
     * @param {!object} options - HTTPS Request configurations
     *      @param {!string} options.method - GET or POST
     *      @param {!string} options.url - Resource Url
     *      @param {object} [options.headers] - Optional headers to override the instance headers
     *      @param {object} [options.query] - Optional query params
     *      @param {object} [options.data] - Optional request body
     * @returns {Promise} - response body
     */
    send(options) {
        let _this = this;
        return new Promise(function (resolve, reject) {

            if (!options) {
                let err = new Error("Invalid arguments provided");
                err.appendDetails("RestClient", "send", "");
                return reject(err);
            }

            let {method, url} = options;

            if (!url || !method) {
                let err = new Error("Invalid method parameters");
                err.appendDetails("RestClient", "send", "");
                return reject(err);
            }

            _this._sendRequest(options)
                .then(resolve)
                .catch(function (err) {
                    err.appendDetails("RestClient", "send", "");
                    return reject(err);
                });
        });
    }

    /**
     * Send request to given url using unirest module
     * @param {!object} options - options
     * @returns {Promise} - response body
     * @private
     */
    _sendRequest(options) {
        let _this = this,
            {method, url, headers, data, query} = options,
            client;
        return new Promise(function (resolve, reject) {

            if (method === 'get') {  // Select HTTP method
                client = unirest.get(url);
            } else if (method === 'post') {
                client = unirest.post(url);
            } else {
                let err = new Error("Invalid http method");
                err.appendDetails("RestClient", "send", "");
                return reject(err);
            }

            headers = headers || _this.headers;  // Optional headers
            if (headers) {
                client.headers(headers);
            }

            if (query) { // Optional query params
                client.query(query);
            }

            if (data) { // Optional data
                client.send(data);
            }

            client.timeout(platformConfig[serverConfigs.EXTERNAL_API_TIMEOUT]);

            return client.end(function (res) {
                return resolve(res.body);
            });
        });
    }

    /**
     * Interface for get request with query params
     * @param {!string} url - Resource endpoint
     * @param {!object} query - Query parameters
     * @returns {Promise} - response body
     */
    sendGetWithQuery(url, query) {
        let _this = this;
        return new Promise(function (resolve, reject) {
            _this.send({
                method: 'get',
                url: url,
                query: query
            }).then(resolve).catch(function (err) {
                err.appendDetails("RestClient", "sendGetWithQuery", "");
                return reject(err);
            });
        });
    }

    /**
     * Interface for a simple get request
     * @param {!string} url - Resource endpoint
     * @returns {Promise} - response body
     */
    sendGet(url) {
        let _this = this;
        return new Promise(function (resolve, reject) {
            _this.send({
                method: 'get',
                url: url
            }).then(resolve).catch(function (err) {
                err.appendDetails("RestClient", "sendGet", "");
                return reject(err);
            });
        });
    }

    /**
     * Interface for post request with body
     * @param {!string} url - Resource endpoint
     * @param {!object} data - post body data
     * @returns {Promise} - response body
     */
    sendPostWithBody(url, data) {
        let _this = this;
        return new Promise(function (resolve, reject) {
            _this.send({
                method: 'post',
                url: url,
                data: data
            }).then(resolve).catch(function (err) {
                err.appendDetails("RestClient", "sendPostWithBody", "");
                return reject(err);
            });
        });
    }

}
