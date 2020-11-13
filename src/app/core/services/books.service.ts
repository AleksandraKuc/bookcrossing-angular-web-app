import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";
import {AuthService} from "../../shared/helpers/auth.service";
import {TokenStorageService} from "../../shared/helpers/token-storage.service";

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  private baseUrl = 'http://localhost:8080/api/book';
  private favBooksUrl = 'http://localhost:8080/api/favouriteBooks';

  constructor(private http: HttpClient,
              private tokenStorage: TokenStorageService) {}

  getBook(idBook : any): Observable<any> {
    return this.http.get(`${this.baseUrl}/id/${idBook}`);
  }

  getAllBooks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`);
  }

  getUserBooks(): Observable<any> {
    let username = this.tokenStorage.getUsername();
    return this.http.get(`${this.baseUrl}/user/${username}`);
  }

  getFavBooks(): Observable<any> {
    let username = this.tokenStorage.getUsername();
    return this.http.get(`${this.baseUrl}/fav/${username}`);
  }

  // getUserBymail(mail : string): Observable<any>{
  //   return this.http.get(`${this.baseUrl}/mail/${mail}`)
  // }

  createBook(idUser: number, book: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create/${idUser}`, book);
  }

  updateBook(idBook: number, book: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${idBook}`, book);
  }

  updateBookHired(idBook: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/hired/${idBook}`, null);
  }

  deleteBook(idBook: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${idBook}`);
  }

  addToFavourites(idBook: number): Observable<any> {
    let username = this.tokenStorage.getUsername();
    return this.http.post(`${this.favBooksUrl}/create/${username}/${idBook}`, null);
  }

  removeFromFavourites(idBook: number): Observable<any> {
    let username = this.tokenStorage.getUsername();
    return this.http.delete(`${this.favBooksUrl}/delete/${username}/${idBook}`);
  }

  checkIfFavourite(idBook: number): Observable<any> {
    let username = this.tokenStorage.getUsername();
    return this.http.get(`${this.favBooksUrl}/check/${username}/${idBook}`);
  }
}
