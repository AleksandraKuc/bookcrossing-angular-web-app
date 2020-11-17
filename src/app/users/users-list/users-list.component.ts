import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource} from '@angular/material/table';
import { Router } from "@angular/router";

import { BooksService } from "../../core/services/books.service";
import { ConversationsService } from "../../core/services/conversations.service";
import { TokenStorageService } from "../../shared/helpers/services/token-storage.service";
import { UserDefinition } from "../../core/models/user-definition.model";
import { UsersService } from "../../core/services/users.service";
import {MatTableFilter} from "mat-table-filter";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  dataSource: MatTableDataSource<UserDefinition>;
  filterType: MatTableFilter;
  filterEntity: UserDefinition;

  isHandOverMode: boolean = false;
  bookToHandOver: number;

  displayedColumns = ['name', 'username', 'city', 'province', 'addedBooks'];

  constructor(private usersService: UsersService,
              private bookService: BooksService,
              private conversationsService: ConversationsService,
              private tokenStorage: TokenStorageService,
              protected router: Router) {
    this.isHandOverMode = !!history.state.bookId;
    this.bookToHandOver = history.state.bookId;
  }

  ngOnInit() {
    this.filterEntity = new UserDefinition();
    this.filterType = MatTableFilter.ANYWHERE;

    this.usersService.getAllUsers().subscribe(response => {
      this.dataSource = new MatTableDataSource(response);
    });
    this.setDisplayedColumns();
  }

  setDisplayedColumns(): void {
    if (this.tokenStorage.getUsername() && this.isHandOverMode){
      this.displayedColumns = ['name', 'username', 'city', 'province', 'addedBooks', 'handOver'];
    } else if (this.tokenStorage.getUsername() && !this.isHandOverMode){
      this.displayedColumns = ['name', 'username', 'city', 'province', 'addedBooks', 'sendMessage'];
    }
}

  getDetailsLink(username: string) {
    return `details/${username}`;
  }

  sendMessage(username: string): void {
    this.conversationsService.checkIfExists(username).subscribe( response => {
      if (!response) {
        this.conversationsService.createConversation(username).subscribe( conversation => {
          this.router.navigate([`conversations/${username}`],
            { state: { conversationId: conversation.id_conversation } });
        })
      } else {
        this.router.navigate([`conversations/${username}`]);
      }
    })

  }

  handOverBook(username: string): void {
    this.bookService.updateBookHired(this.bookToHandOver, username).subscribe( () => {
      delete this.bookToHandOver;
      this.isHandOverMode = false;
      window.location.reload();
    })
  }
}
