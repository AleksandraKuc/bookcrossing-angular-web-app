import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";

import {environment} from "../../../environments/environment";
import {UserDefinition} from "../models/user-definition.model";

@Injectable({providedIn: 'root'})
export class AccountService {
  private userSubject: BehaviorSubject<UserDefinition>;
  public user: Observable<UserDefinition>;

  constructor(private router: Router,
              private http: HttpClient) {
    this.userSubject = new BehaviorSubject<UserDefinition>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): UserDefinition {
    return this.userSubject.value;
  }

  login(username, password) {
    return this.http.post<UserDefinition>(`${environment.apiUrl}/user/authenticate`, { username, password })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }));
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/account/login']);
  }

  register(user: UserDefinition) {
    return this.http.post(`${environment.apiUrl}/user/create`, user);
  }

  update(id, params) {
    return this.http.put(`${environment.apiUrl}/user/update/${id}`, params)
      .pipe(map(x => {
        // update stored user if the logged in user updated their own record
        if (id === this.userValue.id) {
          // update local storage
          const user = { ...this.userValue, ...params };
          localStorage.setItem('user', JSON.stringify(user));

          // publish updated user to subscribers
          this.userSubject.next(user);
        }
        return x;
      }));
  }

  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/user/delete/${id}`)
      .pipe(map(x => {
        // auto logout if the logged in user deleted their own record
        if (id === this.userValue.id) {
          this.logout();
        }
        return x;
      }));
  }
}
