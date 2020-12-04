import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { AuthService } from "../../shared/helpers/services/auth.service";
import { SignUpInfo } from "../../shared/models/signup-info";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private passRegex = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$";

  form: FormGroup;
  confirmPassword = new FormControl('', [Validators.required, Validators.pattern(this.passRegex)]);

  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService,
              protected router: Router) { }

  ngOnInit() {
    this.form = this.generateForm();
  }

  generateForm(): FormGroup {
    return new FormGroup(
      {
        name: new FormControl('', [Validators.required]),
        lastname: new FormControl('', [Validators.required]),
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required, Validators.pattern(this.passRegex)]),
        email: new FormControl('', [Validators.required, Validators.email]),
        city: new FormControl('', [Validators.required]),
        province: new FormControl('', [Validators.required]),
        phoneNumber: new FormControl(0, [Validators.pattern("^[0-9]+$")]),
      },
    );
  }

  equalsPasswords(): boolean{
    return this.form.get('password').value === this.confirmPassword.value;
  }

  onSubmit() {
    if (this.equalsPasswords() && this.form.valid) {

      let signupInfo = new SignUpInfo(
        this.form.get('name').value,
        this.form.get('lastname').value,
        this.form.get('username').value,
        this.form.get('email').value,
        this.form.get('city').value,
        this.form.get('province').value,
        this.form.get('phoneNumber').value,
        this.form.get('password').value);

      this.authService.signUp(signupInfo).subscribe(
        data => {
          this.isSignUpFailed = false;
          this.router.navigate(['/account/login'], { queryParams: { message: "Register completed, please login"}});
        },
        error => {
          console.log(error);
          this.errorMessage = error.error.message;
          this.isSignUpFailed = true;
        }
      );
    } else {
      this.errorMessage = "Passwords are not equal!";
      this.isSignUpFailed = true;
    }
  }
}
