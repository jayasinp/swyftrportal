import * as query from './profileAssest.query';
import executor from '../executor';

/**
 * ProfileAssest Dao
 */
export default class ProfileAssestDao {

  static saveFileToDB(fileName, fileType, file) {
    const addedDate = Date.now();
    const args = [fileType, file, addedDate, fileName];

    return executor.execute(query.INSERT_FILE, args);
  }

  static getFileById(id) {
    const args = [id];
    return executor.execute(query.GET_FILE_BY_ID, args);
  }

}