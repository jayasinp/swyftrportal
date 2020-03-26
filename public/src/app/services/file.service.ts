import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getEndpoint, prepareHeaders, bin2string} from '../utility/constants';
import {reject} from 'q';

@Injectable()
export class FileService {

  constructor(private http: HttpClient) {
    this._prepare();
  }

  endpointUrl: String;

  _prepare() {
    this.endpointUrl = `${getEndpoint(true)}/file`;
  }

  getSystemFile(fileId): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/sys/download/${fileId}`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.get(url, options).subscribe(
        (response) => {
          return resolve(response);
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }

  downloadImageFromSystemByFileId(fileId): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getSystemFile(fileId).then((resp) => {
	console.log("__________________________________________________resp___________________________________________________________________________________")
 	console.log(resp)
       // const data = bin2string(resp.data.data);
        const imageFile = {
          fileType: resp.fileType,
 	  fileGivenName:resp.fileGivenName,
 	fileName:resp.fileName,
         //  data: data    
    };
        return resolve(imageFile);
      }).catch(reject);
    });
  }
}
