import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from '@angular/core';

import { AuthLoginInfo } from "../../shared/models/login-info";
import { AuthService } from "../../shared/helpers/services/auth.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { TokenStorageService } from "../../shared/helpers/services/token-storage.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    }
  );
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  registerMessage = '';
  returnUrl: string;
  roles: string[] = [];
  private loginInfo: AuthLoginInfo;

  constructor(private authService: AuthService,
              private tokenStorage: TokenStorageService,
              protected router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.registerMessage = this.route.snapshot.queryParams['message'] || '';
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getAuthorities();
    }
  }

  get returnRegisterMessage(){
    return this.registerMessage === '' ? null : this.registerMessage;
  }

  onSubmit() {

    this.loginInfo = new AuthLoginInfo(
      this.form.get('username').value,
      this.form.get('password').value);

    this.authService.attemptAuth(this.loginInfo).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUsername(data.username);
        this.tokenStorage.saveAuthorities(data.authorities);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getAuthorities();
        this.router.navigate([this.returnUrl]).then( _ => {
          this.reloadPage();
        });
      },
      error => {
        console.log(error);
        this.errorMessage = error.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage() {
    window.location.reload();
  }

}
