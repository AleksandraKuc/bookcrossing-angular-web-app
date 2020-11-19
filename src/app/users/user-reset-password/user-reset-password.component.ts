import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { UsersService } from "../../core/services/users.service";
import {TokenStorageService} from "../../shared/helpers/services/token-storage.service";

@Component({
  selector: 'app-user-reset-password',
  templateUrl: './user-reset-password.component.html',
  styleUrls: ['./user-reset-password.component.css']
})
export class UserResetPasswordComponent implements OnInit {

  private passRegex = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$";

  currentPassword: FormControl = new FormControl('', [Validators.required]);
  // currentPassword: FormControl = new FormControl('', [Validators.required, Validators.pattern(this.passRegex)]);
  newPassword: FormControl = new FormControl('', [Validators.required, Validators.pattern(this.passRegex)]);
  confirmPassword: FormControl = new FormControl('', [Validators.required, Validators.pattern(this.passRegex)]);

  isSignUpFailed = false;
  errorMessage = '';

  constructor(protected usersService: UsersService,
              protected router: Router,
              protected tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
  }

  onSubmit(){
    if (this.equalsPasswords() && this.newPassword.valid) {

      this.usersService.resetPassword(this.currentPassword.value, this.newPassword.value).subscribe(
        data => {
          this.tokenStorage.saveToken(data.accessToken);
          this.tokenStorage.saveUsername(data.username);
          this.tokenStorage.saveAuthorities(data.authorities);

          this.isSignUpFailed = false;
          this.router.navigate(['/users/profile']);
        },
        error => {
          this.errorMessage = error.error.message;
          this.isSignUpFailed = true;
        })
    } else {
      this.errorMessage = "Passwords are not equal!";
      this.isSignUpFailed = true;
    }
  }

  equalsPasswords(): boolean{
    return this.newPassword.value === this.confirmPassword.value;
  }

}
