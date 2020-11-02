import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {CommonModule} from "@angular/common";

import { BookDetailsComponent } from "./book-details/book-details.component";
import { SharedModule } from "../shared/shared.module";
import { BooksCreateComponent } from './books-create/books-create.component';
import { BooksListComponent } from './books-list/books-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  imports: [
    RouterModule,
    SharedModule.forRoot(),
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  declarations: [
    BookDetailsComponent,
    BooksCreateComponent,
    BooksListComponent,
  ],
})
export class BooksModule {}
