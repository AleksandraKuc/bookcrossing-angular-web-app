import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';

import { BooksListDataSource } from './books-list-datasource';
import { BookDefinition } from "../../core/models/book-definition.model";
import { BooksService } from "../../core/services/books.service";

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.css']
})
export class BooksListComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<BookDefinition>;
  dataSource = new BooksListDataSource();

  viewType: string;

  displayedColumns = ['id', 'title', 'author', 'category', 'description'];

  constructor(private booksService: BooksService,
              private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe( data => {
      this.viewType = data.type;
    })
    this.booksService.getAllBooks().subscribe(response => {
      this.dataSource.data = response;
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  getDetailsLink(id: any) {
    return `details/${encodeURIComponent(id)}`;
  }
}
