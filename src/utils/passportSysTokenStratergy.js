import {Strategy} from 'passport-token';
import SysUsertokenDao from '../app/databases/mysql/sysUserToken/sysUserTokenDao';
import SysUserProfileDao from '../app/databases/mysql/sysUserProfile/sysUserProfileDao';

const strategyOptions = {
  usernameHeader: 'x-username',
  tokenHeader:    'x-token',
  usernameField:  'custom-username',
  tokenField:     'custom-token'
};


let tokenStratergy = new Strategy((userName, token, done) => SysUsertokenDao.getActiveTokenByUserName(userName).then((rows)=>{
  if(rows && rows.length) {
    let user = rows[0];

    if(user["access_token"] !== token) {
      return done(null, false);
    }

    if(user["valid_till"] <= Date.now()) {
      return done(null, false);
    }

    return SysUserProfileDao.getUserByEmailOrUserId(null, userName).then((rows)=>{
      if(rows && rows.length) {
        return done(null, rows[0]);
      }
      return done(null, false);
    });
  }

  return done(null, false);
}).catch(done));

export default tokenStratergy;
