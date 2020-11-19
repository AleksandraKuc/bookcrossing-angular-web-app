import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserDefinition} from "../models/user-definition.model";
import {environment} from "../../../environments/environment";
import {TokenStorageService} from "../../shared/helpers/services/token-storage.service";

@Injectable({
  providedIn: 'root'
})
export class ConversationsService {

  constructor(private http: HttpClient,
              private tokenStorage: TokenStorageService) {}

  getConversations(): Observable<any> {
    let username = this.tokenStorage.getUsername();
    return this.http.get(`${environment.apiUrl}/conversation/getByUser/${username}`);
  }

  getConversationByUsers(recipient: string): Observable<any> {
    let username = this.tokenStorage.getUsername();
    return this.http.get(`${environment.apiUrl}/conversation/byUsers/${username}/${recipient}`);
  }

  getMessages(conversationId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/message/get/${conversationId}`);
  }

  getLastMessage(conversationId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/message/getlast/${conversationId}`);
  }

  sendMessage(message: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/message/create`, message);
  }

  createConversation(recipientName: String): Observable<any> {
    let username = this.tokenStorage.getUsername();
    return this.http.post(`${environment.apiUrl}/conversation/create/${username}/${recipientName}`, null);
  }

  deleteConversation(conversationId: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/conversation/delete/${conversationId}`);
  }

  checkIfExists(recipientName: string): Observable<any> {
    let username = this.tokenStorage.getUsername();
    return this.http.get(`${environment.apiUrl}/conversation/exists/${username}/${recipientName}`);
  }

}
