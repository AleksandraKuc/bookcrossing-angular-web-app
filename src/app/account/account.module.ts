import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { AccountEntryModule } from "./account-entry.module";
import { AccountLayoutComponent } from './account-layout/account-layout.component';
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from './register/register.component';
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AccountEntryModule,
    FormsModule,
    MatCardModule,
    SharedModule,
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    AccountLayoutComponent,
  ]
})
export class AccountModule { }
