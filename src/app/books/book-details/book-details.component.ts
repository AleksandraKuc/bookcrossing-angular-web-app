import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import {BookDefinition} from "../../core/models/book-definition.model";
import {DetailsComponent} from "../../shared/details.component";
import {BooksService} from "../../core/services/books.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserHistoryDefinition} from "../../core/models/userHistory-definition.model";
import {HistoryUsersService} from "../../core/services/history-users.service";
import {UsersService} from "../../core/services/users.service";
import {UserDefinition} from "../../core/models/user-definition.model";
import {TokenStorageService} from "../../shared/helpers/services/token-storage.service";
import {ConversationsService} from "../../core/services/conversations.service";

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
              protected conversationsService: ConversationsService,
              protected tokenStorage: TokenStorageService,
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
          if (this.isLoggedUser) {
            this.checkFavourites();
          }
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
      this.userService.getUserById(userId).subscribe(element => {
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

  deleteBook(): void {
    this.booksService.deleteBook(this.getDetails().id_book).subscribe( () => {
      this.router.navigate([`/books`]);
    })
  }

  protected userLink(username: string): string {
    return `users/profile/${encodeURIComponent(username)}`
  }

  showUserProfile(isCurrentUser: boolean): void {
    let username = isCurrentUser ? this.currentUser.username : this.firstUser.username;
    this.router.navigate([this.userLink(username)]);
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
    let message = "Hi, I want to reserve book \"" + this.getDetails().title + "\"";
    if (this.getDetails().isbn !== null) {
      message += " with isbn code " + this.getDetails();
    }
    let username = this.currentUser.username;
    this.conversationsService.checkIfExists(this.currentUser.username)
      .subscribe(
        response => {
          if (!response) {
            console.log("creating conv")
            this.conversationsService.createConversation(this.currentUser.username)
              .subscribe(
                conversation => {
                  this.router.navigate([`conversations/${this.currentUser.username}`],
                    { state: { conversationId: conversation.id_conversation, message: message } });
            })
          } else {
            console.log("already exists")
            this.router.navigate([`conversations/${this.currentUser.username}`],
              { state: { message: message }});
          }
    })
  }

  get isLoggedUser(): boolean {
    return !!this.tokenStorage.getUsername();
  }

  get isMyBook(): boolean {
    return this.currentUser.username === this.tokenStorage.getUsername();
  }
}
