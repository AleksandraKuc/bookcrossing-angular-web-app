import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { AccountService } from "../../core/services/account.service";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  errorMessage: string;
  isPasswordHidden: boolean = true;

  constructor(protected formBuilder: FormBuilder,
              private route: ActivatedRoute,
              protected router: Router,
              private accountService: AccountService,
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.form.controls; }

  showOrHidePassword() {
    this.isPasswordHidden = !this.isPasswordHidden;
  }

  login(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (!this.form.valid) {
      return;
    }

    this.loading = true;
    this.accountService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.loading = false;
        });
    // this.authService
    //   .login(
    //     this.form.get('login').value,
    //     this.form.get('password').value
    //   )
    //   .subscribe(
    //     _ => {
    //       this.navigateAfterLoggedIn();
    //     },
    //     response => {
    //       this.setErrorsOnLoginFields();
    //       this.setErrorMessage(response);
    //     }
    //   );
  }

  cleanErrorOnLoginField(fieldLabel: string): void {
    if (this.form.get(fieldLabel).hasError('wrongValue')) {
      this.form.get(fieldLabel).setErrors(null);
    }
  }

  protected setErrorsOnLoginFields() {
    const wrongValueError = {
      wrongValue: true,
    };
    this.form.get('login').setErrors(wrongValueError);
    this.form.get('password').setErrors(wrongValueError);
  }

  protected setErrorMessage(response: any) {
    if (response.error.description) {
      this.errorMessage = response.error.description;
    }
  }

}
