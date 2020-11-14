import { Component, OnInit } from '@angular/core';
import {Form, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {first} from "rxjs/operators";
import {UsersService} from "../../core/services/users.service";
import {UserDefinition} from "../../core/models/user-definition.model";
import {SignUpInfo} from "../../shared/helpers/signup-info";

@Component({
  selector: 'app-users-add-modify',
  templateUrl: './users-add-modify.component.html',
  styleUrls: ['./users-add-modify.component.css']
})
export class UsersAddModifyComponent implements OnInit {

  form: FormGroup;
  loading = false;
  submitted = false;
  hidePassword: boolean = true;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.form = this.generateForm();

    this.usersService.getUser()
      .subscribe(details => {
        this.setFormValue(details);
      });
  }

  generateForm(): FormGroup {
    return new FormGroup(
      {
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        username: new FormControl({ value: '', disabled: true }),
        email: new FormControl('', [Validators.required, Validators.email]),
        city: new FormControl('', [Validators.required]),
        province: new FormControl('', [Validators.required]),
        phoneNumber: new FormControl(0, [Validators.pattern("^[0-9]+$")]),
      },
    );
  }

  setFormValue(user: UserDefinition): void {
    this.form.get('firstName').setValue(user.firstName);
    this.form.get('lastName').setValue(user.lastName);
    this.form.get('username').setValue(user.username);
    this.form.get('email').setValue(user.email);
    this.form.get('city').setValue(user.city);
    this.form.get('province').setValue(user.province);
    this.form.get('phoneNumber').setValue(user.phoneNumber);
  }

  get f() { return this.form.controls; }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.valid) {
      this.loading = true;
      this.updateUser();
    }
  }

  private updateUser() {
    let signupInfo = new SignUpInfo(
      this.form.get('firstName').value,
      this.form.get('lastName').value,
      this.form.get('username').value,
      this.form.get('email').value,
      this.form.get('city').value,
      this.form.get('province').value,
      this.form.get('phoneNumber').value);

    this.usersService.updateUser(signupInfo)
      .subscribe(() => {
          this.router.navigate([`/users/profile`]);
        },
        error => {
          console.log(error);
          this.loading = false;
      });
  }

  cancel() {
    this.router.navigate([`/users/profile`]);
  }

  getErrorMessage() {
    if (this.form.get('email').hasError('required')) {
      return 'You must enter a value';
    }

    return this.form.get('email').hasError('email') ? 'Not a valid email' : '';
  }
}
