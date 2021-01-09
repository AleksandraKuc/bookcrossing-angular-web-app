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
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";
import {DeleteConfirmationComponent} from "../../shared/components/delete-confirmation/delete-confirmation.component";

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
              protected snackBar: MatSnackBar,
              protected dialog: MatDialog) {
    this.username = this.route.snapshot.paramMap.get('username');
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
          this.openDeletedSnackBar();
          this.logout();
          this.router.navigate([`/`]);
        }
      );
    } else {
      this.userService.deleteAccount(this.username).subscribe(
        result => {
          this.openDeletedSnackBar();
          this.router.navigate(['/users']);
        }
      );
    }
  }

  openDeleteDialog() {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      data: {
        title: this.isProfileView() ? `delete account` : `delete ${this.form.get('username').value} user`,
        button: `Delete`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteAccount();
      }
    });
  }

  openDeletedSnackBar(): void {
    let config = new MatSnackBarConfig();
    config.duration = 5000;
    let message = "Account deleted";
    this.snackBar.open(message, "x", config);
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
                this.router.navigate([`conversations`],
                  { state: { conversationId: conversation.id_conversation, username: this.form.get('username').value } });
            })
          } else {
            this.router.navigate([`conversations`], { state: { username: this.form.get('username').value } });
          }
    })
  }

  changeStatus(blocked: boolean): void {
    this.userService.changeStatus(this.username).subscribe( user => {
      this.openChangeStatusSnackBar(blocked);
      this.setFormValues(user);
      this.user = user;
    })
  }

  openChangeStatusDialog(blocked: boolean) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      data: {
        title: blocked ? `block ${this.form.get('username').value}` : `unblock ${this.form.get('username').value}`,
        button: blocked ? `Block` : `Unblock`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.changeStatus(blocked);
      }
    });
  }

  openChangeStatusSnackBar(blocked: boolean): void {
    let config = new MatSnackBarConfig();
    config.duration = 5000;
    let message = blocked ? "Account blocked" : "Account unblocked";
    this.snackBar.open(message, "x", config);
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
    dialogConfig.width = '500px';
    dialogConfig.minWidth = 'fit-content';
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
    dialogConfig.width = '600px';
    dialogConfig.minWidth = 'fit-content';

    this.dialog.open(UserResetPasswordComponent, dialogConfig);
  }
}
