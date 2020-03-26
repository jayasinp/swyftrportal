import * as query from './systemAssest.query';
import executor from '../executor';

/**
 * SystemAssest Dao
 */
export default class SystemAssestDao {

  static saveFileToDB(fileName, givenName, fileSize, fileType, description, file) {
 console.log("_________________SystemAssestDao ___________file_______________")
    console.log(file)
    const addedDate = Date.now();
    const args = [fileName, givenName, description, fileType, fileSize, file, addedDate];

    return executor.execute(query.INSERT_FILE, args);
  }

static saveFileToDBtest(fileName, filename, fileSize, fileType, description, file) {
    const addedDate = Date.now();
    const args = [fileName, filename, description, fileType, fileSize, file, addedDate];

    return executor.execute(query.INSERT_FILE, args);
  }

  static getFileById(id) {
    const args = [id];
    return executor.execute(query.GET_FILE_BY_ID, args);
  }

  static getFileByIds(ids) {
    return executor.execute(query.GET_FILE_BY_IDS, [ids]);
  }

}



