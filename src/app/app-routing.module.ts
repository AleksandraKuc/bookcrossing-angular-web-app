import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
// import {BooksTableComponent} from "./books/books-table/books-table.component";
import {BookDetailsComponent} from "./books/book-details/book-details.component";
import {MainPageComponent} from "./main-page/main-page.component";
import {AboutBookcrossingComponent} from "./about-bookcrossing/about-bookcrossing.component";
import {ContactComponent} from "./contact/contact.component";
// import {UsersTableComponent} from "./users/users-table/users-table.component";
// import {UserDetailsComponent} from "./users/user-details/user-details.component";
import {BooksCreateComponent} from "./books/books-create/books-create.component";
import {BooksListComponent} from "./books/books-list/books-list.component";
import {UsersListComponent} from "./users/users-list/users-list.component";

const ROUTES: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'login', component: MainPageComponent },
  { path: 'reset-password', component: MainPageComponent },
  { path: 'setting', component: MainPageComponent },
  { path: 'books', component: BooksListComponent }, // w formacie allBooks
  // { path: 'books/favourites', component: BooksTableComponent }, // w formacie favBooks
  { path: 'books/details/:id', component: BookDetailsComponent },
  { path: 'users', component: UsersListComponent },
  // { path: 'users/profile/:id', component: UserDetailsComponent },
  { path: 'about', component: AboutBookcrossingComponent },
  { path: 'messages', component: MainPageComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'addBook', component: BooksCreateComponent },
  // { path: 'book/handOver', component: BooksTableComponent }, //w formacie myBooks

  { path: '**', redirectTo: '' },
]

@NgModule({
  imports: [ RouterModule.forRoot(ROUTES, {
    onSameUrlNavigation: 'reload',
  }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
