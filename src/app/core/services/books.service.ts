import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  private baseUrl = 'http://localhost:8080/api/book';

  constructor(private http: HttpClient) {}

  getBook(idBook : any): Observable<any> {
    return this.http.get(`${this.baseUrl}/getBook/${idBook}`);
  }

  getAllBooks(): Observable<any> {
    // return this.http.get<Book[]>(`${this.baseUrl}/allBooks`).pipe(map((response) => {
    //   return response.json();
    // }));
    return this.http.get(`${this.baseUrl}/allBooks`);
  }

  getBooksByUser(idUser: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/getBooksByUser/${idUser}`);
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
}
