import passport from 'passport';
import TokenStratergy from './utils/passportTokenStragergy';
import SysTokenStratergy from './utils/passportSysTokenStratergy';


// Passport configuration
passport.use('token', TokenStratergy);
passport.use('systoken', SysTokenStratergy);

export default passport;
