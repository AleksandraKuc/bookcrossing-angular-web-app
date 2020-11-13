import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserDefinition} from "../models/user-definition.model";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) {}

  getUser(idUser : any): Observable<any> {
    return this.http.get<UserDefinition>(`${environment.apiUrl}/user/id/${idUser}`);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/user/all`);
  }

  getBooksByUser(idUser: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/user/getBooksByUser/${idUser}`);
  }

  // getUserBymail(mail : string): Observable<any>{
  //   return this.http.get(`${this.baseUrl}/mail/${mail}`)
  // }

}
