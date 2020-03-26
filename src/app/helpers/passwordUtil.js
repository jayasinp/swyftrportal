import * as constants from './constants';
import * as crypto from 'crypto';

export const createPassword = function (password, salt, algorithm, returnType) {
  algorithm = algorithm || 'sha256';
  returnType = returnType || constants.HEX;
  let hash = crypto.createHmac(algorithm, salt);
  hash.update(password);
  return hash.digest(returnType);
}

export const createRandomSalt = function(length) {
  length = length || constants.DEFAULT_PWD_LENGTH;
  return crypto.randomBytes(length/constants.TWO).toString(constants.HEX).slice(0, length);
}

export const createPasswordHashAndSalt = function (password) {
  let salt = createRandomSalt();
  let hashedPassword = createPassword(password, salt);
  return {
    salt: salt,
    value: hashedPassword
  };
}
