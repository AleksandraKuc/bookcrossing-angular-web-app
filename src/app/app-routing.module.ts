import { NgModule } from '@angular/core';
import { RouterModule, Routes} from "@angular/router";
import {MainPageComponent} from "./main-page/main-page.component";
import {AboutBookcrossingComponent} from "./about-bookcrossing/about-bookcrossing.component";
import {ContactComponent} from "./contact/contact.component";
import {AuthGuard} from "./shared/helpers/auth.guard";

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const booksModule = () => import('./books/books.module').then(x => x.BooksModule);
const usersModule = () => import('./users/users.module').then(x => x.UsersModule);
const conversationsModule = () => import('./conversations/conversations.module').then(x => x.ConversationsModule);

const ROUTES: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'account', loadChildren: accountModule },
  { path: 'users', loadChildren: usersModule },
  { path: 'books', loadChildren: booksModule },
  { path: 'conversations', loadChildren: conversationsModule },
  { path: 'reset-password', component: MainPageComponent, canActivate: [ AuthGuard ] },
  { path: 'about', component: AboutBookcrossingComponent },
  { path: 'contact', component: ContactComponent },

  { path: '**', redirectTo: '' },
]

@NgModule({
  imports: [ RouterModule.forRoot(ROUTES, {
    onSameUrlNavigation: 'reload',
  }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
