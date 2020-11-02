import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserDefinition} from "../models/user-definition.model";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private baseUrl = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) {}

  getUser(idUser : any): Observable<any> {
    return this.http.get(`${this.baseUrl}/getUser/${idUser}`);
  }

  getAllUsers(): Observable<any> {
    // return this.http.get<Book[]>(`${this.baseUrl}/allBooks`).pipe(map((response) => {
    //   return response.json();
    // }));
    return this.http.get(`${this.baseUrl}/allUsers`);
  }

  getBooksByUser(idUser: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/getBooksByUser/${idUser}`);
  }

  // getUserBymail(mail : string): Observable<any>{
  //   return this.http.get(`${this.baseUrl}/mail/${mail}`)
  // }

  createUser(user: UserDefinition): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, user);
  }

  updateUser(idUser: number, user: UserDefinition): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${idUser}`, user);
  }

  deleteUser(idUser: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${idUser}`);
  }
}
