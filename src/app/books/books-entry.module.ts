import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";

import {BookDetailsComponent} from "./book-details/book-details.component";
import {BooksModule} from "./books.module";
import {BooksResolverService} from "./books-resolver.service";
import {BooksTableComponent} from "./books-table/books-table.component";
import {MainPageComponent} from "../main-page/main-page.component";

export const BOOKS_ROUTES: Routes = [
  {
    path: 'books',
    loadChildren: () => BooksPrimaryRoutingModule,
  },
  {
    outlet: 'modal',
    path: 'books',
    loadChildren: () => BooksModalRoutingModule,
  }
];

const PRIMARY_ROUTES: Routes = [
  {
    path: '',
    component: BooksTableComponent,
  },
  {
    path: 'details/:id',
    component: BookDetailsComponent,
    resolve: {
      details: BooksResolverService,
    }
  }
];

const MODAL_ROUTES: Routes = [
  {
    path: 'create',
    component: BookDetailsComponent, //TODO: change to correct component
  },
  {
    path: 'modify/:id',
    component: BookDetailsComponent, //TODO: change to correct component
    resolve: {
      details: BooksResolverService,
    }
  }
];

@NgModule({
  imports: [ BooksModule ],
})
export class BooksEntryModule {}

@NgModule({
  imports: [ RouterModule.forChild(PRIMARY_ROUTES) ],
})
export class BooksPrimaryRoutingModule {}

@NgModule({
  imports: [ RouterModule.forChild(MODAL_ROUTES) ],
})
export class BooksModalRoutingModule {}
