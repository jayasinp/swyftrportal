// Core modules
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport from './passport';
import path from 'path';
import expressLogger from 'express-logging';
import cors from 'cors';
//import fileUpload from 'express-fileupload';

// Custom modules
import logger from './utils/logger';
import router from './app/api/router';
import errorHandler from './app/middleware/errorHandler';
import $404Handler from './app/middleware/404Handler';

let app = express();
//import multer from 'multer';
const multer = require('multer');
var fileRoutes = require('./file');
//const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());




// Use middleware as required
app.use(expressLogger(logger));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
//app.use(fileUpload());
app.use(require('express-session')({
  secret: 'swftr_session_key',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Base router
app.use('/email-content', express.static(path.join(__dirname, 'public', 'email-content')));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/reset-password', express.static(path.join(__dirname, 'public')));
app.use('/api/v1', router);


app.use('/file',fileRoutes);

app.use(express.static(path.join(__dirname, 'dist')));   




// Catch 404 and forward to error handler
app.use($404Handler);

// Main error handler
app.use(errorHandler);

export default app;
