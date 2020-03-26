var express = require('express');
var _router = express.Router();
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require('multer');
import SystemAssestDao from './app/databases/mysql/systemAssest/systemAssestDao';
import FileModel from './app/api/file/fileModel';
import * as util from './app/helpers/utility';






const storage = multer.diskStorage({
   destination: (req, file, callBack) => {
        console.log("-----------------------------------kbcjbfvb-------------------------")
        console.log(callBack);
        console.log(file);
        callBack(null, './public/src/uploads')
    },
    filename: (req, file, callBack) => {
        console.log("------------------dshdjhjh--------kbcjbfvb-------------------------")
       // console.log(callBack(null, Date.now()+`Swyfter_${file.originalname}`));
        console.log(file);

        callBack(null, Date.now()+`Swyfter_${file.originalname}`)
    }
})
  
const upload = multer({ storage: storage })



_router.post('/file', upload.single('xxx'), (req, res, next) => {
   // console.log(req);

    const file = req.file;
    //console.log(file.name);
    if (!file) {
      const error = new Error('No File')
      error.httpStatusCode = 400
      return next(error)
    } else{
      //  const file = file
        return new Promise((resolve, reject) => {
           console.log("-------------------------nnnnnnnnnnnnnnnnnnnnn-----------------------------------");
 //console.log(resolve);
console.log(file);

      FileModel.saveFilenew(file).then(
        data => res.send(data)        
      ).catch(err => console.error(err));
     });

    }

   
    //console.log("---------------------------file.path-------------------------------")

     //console.log(file);

    //  return SystemAssestDao.saveFileToDB(file.originalname, file.filename, file.size, file.mimetype, file.path, null);
    //return FileModel.saveFilenew(file);

    


    
      //res.send(file);
})


module.exports = _router;



