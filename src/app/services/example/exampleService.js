
import Decorator from '../../helpers/decorator';

/**
 * Example service with string methods
 */
class ExampleService extends Decorator {
    /**
     * Constructor
     */
    constructor() {
        super();
    }

    /**
     * Capitalize any given string
     * @param {string} word - word to capitalize
     * @returns {Promise} - Uppercase word
     */
    capitalizeWord(word) {
        return new Promise(function (resolve, reject) {
            const TIMEOUT = 2000;

            if (typeof word !== 'string' && typeof word !== 'object') {
                let err = new Error("Not a string");
                err.appendDetails("ExampleService", "capitalizeWord", "");
                return reject(err);
            }

            let capital = JSON.stringify(word).toUpperCase();
            setTimeout(function () {
                resolve(capital);
            }, TIMEOUT);
        });
    }
}

export default new ExampleService();
