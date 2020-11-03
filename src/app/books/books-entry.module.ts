import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";

import {BookDetailsComponent} from "./book-details/book-details.component";
import {BooksListComponent} from "./books-list/books-list.component";
import {BooksAddModifyComponent} from "./books-add-modify/books-add-modify.component";
import {BooksLayoutComponent} from "./books-layout/books-layout.component";
import {MainPageComponent} from "../main-page/main-page.component";
import {AuthGuard} from "../shared/helpers/auth.guard";

const BOOKS_ROUTES: Routes = [
  {
    path: '', component: BooksLayoutComponent,
    children: [
      { path: '', component: BooksListComponent, data: { type: "all"} },
      { path: 'favourites', component: BooksListComponent, data: { type: "fav"}, canActivate: [ AuthGuard ] },
      { path: 'myBooks', component: BooksListComponent, data: { type: "my"}, canActivate: [ AuthGuard ] },
      { path: 'add', component: BooksAddModifyComponent, canActivate: [ AuthGuard ] },
      { path: 'details/:id', component: BookDetailsComponent },
      { path: 'edit/:id', component: BooksAddModifyComponent, canActivate: [ AuthGuard ] },
      { path: 'handOver', component: BooksListComponent, data: { type: "handOver"}, canActivate: [ AuthGuard ] }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(BOOKS_ROUTES) ],
  exports: [ RouterModule ],
})
export class BooksEntryModule {}
