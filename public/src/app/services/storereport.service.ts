import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getEndpoint, prepareHeaders } from '../utility/constants';
import { reject } from 'q';
import { ReportType } from '../data/report.type';

@Injectable()
export class StoreReportService {

    constructor(
        private http: HttpClient
    ) {
        this._prepare();
    }
    endpointUrl: String;
    _prepare() {
        this.endpointUrl = `${getEndpoint(true)}/report/items`;
    }

    getReportByStoreId(storeid: number, status: string, fromDate: number, toDate: number): Promise<Array<ReportType>> {
        return new Promise((resolve, reject) => {
            const url = `${this.endpointUrl}/store?status=${status}&fromDate=${fromDate}&toDate=${toDate}&branchId=${storeid}`;
            const options = prepareHeaders();
            if (!options) {
                return reject(new Error('Empty options object'));
            }
            this.http.get(url, options).subscribe(
                (response) => {
                    return resolve(response['orders']);
                },
                (err) => {
                    return reject(err);
                }
            );
        });
    }
}