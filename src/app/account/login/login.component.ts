import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";

import { AccountService } from "../../core/services/account.service";
import {first} from "rxjs/operators";
import {AuthLoginInfo} from "../../shared/helpers/login-info";
import {AuthService} from "../../shared/helpers/auth.service";
import {TokenStorageService} from "../../shared/helpers/token-storage.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: any = {};
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
      this.form.username,
      this.form.password);

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

  // form: FormGroup;
  // loading = false;
  // submitted = false;
  // returnUrl: string;
  // errorMessage: string;
  // isPasswordHidden: boolean = true;
  //
  // constructor(protected formBuilder: FormBuilder,
  //             private route: ActivatedRoute,
  //             protected router: Router,
  //             private accountService: AccountService,
  // ) { }
  //
  // ngOnInit(): void {
  //   this.form = this.formBuilder.group({
  //     username: ['', [Validators.required]],
  //     password: ['', Validators.required],
  //   });
  //
  //   this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  // }
  //
  // get f() { return this.form.controls; }
  //
  // showOrHidePassword() {
  //   this.isPasswordHidden = !this.isPasswordHidden;
  // }
  //
  // login(): void {
  //   this.submitted = true;
  //   this.errorMessage = '';
  //
  //   if (!this.form.valid) {
  //     return;
  //   }
  //
  //   this.loading = true;
  //   this.accountService.login(this.f.username.value, this.f.password.value)
  //     .pipe(first())
  //     .subscribe(
  //       data => {
  //         this.router.navigate([this.returnUrl]);
  //       },
  //       error => {
  //         this.loading = false;
  //       });
  //   // this.authService
  //   //   .login(
  //   //     this.form.get('login').value,
  //   //     this.form.get('password').value
  //   //   )
  //   //   .subscribe(
  //   //     _ => {
  //   //       this.navigateAfterLoggedIn();
  //   //     },
  //   //     response => {
  //   //       this.setErrorsOnLoginFields();
  //   //       this.setErrorMessage(response);
  //   //     }
  //   //   );
  // }
  //
  // cleanErrorOnLoginField(fieldLabel: string): void {
  //   if (this.form.get(fieldLabel).hasError('wrongValue')) {
  //     this.form.get(fieldLabel).setErrors(null);
  //   }
  // }
  //
  // protected setErrorsOnLoginFields() {
  //   const wrongValueError = {
  //     wrongValue: true,
  //   };
  //   this.form.get('login').setErrors(wrongValueError);
  //   this.form.get('password').setErrors(wrongValueError);
  // }
  //
  // protected setErrorMessage(response: any) {
  //   if (response.error.description) {
  //     this.errorMessage = response.error.description;
  //   }
  // }

}
