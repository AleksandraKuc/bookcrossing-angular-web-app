import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserDefinition} from "../models/user-definition.model";
import {environment} from "../../../environments/environment";
import {TokenStorageService} from "../../shared/helpers/services/token-storage.service";
import {ResetPasswordInfo} from "../../shared/models/reset-password-info";

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

  getUserById(id: number): Observable<any> {
    return  this.http.get(`${environment.apiUrl}/user/id/${id}`);
  }

  getAllUsers(filterResults: boolean): Observable<any> {
    const params = new HttpParams()
      .set('filterResults', String(filterResults))
      .set('username', '')
      .set('maxResults', '')
      .set('page', '');
    return this.http.get(`${environment.apiUrl}/user/all`, {params});
  }

  getBooksByUser(idUser: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/user/getBooksByUser/${idUser}`);
  }

  updateUser(user: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/user/update`, user);
  }

  changeStatus(username: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/user/changeStatus/${username}`, null);
  }

  resetPassword(current: string, newPassword: string): Observable<any> {
    let username = this.tokenStorage.getUsername();
    let data = new ResetPasswordInfo(username, current, newPassword);
    return this.http.post(`${environment.apiUrl}/user/resetPassword`, data);
  }

  deleteAccount(username?: string): Observable<any> {
    let user = username ? username : this.tokenStorage.getUsername();
    return this.http.delete(`${environment.apiUrl}/user/${user}`);
  }
}
