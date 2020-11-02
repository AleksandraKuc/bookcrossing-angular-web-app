import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  errorMessage: string;
  isPasswordHidden: boolean = true;

  constructor(protected fb: FormBuilder,
              protected router: Router,
              // protected authService: AuthService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', Validators.required],
    });

  }

  showOrHidePassword() {
    this.isPasswordHidden = !this.isPasswordHidden;
  }

  login(): void {
    this.errorMessage = '';
    // ReactiveFormHelper.markControlsTreeAsTouched(this.form);
    if (!this.form.valid) {
      return;
    }
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

  protected navigateAfterLoggedIn(): void {
    const redirectUrl = localStorage.getItem('redirectUrl') || '/badges';
    this.router
      .navigate([redirectUrl])
      .then(() => localStorage.removeItem('redirectUrl'));
  }
}
