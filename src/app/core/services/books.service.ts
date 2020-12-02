import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";

import { Observable } from "rxjs";
import {AuthService} from "../../shared/helpers/services/auth.service";
import {TokenStorageService} from "../../shared/helpers/services/token-storage.service";
import {BookDefinition} from "../models/book-definition.model";

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  private baseUrl = 'http://localhost:8080/api/book';
  private favBooksUrl = 'http://localhost:8080/api/favouriteBooks';
  private historyUserUrl = 'http://localhost:8080/api/historyUsers';

  constructor(private http: HttpClient,
              private tokenStorage: TokenStorageService) {}

  getBook(idBook : any): Observable<any> {
    return this.http.get(`${this.baseUrl}/id/${idBook}`);
  }

  getAllBooks(): Observable<any> {
    const params = new HttpParams()
      .set('title', '')
      .set('category', '')
      .set('maxResults', '')
      .set('page', '')
      .set('username', null);
    return this.http.get(`${this.baseUrl}/all`, {params});
  }

  getUserOwnedBooks(username?: string): Observable<any> {
    username = username ? username : this.tokenStorage.getUsername();
    return this.http.get(`${this.baseUrl}/user/${username}`);
  }

  getUserAddedBooks(username?: string): Observable<any> {
    username = username ? username : this.tokenStorage.getUsername();
    return this.http.get(`${this.baseUrl}/addedByUser/${username}`);
  }

  getFavBooks(): Observable<any> {
    let username = this.tokenStorage.getUsername();
    const params = new HttpParams()
      .set('title', '')
      .set('category', '')
      .set('maxResults', '')
      .set('page', '');
    return this.http.get(`${this.baseUrl}/fav/${username}`, {params});
  }

  createBook(book: any): Observable<any> {
    let username = this.tokenStorage.getUsername();
    return this.http.post(`${this.baseUrl}/create/${username}`, book);
  }

  updateBook(book: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`, book);
  }

  updateBookHired(idBook: number, username: string): Observable<any> {
    return this.http.put(`${this.historyUserUrl}/update/${idBook}/${username}`, null);
  }

  deleteBook(idBook: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${idBook}`);
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
