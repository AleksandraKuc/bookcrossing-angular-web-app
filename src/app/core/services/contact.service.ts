import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserDefinition} from "../models/user-definition.model";
import {environment} from "../../../environments/environment";
import {TokenStorageService} from "../../shared/helpers/services/token-storage.service";

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) {}

  sendEmail(mail: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/contact`, mail);
  }

}
