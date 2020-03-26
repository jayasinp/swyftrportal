import * as query from './issueCategories.query';
import executor from '../executor';

/**
 * IssueCategories Dao
 */
export default class IssueCategoriesDao {

    static getByIssueCategories() {
        return executor.execute(query.GET_ISSUE_CATEGORIES);
    }
}