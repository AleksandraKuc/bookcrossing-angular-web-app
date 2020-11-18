import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';

import { BooksListDataSource } from './books-list-datasource';
import { BookDefinition } from "../../core/models/book-definition.model";
import { BooksService } from "../../core/services/books.service";
import { TokenStorageService } from "../../shared/helpers/services/token-storage.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {switchMap, take} from "rxjs/operators";

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.css']
})
export class BooksListComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator; //co robi static?
  @ViewChild(MatSort) sort: MatSort;

  // @ViewChild(MatTable, { static: true }) table: MatTable<BookDefinition>;
  // dataSource = new BooksListDataSource();
  dataSource = new MatTableDataSource<BookDefinition>();

  listIsFavourites: Array<{ bookId: number, status: boolean }> = new Array<{bookId: number; status: boolean}>();

  displayedColumns = ['id', 'title', 'author', 'category', 'description'];

  @Input() listMode: string = '';
  @Input() isAccount: boolean = false;
  @Input() username: Observable<string> = null;

  public searchForm: FormGroup;
  public title = '';
  public author = '';
  public category = '';

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
    this.searchFormInit();
    // this.dataSource.filterPredicate = this.getFilterPredicate;

    // this.dataSource.filterPredicate =
    //   (data: BookDefinition, filtersJson: string) => {
    //     console.log(data);
    //     console.log(filtersJson);
    //     return true;
    //   };
  }

  ngAfterViewInit() {
    // this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    // this.table.dataSource = this.dataSource;
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

  searchFormInit() {
    this.searchForm = new FormGroup({
      title: new FormControl('', Validators.pattern('^[a-zA-Z ]+$')),
      author: new FormControl('', Validators.pattern('^[a-zA-Z ]+$')),
      category: new FormControl('', Validators.pattern('^[a-zA-Z ]+$'))
    });
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
    // this.dataSource = new BooksListDataSource();
    // this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource = new MatTableDataSource(data);
    // this.dataSource.data = data;
    // this.table.dataSource = this.dataSource;
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
      // this.dataSource.data = response;
      this.dataSource = new MatTableDataSource(response);
      if (this.tokenStorage.getUsername()){
        this.getFavourites();
      }
      this.dataSource.filterPredicate = this.getFilterPredicate;
      // this.dataSource.filterPredicate =
      //   (data: BookDefinition, filtersJson: string) => {
      //     console.log(data);
      //     console.log(filtersJson);
      //     return true;
      //   };
    });
  }

  getMyBooks(): void {
    this.booksService.getUserOwnedBooks().subscribe(response => {
      // this.dataSource.data = response;
      this.dataSource = new MatTableDataSource(response);
      this.getFavourites();
    });
  }

  getFavBooks(): void {
    this.booksService.getFavBooks().subscribe(response => {
      // this.dataSource.data = response;
      this.dataSource = new MatTableDataSource(response);
      if (this.tokenStorage.getUsername()){
        this.getFavourites();
      }
    });
  }

  getOwnedByUser(): void {
    this.username.pipe(take(1), switchMap( user =>
      this.booksService.getUserOwnedBooks(user)
    )).subscribe( response => {
      this.dataSource = new MatTableDataSource(response);
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

  /* this method well be called for each row in table  */
  getFilterPredicate = (row: BookDefinition, filters: string) => {
    console.log('filtering')
    // split string per '$' to array
    const filterArray = filters.split('$');
    const title = filterArray[0];
    const author = filterArray[1];
    const category = filterArray[2];

    const matchFilter = [];

    // Fetch data from row
    const columnTitle = row.title;
    const columnAuthor = row.author;
    const columnCategory = row.category;

    // verify fetching data by our searching values
    const customFilterTitle = columnTitle.toLowerCase().includes(title);
    const customFilterAuthor = columnAuthor.toLowerCase().includes(author);
    const customFilterCategory = columnCategory.toLowerCase().includes(category);

    // push boolean values into array
    matchFilter.push(customFilterTitle);
    matchFilter.push(customFilterAuthor);
    matchFilter.push(customFilterCategory);

    console.log(matchFilter)
    // return true if all values in array is true
    // else return false
    return matchFilter.every(Boolean);
  }

  applyFilter() {
    const title = this.searchForm.get('title').value;
    const author = this.searchForm.get('author').value;
    const category = this.searchForm.get('category').value;

    this.title = title === null ? '' : title;
    this.author = author === null ? '' : author;
    this.category = category === null ? '' : category;

    // create string of our searching values and split if by '$'
    const filterValue = this.title + '$' + this.author + '$' + this.category;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
