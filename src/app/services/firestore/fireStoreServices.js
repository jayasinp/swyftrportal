import FileUtils from '../../../utils/fileUtils';
import * as serverConfigs from '../../../utils/serverConfigs';
import logger from '../../../utils/logger';
import firebase from 'firebase';

/**
 * This class encapsulate firebase functionalities
 */
class FireStoreService {

  /**
   * constructor
   */
  constructor() {
    this.configs = FileUtils.loadConfigs(serverConfigs.CONFIGS.FIRE_BASE)[serverConfigs.FIREBASE_CONFIGS.FIRESTORE];
    this._configure()
  }

  _configure() {
    firebase.initializeApp(this.configs)
    this.db = firebase.firestore()
    this.db.settings({timestampsInSnapshots: true})
  }

  queryCollection(collection, queryObj) {
    return this.db.collection(collection).where(queryObj.key, queryObj.operator, queryObj.value).get()
  }
}

export default new FireStoreService();
