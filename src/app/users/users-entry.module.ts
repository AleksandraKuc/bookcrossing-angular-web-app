import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";

import {UserDetailsComponent} from "./user-details/user-details.component";
import {UsersLayoutComponent} from "./users-layout/users-layout.component";
import {UsersAddModifyComponent} from "./users-add-modify/users-add-modify.component";
import {UsersListComponent} from "./users-list/users-list.component";
import {AuthGuard} from "../shared/helpers/auth.guard";

const USERS_ROUTES: Routes = [
  {
    path: '', component: UsersLayoutComponent,
    children: [
      { path: '', component: UsersListComponent },
      { path: 'details/:id', component: UserDetailsComponent },
      { path: 'profile', component: UserDetailsComponent, canActivate: [ AuthGuard ] },
      { path: 'edit', component: UsersAddModifyComponent, canActivate: [ AuthGuard ] },
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(USERS_ROUTES) ],
  exports: [ RouterModule ],
})
export class UsersEntryModule {}



