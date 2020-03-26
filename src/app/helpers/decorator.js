import logger from '../../utils/logger';

/**
 * Decorator class with reusable utils embedded to be extended by all other modules
 */
export default class Decorator {

    /**
     * @returns {object | null} - Decorated instance
     * @constructor
     */
    constructor() {
        let _this = this;
        _this.logger = logger;
        return _this;
    }
}
