import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getEndpoint, prepareHeaders } from '../utility/constants';
import { reject } from 'q';
import { ReportType } from '../data/report.type';

@Injectable()
export class PartnerReportService {

    public reports: Array<ReportType>;

    constructor(
        private http: HttpClient
    ) {
        this._prepare();
    }
    endpointUrl: String;
    _prepare() {
        this.endpointUrl = `${getEndpoint(true)}/report`;
    }

    getReportByPartnerId(orgId: number, status: string, fromDate: number, toDate: number): Promise<Array<ReportType>> {
        return new Promise((resolve, reject) => {
            const url = `${this.endpointUrl}/items?status=${status}&fromDate=${fromDate}&toDate=${toDate}&orgId=${orgId}`;
            const options = prepareHeaders();
            if (!options) {
                return reject(new Error('Empty options object'));
            }
            this.http.get(url, options).subscribe(
                (response) => {
                    this.functionRemoveDuplicate(response['orders']);
                    return resolve(this.reports);
                },
                (err) => {
                    return reject(err);
                }
            );
        });
    }

    getVolumeSum(reportList: Array<ReportType>) {
        for (let entry of reportList) {
            console.log(entry);
        }
    }

    functionRemoveDuplicate(reportList: Array<ReportType>) {
        var finalreports = [];
        for (var i = 0; i < reportList.length; i++) {

            var exists = false;
            var partnerid = reportList[i].branchId;

            for (var j = 0; j < finalreports.length; j++) {

                if (partnerid == finalreports[j].branchId) {
                    exists = true;
                    var total = finalreports[j].total + reportList[i].total;
                    var totalPrice = finalreports[j].totalPrice + reportList[i].totalPrice;
                    finalreports[j].total = total;
                    finalreports[j].totalPrice = totalPrice;
                    break;
                }
            }

            if (!exists) {
                finalreports.push(reportList[i]);
            }
        }

        this.reports = finalreports;

    }
}