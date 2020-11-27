import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HistoryUsersService {

  private baseUrl = 'http://localhost:8080/api/historyUsers';

  constructor(private http: HttpClient) { }

  getUserHistory(idHistory: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/history/${idHistory}`);
  }
}
