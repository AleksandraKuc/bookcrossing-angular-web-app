import { NgModule } from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { SharedModule } from "../shared/shared.module";
import { UserDetailsComponent } from './user-details/user-details.component';
import { UsersLayoutComponent } from './users-layout/users-layout.component';
import {UsersEntryModule} from "./users-entry.module";
import { UsersAddModifyComponent } from './users-add-modify/users-add-modify.component';
import { UsersListComponent } from './users-list/users-list.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UsersEntryModule,
    SharedModule.forRoot(),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  declarations: [
    UserDetailsComponent,
    UsersLayoutComponent,
    UsersAddModifyComponent,
    UsersListComponent,
  ],
})
export class UsersModule {}
