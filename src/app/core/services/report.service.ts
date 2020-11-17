import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { TokenStorageService } from "../../shared/helpers/services/token-storage.service";
import { UserDefinition } from "../models/user-definition.model";
import {ReportInfo} from "../../shared/models/report-info";

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient,
              private tokenStorage: TokenStorageService) {}

  getReports(): Observable<any> {
    return this.http.get<UserDefinition>(`${environment.apiUrl}/report/all`);
  }

  createReport(report: ReportInfo): Observable<any> {
    let username = this.tokenStorage.getUsername();
    report.setReporter(username);
    return this.http.post(`${environment.apiUrl}/report/create`, report);
  }
}
