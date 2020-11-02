import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {first} from "rxjs/operators";
import {UsersService} from "../../core/services/users.service";

@Component({
  selector: 'app-users-add-modify',
  templateUrl: './users-add-modify.component.html',
  styleUrls: ['./users-add-modify.component.css']
})
export class UsersAddModifyComponent implements OnInit {

  form: FormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  hidePassword: boolean = true;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    // password not required in edit mode
    const passwordValidators = [Validators.minLength(6)];
    if (this.isAddMode) {
      passwordValidators.push(Validators.required);
    }

    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', passwordValidators]
    });

    if (!this.isAddMode) {
      this.usersService.getUser(this.id)
        .pipe(first())
        .subscribe(x => {
          this.f.firstName.setValue(x.firstName);
          this.f.lastName.setValue(x.lastName);
          this.f.username.setValue(x.username);
        });
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    if (this.isAddMode) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  private createUser() {
    console.log(this.form.value);
    // this.usersService.createUser(this.form.value)
    //   .pipe(first())
    //   .subscribe(
    //     data => {
    //       this.router.navigate(['.', { relativeTo: this.route }]);
    //     },
    //     error => {
    //       this.loading = false;
    //     });
  }

  private updateUser() {
    console.log('update');
    console.log(this.form.value);
    // this.usersService.updateUser(Number(this.id), this.form.value)
    //   .pipe(first())
    //   .subscribe(
    //     data => {
    //       this.router.navigate(['..', { relativeTo: this.route }]);
    //     },
    //     error => {
    //       this.loading = false;
    //     });
  }

  getErrorMessage() {
    if (this.form.get('email').hasError('required')) {
      return 'You must enter a value';
    }

    return this.form.get('email').hasError('email') ? 'Not a valid email' : '';
  }
}
