import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { BookDefinition } from "../../core/models/book-definition.model";
import { BooksService } from "../../core/services/books.service";
import { TokenStorageService } from "../../shared/helpers/services/token-storage.service";
import {Observable} from "rxjs";
import {switchMap, take} from "rxjs/operators";

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.css']
})
export class BooksListComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource<BookDefinition>();

  listIsFavourites: Array<{ bookId: number, status: boolean }> = new Array<{bookId: number; status: boolean}>();

  displayedColumns = ['title', 'author', 'description', 'isbn', 'category', 'releaseDate'];

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
              private router: Router) {}

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
    this.searchForm = this.searchFormInit();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getDetailsLink(id: any) {
    return `/books/details/${encodeURIComponent(id)}`;
  }

  searchFormInit(): FormGroup {
    return new FormGroup({
      title: new FormControl('', Validators.pattern('^[a-zA-Z ]+$')),
      author: new FormControl('', Validators.pattern('^[a-zA-Z ]+$')),
      category: new FormControl('', Validators.pattern('^[a-zA-Z ]+$'))
    });
  }

  setDisplayedColumns(): void {
    if (this.listMode !== 'handOver' && this.isLoggedIn() && (this.listMode !== 'own' && !this.username)){
      this.displayedColumns = ['title', 'author', 'description', 'isbn', 'category', 'releaseDate', 'favourites'];
    } else if (this.listMode === 'handOver' && this.isLoggedIn()) {
      this.displayedColumns = ['title', 'author', 'description', 'isbn', 'category', 'releaseDate', 'handOver'];
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
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getBooks() {
    switch(this.listMode) {
      case 'all': { this.getAll(); break; }
      case 'fav': { this.getFavBooks(); break; }
      case 'my': { this.getMyBooks(); break; }
      case 'handOver': { this.getMyBooks(); break; }
      case 'own': { this.getOwnedByUser(); break; }
      case 'added': { this.getAddedByUser(); break; }
      default : { this.getAll(); break; }
    }
  }

  setTable(response: BookDefinition[]): void {
    this.dataSource.data = response;
    this.dataSource.filterPredicate = this.getFilterPredicate;
  }

  getAll(): void {
    this.booksService.getAllBooks().subscribe(response => {
      this.setTable(response.books);
      this.setFavBooks();
    });
  }

  getMyBooks(): void {
    this.booksService.getUserOwnedBooks().subscribe(response => {
      this.setTable(response);
      this.setFavBooks();
    });
  }

  getFavBooks(): void {
    this.booksService.getFavBooks().subscribe(response => {
      this.setTable(response.books);
      this.setFavBooks();
    });
  }

  getOwnedByUser(): void {
    this.username.pipe(take(1), switchMap( user =>
      this.booksService.getUserOwnedBooks(user)
    )).subscribe(response => {
      this.dataSource.data = response;
      this.setFavBooks();
    });
  }

  getAddedByUser(): void {
    this.username.pipe(take(1), switchMap( user =>
      this.booksService.getUserAddedBooks(user)
    )).subscribe( response => {
      this.dataSource.data = response;
      this.setFavBooks();
    });
  }

  setFavBooks(): void {
    if (this.tokenStorage.getUsername()){
      this.getFavourites();
    }
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
    return (this.listIsFavourites.find( element => element.bookId === id))?.status;
  }

  isLoggedIn(): boolean {
    return !!this.tokenStorage.getUsername();
  }

  get showAddButton():boolean {
    return !this.isAccount;
  }

  bookIsbn(isbn: string): string {
    return isbn !== '' ? isbn : '---';
  }

  sortData(sort: any){
    const data = this.dataSource.data;
    if (!sort.active || sort.direction == '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      let isAsc = sort.direction == 'asc';
      switch (sort.active) {
        case 'title': return compare(a.title, b.title, isAsc);
        case 'author': return compare(a.author, b.author, isAsc);
        case 'description': return compare(a.description, b.description, isAsc);
        case 'isbn': return compare(a.isbn, b.isbn, isAsc);
        case 'category': return compare(a.category, b.category, isAsc);
        case 'releaseDate': return compare(a.history.start_date, b.history.start_date, isAsc);
        default: return 0;
      }
    });
  }

  /* this method well be called for each row in table  */
  getFilterPredicate = (row: BookDefinition, filters: string) => {
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

function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
