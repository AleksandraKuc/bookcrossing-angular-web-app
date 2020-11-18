import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';

import { BooksListDataSource } from './books-list-datasource';
import { BookDefinition } from "../../core/models/book-definition.model";
import { BooksService } from "../../core/services/books.service";
import { TokenStorageService } from "../../shared/helpers/services/token-storage.service";

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.css']
})
export class BooksListComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator; //co robi static?
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<BookDefinition>;
  dataSource = new BooksListDataSource();

  listIsFavourites: Array<{ bookId: number, status: boolean }> = new Array<{bookId: number; status: boolean}>();

  displayedColumns = ['id', 'title', 'author', 'category', 'description'];

  @Input() listMode: string = '';
  @Input() isAccount: boolean = false;
  @Input() username: string = '';

  constructor(private booksService: BooksService,
              private activatedRoute: ActivatedRoute,
              private tokenStorage: TokenStorageService,
              protected router: Router) {}

  ngOnInit() {
    if (this.listMode === '') {
      this.activatedRoute.data.subscribe( data => {
        this.listMode = data.type;
        this.setDisplayedColumns();
        this.getBooks();
      })
    } else {
      this.setDisplayedColumns();
      this.getBooks();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  getDetailsLink(id: any) {
    return `/books/details/${encodeURIComponent(id)}`;
  }

  setDisplayedColumns(): void {
    if (this.listMode !== 'handOver' && this.isLoggedIn() && (this.listMode !== 'own' && !this.username)){
      this.displayedColumns = ['id', 'title', 'author', 'category', 'description', 'favourites'];
    } else if (this.listMode === 'handOver' && this.isLoggedIn()) {
      this.displayedColumns = ['id', 'title', 'author', 'category', 'description', 'handOver'];
    }
  }

  addToFavourites(id: number): void {
    this.booksService.addToFavourites(id).subscribe( () => {
      this.setFavouritesList(id, true);
    });
  }

  removeFromFavourites(id: number): void {
    this.booksService.removeFromFavourites(id).subscribe(() => {
      if (this.listMode === 'fav') {
        let index = this.dataSource.data.findIndex( _book => _book.id_book === id);
        this.dataSource.data.splice(index, 1);
        this.refreshTable(this.dataSource.data);
      }
      this.setFavouritesList(id, false);
    })
  }

  selectToHandOver(id: number): void {
    this.router.navigate(['/users'], { state: { bookId: id } } );
  }

  addNewBook() {
    this.router.navigate(['/books/add'] );
  }

  refreshTable(data: BookDefinition[]){
    this.dataSource = new BooksListDataSource();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.data = data;
    this.table.dataSource = this.dataSource;
  }

  getBooks() {
    switch(this.listMode) {
      case 'all': { this.getAll(); break; }
      case 'fav': { this.getFavBooks(); break; }
      case 'my': { this.getMyBooks(); break; }
      case 'handOver': { this.getMyBooks(); break; }
      case 'own': { this.getOwnedByUser(); break; }
      default : { this.getAll(); break; }
    }
  }

  getAll(): void {
    this.booksService.getAllBooks().subscribe(response => {
      this.dataSource.data = response;
      if (this.tokenStorage.getUsername()){
        this.getFavourites();
      }
    });
  }

  getMyBooks(): void {
    this.booksService.getUserOwnedBooks().subscribe(response => {
      this.dataSource.data = response;
      this.getFavourites();
    });
  }

  getFavBooks(): void {
    this.booksService.getFavBooks().subscribe(response => {
      this.dataSource.data = response;
      if (this.tokenStorage.getUsername()){
        this.getFavourites();
      }
    });
  }

  getOwnedByUser(): void {
    this.booksService.getUserOwnedBooks(this.username).subscribe(response => {
      this.dataSource.data = response;
      if (this.tokenStorage.getUsername()){
        this.getFavourites();
      }
    });
  }

  getFavourites(): void {
    this.dataSource.data.forEach( book => {
      this.booksService.checkIfFavourite(book.id_book).subscribe( data => {
        this.listIsFavourites.push({bookId: book.id_book, status: data});
      })
    })
  }

  setFavouritesList(id: number, status: boolean): void {
    this.listIsFavourites.map( book => {
      if (book.bookId === id) {
        book.status = status;
      }
    });
  }

  checkIsFavourite(id: number): boolean {
    return (this.listIsFavourites.find( element => element.bookId === id)).status;
  }

  isLoggedIn(): boolean {
    return !!this.tokenStorage.getUsername();
  }

  get showAddButton():boolean {
    return !this.isAccount;
  }
}
