/**
 * All configurations related to the https server implementation should go here
 */

// Core modules
import https from 'https';
import http from 'http';

// Helpers and Utils
import FileUtils from './utils/fileUtils';
import * as constants from './app/helpers/constants';
import { HTTPS_PORT } from './utils/configConstants';

// Internals
import app from './app';
import Daemon from './daemon';
import logger from './utils/logger';

/*
const credentials = {
  key: FileUtils.readCertificateSync("KEY"),
  cert: FileUtils.readCertificateSync("CERT"),
  ca: FileUtils.readCertificateSync("CA"),
  requestCert: true,
  rejectUnauthorized: false
};


// Create HTTPS server and listen on dedicated port
const server = https.createServer(credentials, app);
*/
const server = http.createServer(app);

// Instantiate daemon service
Daemon.init(server);

// Init HTTPS server dependencies and start listening
Daemon.initSyncServices().then(function () {
  server.listen(HTTPS_PORT, function () {
    logger.info("Listening on port: %s", HTTPS_PORT);
  });
}).catch(function (err) {
  logger.fatal(`Failed to initialize required services. Process will now exit: ${err.message}`);
  process.exit(1);
});

// Init asynchronous services
Daemon.initAsyncServices();

//Stop process killing on exceptions
process.on('uncaughtException', function (err) {
  logger.fatal('UncaughtException : %s', err.stack ? err.stack : err);
});

server.on('uncaughtException', function (req, res, next, err) {
  logger.error('UncaughtException : %s', err.stack ? err.stack : err);
  return res.status(constants.INTERNAL_ERROR).send(err.message);
});

server.on('error', function (err) {
  logger.fatal('Error : %s', err.stack ? err.stack : err);
  switch (err.code) {
    case 'EACCES':
      process.exit(1);
      break;
    case 'EADDRINUSE':
      process.exit(1);
      break;
  }
});


