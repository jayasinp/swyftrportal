import {Strategy} from 'passport-token';
import UserTokenDao from '../app/databases/mysql/userToken/userTokenDao';
import ProfileDao from '../app/databases/mysql/profile/profileDao';

const strategyOptions = {
  usernameHeader: 'x-username',
  tokenHeader:    'x-token',
  usernameField:  'custom-username',
  tokenField:     'custom-token'
};


let tokenStratergy = new Strategy((userName, token, done)=>UserTokenDao.getActiveTokenByUserName(userName).then((rows)=>{
    if(rows && rows.length) {
      let user = rows[0];

      if(user["access_token"] !== token) {
        return done(null, false);
      }

      if(user["valid_till"] <= Date.now()) {
        return done(null, false);
      }

      return ProfileDao.getUserByEmailOrUserId(null, userName).then((rows)=>{
        if(rows && rows.length) {
          return done(null, rows[0]);
        }
        return done(null, false);
      });
    }

    return done(null, false);
  }).catch(done));

export default tokenStratergy;
