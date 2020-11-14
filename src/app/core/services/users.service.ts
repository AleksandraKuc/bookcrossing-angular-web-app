import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserDefinition} from "../models/user-definition.model";
import {environment} from "../../../environments/environment";
import {TokenStorageService} from "../../shared/helpers/token-storage.service";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient,
              private tokenStorage: TokenStorageService) {}

  getUser(username? : any): Observable<any> {
    username = username ? username : this.tokenStorage.getUsername();
    return this.http.get<UserDefinition>(`${environment.apiUrl}/user/username/${username}`);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/user/all`);
  }

  getBooksByUser(idUser: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/user/getBooksByUser/${idUser}`);
  }

  updateUser(user: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/user/update`, user);
  }

  // getUserBymail(mail : string): Observable<any>{
  //   return this.http.get(`${this.baseUrl}/mail/${mail}`)
  // }

}
