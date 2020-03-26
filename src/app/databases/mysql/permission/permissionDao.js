import * as query from './permission.query';
import executor from '../executor';

/**
 * Permission Dao
 */
export default class PermissionDao {

  static insertPermissionForUser(userId, permissionId) {
    const addedDate = Date.now();
    const revoked = false;
    const args = [userId, permissionId, addedDate, revoked, addedDate, revoked]
    return executor.execute(query.INSERT_USER_PERMISSIONS, args)
  }

  static getUserPermissions(userId) {
    return new Promise((resolve, reject)=>{
      const args = [userId]
      executor.execute(query.GET_ALL_PERMISSIONS_FOR_USER, args).then((permissions)=>{
        let permObj = {};
        permissions.forEach((perm)=>{
          permObj[perm['permission_id']] = !perm['revoked']
        })
        return resolve(permObj)
      }).catch(reject)
    });
  }

  static revokePermission(userId, permissionId) {
    const args = [userId, permissionId];
    return executor.execute(query.REVOKE_PERMISSION_FROM_USER, args)
  }

  static isUserHavePermission(userId, permissionId) {
    return new Promise((resolve, reject)=>{
      const args = [userId, permissionId];
      return executor.execute(query.IS_USER_HAVE_PERMISSION, args).then((rows)=>{
        if (!rows || !rows.length) return resolve(false)
        if (rows[0]['user_id'] !== userId) return resolve(false)
        resolve(true)
      }).catch(reject)
    });
  }

  static getAllPermissionTypes() {
    return executor.execute(query.GET_ALL_PERMISSION_TYPES, []);
  }

  static getAllPermissionTypeForUser(userId) {
    return executor.execute(query.GET_ALL_PERMISSION_TYPES_FOR_USER, [userId])
  }

}
