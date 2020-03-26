import * as query from './category.query';
import executor from '../executor';

/**
 * Category Dao
 */
export default class CategoryDao {

    static getSubCategories(categoryId) {
        if(categoryId !== "null")
            return executor.execute(query.GET_SUB_CATEGORY, [categoryId]);
        else
            return executor.execute(query.GET_PARENT_CATEGORY);       
    }

    static getStoresByCategory(categoryId) {
        return executor.execute(query.GET_STORES_BY_CATEGORY, [categoryId]);
    }
}