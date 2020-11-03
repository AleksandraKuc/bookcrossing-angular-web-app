import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {CommonModule} from "@angular/common";

import { BookDetailsComponent } from "./book-details/book-details.component";
import { SharedModule } from "../shared/shared.module";
import { BooksListComponent } from './books-list/books-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { BooksAddModifyComponent } from './books-add-modify/books-add-modify.component';
import { BooksLayoutComponent } from './books-layout/books-layout.component';
import { BooksEntryModule } from "./books-entry.module";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BooksEntryModule,
    SharedModule.forRoot(),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  declarations: [
    BookDetailsComponent,
    BooksAddModifyComponent,
    BooksListComponent,
    BooksLayoutComponent,
  ],
})
export class BooksModule {}
