import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { AuthGuard } from "../shared/helpers/auth.guard";
import { UserDetailsComponent } from "./user-details/user-details.component";
import { UsersLayoutComponent } from "./users-layout/users-layout.component";
import { UsersAddModifyComponent } from "./users-add-modify/users-add-modify.component";
import { UsersListComponent } from "./users-list/users-list.component";
import { UserResetPasswordComponent } from "./user-reset-password/user-reset-password.component";

const USERS_ROUTES: Routes = [
  {
    path: '', component: UsersLayoutComponent,
    children: [
      { path: '', component: UsersListComponent },
      { path: 'details/:username', component: UserDetailsComponent },
      { path: 'profile', component: UserDetailsComponent, canActivate: [ AuthGuard ] },
      { path: 'edit', component: UsersAddModifyComponent, canActivate: [ AuthGuard ] },
      { path: 'change-password', component: UserResetPasswordComponent, canActivate: [ AuthGuard ] },
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(USERS_ROUTES) ],
  exports: [ RouterModule ],
})
export class UsersEntryModule {}



