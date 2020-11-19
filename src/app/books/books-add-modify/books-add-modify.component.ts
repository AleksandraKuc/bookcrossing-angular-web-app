import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { BooksService } from "../../core/services/books.service";
import { BookDefinition } from "../../core/models/book-definition.model";
import { TokenStorageService } from "../../shared/helpers/services/token-storage.service";

@Component({
  selector: 'app-books-add-modify',
  templateUrl: './books-add-modify.component.html',
  styleUrls: ['./books-add-modify.component.css']
})
export class BooksAddModifyComponent implements OnInit {

  viewMode: string;
  bookId: number;
  form: FormGroup;

  isSavingFailed = false;
  errorMessage = '';

  categories: string[] = ['Biography', 'ChildrenBook', 'Guide', 'PopularScience', 'Thriller', 'Novel', 'Poetry', 'History', 'Romance', 'Education', 'Scientific', 'Adventure', 'Criminal', 'Humour', 'Science_fiction', 'Other']
  filteredCategories: Observable<string[]>;

  constructor(protected route: ActivatedRoute,
              protected bookService: BooksService,
              protected router: Router,
              protected tokenStorage: TokenStorageService) {
    this.bookId = +this.route.snapshot.paramMap.get('id');
    this.viewMode = this.bookId ? 'edit' : 'add';

    this.form = this.generateForm();

    if (this.viewMode === 'edit') {
      this.bookService.getBook(this.bookId).subscribe(book => {
        this.setValues(book);
      });
    }
  }

  ngOnInit(): void {
    this.filteredCategories = this.form.get('category').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private generateForm(): FormGroup {
    return new FormGroup( {
      id_book: new FormControl(''),
      title: new FormControl('', Validators.required),
      description: new FormControl(''),
      author: new FormControl('', Validators.required),
      isbn: new FormControl(''),
      category: new FormControl('', Validators.required)
    });
  }

  private setValues(book: BookDefinition) {
    this.form.get('id_book').setValue(book.id_book);
    this.form.get('title').setValue(book.title);
    this.form.get('description').setValue(book.description);
    this.form.get('author').setValue(book.author);
    this.form.get('isbn').setValue(book.isbn);
    this.form.get('category').setValue(book.category);
  }

  onSubmit() {
    let book: BookDefinition = new BookDefinition(
      this.form.get('title').value,
      this.form.get('description').value,
      this.form.get('author').value,
      this.form.get('isbn').value,
      this.form.get('category').value
    );
    if (this.form.valid) {
      if (this.viewMode === 'edit') {
        this.saveBook(book);
      } else {
        this.addBook(book);
      }
    } else {
      this.errorMessage = "Passwords are not equal!";
      this.isSavingFailed = true;
    }
  }

  private addBook(book: BookDefinition) {
    this.bookService.createBook(book).subscribe(_book => {
        this.router.navigate([`/books/details/${encodeURIComponent(_book.id_book)}`]);
      },
      error => {
        console.log(error);
        this.errorMessage = error.error.message;
        this.isSavingFailed = true;
      });
  }

  private saveBook(book: BookDefinition) {
    book.setId(this.form.get('id_book').value);

    this.bookService.updateBook(book).subscribe((data) => {
      this.router.navigate([`/books/details/${encodeURIComponent(book.id_book)}`]);
    },
    error => {
      console.log(error);
      this.errorMessage = error.error.message;
      this.isSavingFailed = true;
    });
  }

  cancel(){
    if (this.viewMode === 'add') {
      this.router.navigate([`/books`]);
    } else {
      this.router.navigate([`/books/details/${encodeURIComponent(this.form.get('id_book').value)}`])
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.categories.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  get submitButton(): string {
    return this.viewMode === 'add' ? "Add book" : "Save changes";
  }

}
