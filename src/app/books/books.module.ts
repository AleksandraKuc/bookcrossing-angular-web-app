import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { BookDetailsComponent } from "./book-details/book-details.component";
import { SharedModule } from "../shared/shared.module";
import { BooksListComponent } from './books-list/books-list.component';
import { BooksAddModifyComponent } from './books-add-modify/books-add-modify.component';
import { BooksLayoutComponent } from './books-layout/books-layout.component';
import { BooksEntryModule } from "./books-entry.module";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BooksEntryModule,
    SharedModule.forRoot(),
    ReactiveFormsModule,
  ],
  declarations: [
    BookDetailsComponent,
    BooksAddModifyComponent,
    BooksListComponent,
    BooksLayoutComponent,
  ],
  exports: [
    BooksListComponent
  ]
})
export class BooksModule {}
