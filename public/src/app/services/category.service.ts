import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getEndpoint, prepareHeaders} from '../utility/constants';
import {reject} from 'q';
import {CategoryType} from '../data/category.type';

@Injectable()
export class CategoryService {

  constructor(
    private http: HttpClient
  ) {
    this._prepare();
  }
  endpointUrl: String;
  endpointUrl1: String;
  _prepare() {
    this.endpointUrl = `${getEndpoint(true)}/category`;
  }

  getAllSubCategories(mainCategoryId: string): Promise<Array<CategoryType>> {
    return new Promise((resolve, reject) => {
      const url = `${this.endpointUrl}/allSubCategories/${mainCategoryId}`;
      const options = prepareHeaders();
      if (!options) {
        return reject(new Error('Empty options object'));
      }
      this.http.get(url, options).subscribe(
        (response) => {
          return resolve(response['subSubCategories']);
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }


}