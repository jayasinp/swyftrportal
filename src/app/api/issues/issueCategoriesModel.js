import Decorator from '../../helpers/decorator';
import IssueCategoriesDao from '../../databases/mysql/issues/issueCategoriesDao';

/**
 * IssueCategories Model
 */
class IssueCategoriesModel extends Decorator {

  constructor () {
    super();
  }

  getIssueCategories() {
    return new Promise((resolve, reject)=>{

      IssueCategoriesDao.getByIssueCategories().then((rows)=> resolve({
        status: 200,
        categories: this._buildIssueCategories(rows)
      })).catch(reject);
    })
  }

  _buildIssueCategories(dbArray) {
    let list = [];  
    for(let dbObject of dbArray){
      let category = {
        id: dbObject.id,
        description: dbObject.description
      };
      list.push(category);
    }    
    return list;
  }

}

export default new IssueCategoriesModel();
