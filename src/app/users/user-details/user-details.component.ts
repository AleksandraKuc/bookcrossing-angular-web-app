import { Component, OnInit } from '@angular/core';
import {UserDefinition} from "../../core/models/user-definition.model";
import {UsersService} from "../../core/services/users.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup} from "@angular/forms";
import {TokenStorageService} from "../../shared/helpers/services/token-storage.service";
import {ConversationsService} from "../../core/services/conversations.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ReportItemComponent} from "../../reports/report-item/report-item.component";
import {UserResetPasswordComponent} from "../user-reset-password/user-reset-password.component";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  form: FormGroup;
  username: string;
  protected user: UserDefinition;

  constructor(protected userService: UsersService,
              protected conversationsService: ConversationsService,
              protected route: ActivatedRoute,
              protected activatedRoute: ActivatedRoute,
              protected router: Router,
              protected tokenStorage: TokenStorageService,
              private dialog: MatDialog) {
    this.username = this.route.snapshot.paramMap.get('id');
    this.form = this.generateForm();
    this.userService.getUser(this.username).subscribe( user => {
      this.setFormValues(user);
      this.user = user;
    });
  }

  ngOnInit(): void { }

  generateForm(): FormGroup {
    return new FormGroup({
      id: new FormControl(''),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      username: new FormControl(''),
      email: new FormControl(''),
      phoneNumber: new FormControl(''),
      city: new FormControl(''),
      province: new FormControl(''),
      startDate: new FormControl(''),
      addedBooks: new FormControl(''),
    })
  }

  setFormValues(user: UserDefinition): void {
    this.form.get('id').setValue(user.id);
    this.form.get('firstName').setValue(user.firstName);
    this.form.get('lastName').setValue(user.lastName);
    this.form.get('username').setValue(user.username);
    this.form.get('email').setValue(user.email);
    this.form.get('phoneNumber').setValue(user.phoneNumber);
    this.form.get('city').setValue(user.city);
    this.form.get('province').setValue(user.province);
    this.form.get('startDate').setValue(user.startDate);
    this.form.get('addedBooks').setValue(user.addedBooks);
  }

  editProfile(): void {
    this.router.navigate(['users/edit']);
  }

  deleteAccount(): void {
    if (this.isProfileView()) {
      this.userService.deleteAccount().subscribe(
        response => {
          this.logout();

          this.router.navigate([`/`]);
        }
      );
    } else {
      this.userService.deleteAccount(this.username).subscribe(
        result => {
          this.router.navigate(['/users']);
        }
      );
    }
  }

  logout(): void {
    this.tokenStorage.signOut();
    window.location.reload();
  }

  sendMessage() {
    this.conversationsService.checkIfExists(this.form.get('username').value)
      .subscribe(
        response => {
          if (!response) {
            this.conversationsService.createConversation(this.form.get('username').value)
              .subscribe( conversation => {
                this.router.navigate([`conversations/${this.form.get('username').value}`],
                  { state: { conversationId: conversation.id_conversation } });
            })
          } else {
            this.router.navigate([`conversations/${this.form.get('username').value}`]);
          }
    })
  }

  changeStatus(): void {
    this.userService.changeStatus(this.username).subscribe( user => {
      this.setFormValues(user);
      this.user = user;
    })
  }

  isProfileView(): boolean {
    return !this.username;
  }

  isLoggedIn(): boolean {
    return !!this.tokenStorage.getUsername();
  }

  isAdmin(): boolean {
    return this.tokenStorage.getAuthorities()[0] === "ROLE_ADMIN";
  }

  isBlocked(): boolean {
    return this.user?.accountStatus === 1;
  }

  get phoneNumber() {
    return this.form.get('phoneNumber').value === 0 ? '---' : this.form.get('phoneNumber').value;
  }

  reportUser(): void {
    this.openReportDialog();
  }

  protected openReportDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      username: this.username
    };

    this.dialog.open(ReportItemComponent, dialogConfig);
  }

  resetPassword(): void {
    this.openResetPasswordDialog();
  }

  protected openResetPasswordDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    this.dialog.open(UserResetPasswordComponent, dialogConfig);
  }
}
