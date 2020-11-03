import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AccountEntryModule } from "./account-entry.module";
import { AccountLayoutComponent } from './account-layout/account-layout.component';
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from './register/register.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AccountEntryModule,
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    AccountLayoutComponent,
  ]
})
export class AccountModule { }
