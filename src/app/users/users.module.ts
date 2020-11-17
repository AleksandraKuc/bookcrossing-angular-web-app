import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { SharedModule } from "../shared/shared.module";
import { UserDetailsComponent } from './user-details/user-details.component';
import { UsersLayoutComponent } from './users-layout/users-layout.component';
import { UsersEntryModule } from "./users-entry.module";
import { UsersAddModifyComponent } from './users-add-modify/users-add-modify.component';
import { UsersListComponent } from './users-list/users-list.component';
import { BooksModule } from "../books/books.module";
import { UserResetPasswordComponent } from './user-reset-password/user-reset-password.component';
import {ReportsModule} from "../reports/reports.module";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UsersEntryModule,
    SharedModule.forRoot(),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    BooksModule,
  ],
  declarations: [
    UserDetailsComponent,
    UsersLayoutComponent,
    UsersAddModifyComponent,
    UsersListComponent,
    UserResetPasswordComponent,
  ],
})
export class UsersModule {}
