import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import {BookDefinition} from "../../core/models/book-definition.model";
import {DetailsComponent} from "../../shared/details.component";
import {BooksService} from "../../core/services/books.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserHistoryDefinition} from "../../core/models/userHistory-definition.model";
import {HistoryUsersService} from "../../core/services/history-users.service";
import {UsersService} from "../../core/services/users.service";
import {UserDefinition} from "../../core/models/user-definition.model";

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent extends DetailsComponent<BookDefinition> implements AfterViewInit {

  historyUser: UserHistoryDefinition[];
  firstUser: UserDefinition;
  currentUser: UserDefinition;
  isFavourite: boolean = false;

  constructor(protected booksService: BooksService,
              protected historyUserService: HistoryUsersService,
              protected userService: UsersService,
              protected route: ActivatedRoute,
              protected router: Router,
              protected cdr: ChangeDetectorRef) {
    super(route);

    this.booksService.getBook(this.id).subscribe(book => {
      this.setDetails(book);
      this.historyUserService.getUserHistory(this.getDetails().history.id_history).subscribe(historyUser => {
          this.historyUser = historyUser;
          this.getBookUsers('firstUser');
          this.getBookUsers('currentUser');
          this.checkFavourites();
        }
      )
    });
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  getBookUsers(userType: string): void {
    let userId: number;
    if (this.historyUser) {
      let index = this.historyUser.findIndex(item => item.userType === userType);
      if (userType === 'currentUser' && index === -1) {
        index = 0;
      }
      userId = this.historyUser[index].id_historyUsers.id_user;
      this.userService.getUser(userId).subscribe(element => {
        if (userType === 'firstUser') {
          this.firstUser = element;
        } else {
          this.currentUser = element;
        }
      });
    }
  }

  protected checkFavourites(): void {
    this.booksService.checkIfFavourite(this.getDetails().id_book).subscribe( data => {
      this.isFavourite = data;
    })
  }

  protected modifyLink(id: number): string {
    return `books/edit/${encodeURIComponent(id)}`;
  }

  editBook(): void {
    this.router.navigate([this.modifyLink(this.getDetails().id_book)]);
  }

  protected userLink(userId: number): string {
    return `users/profile/${encodeURIComponent(userId)}`
  }

  showUserProfile(userId: number): void {
    this.router.navigate([this.userLink(userId)]);
  }

  addToFavourites(): void {
    this.booksService.addToFavourites(this.getDetails().id_book).subscribe(() => {
      this.isFavourite = true;
    })
  }

  removeFromFavourites(): void {
    this.booksService.removeFromFavourites(this.getDetails().id_book).subscribe(() => {
      this.isFavourite = false;
    })
  }

  reserveBook(): void {
    console.log('reserved');
  }

}
