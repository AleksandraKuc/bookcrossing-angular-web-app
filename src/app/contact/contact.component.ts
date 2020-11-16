import { Component, OnInit } from '@angular/core';
import {ContactDefinition} from "../core/models/contact-definition.model";
import {ContactService} from "../core/services/contact.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TokenStorageService} from "../shared/helpers/services/token-storage.service";
import {UsersService} from "../core/services/users.service";
import {UserDefinition} from "../core/models/user-definition.model";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  form: FormGroup = this.generateForm();
  userDetails: UserDefinition;
  loading = false;

  constructor(protected contactService: ContactService,
              protected usersService: UsersService,
              protected tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    this.setFormValues();
    if(this.isLoggedIn()) {
      this.usersService.getUser(this.tokenStorage.getUsername()).subscribe(
        user => {
          this.userDetails = user;
          this.form.get('name').setValue(this.userDetails.firstName + ' ' + this.userDetails.lastName);
          this.form.get('email').setValue(this.userDetails.email);
        }
      )
    }
  }

  generateForm(): FormGroup {
    return new FormGroup ({
      name: new FormControl('', Validators.required),
      title: new FormControl('', Validators.required),
      content: new FormControl('', [Validators.required, Validators.minLength(20)]),
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  setFormValues(): void {
    this.form.get('name').setValue('');
    this.form.get('title').setValue('');
    this.form.get('content').setValue('');
    this.form.get('email').setValue('');
  }

  onSubmit() {

    if (this.form.valid) {
      let contact = new ContactDefinition(
        this.form.get('name').value,
        this.form.get('title').value,
        this.form.get('content').value,
        this.form.get('email').value
      );

      this.contactService.sendEmail(contact).subscribe(
        () => {
          console.log('Email Sent successfully');
          this.reloadPage();
        },
        error => {
          console.log('could not send email')
          this.loading = false;
        });
    }
  }

  isLoggedIn(): boolean {
    return !!this.tokenStorage.getUsername();
  }

  reloadPage() {
    window.location.reload();
  }

}
