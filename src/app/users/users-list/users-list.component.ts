import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Router } from "@angular/router";

import { BooksService } from "../../core/services/books.service";
import { ConversationsService } from "../../core/services/conversations.service";
import { TokenStorageService } from "../../shared/helpers/services/token-storage.service";
import { UsersListDataSource } from './users-list-datasource';
import { UserDefinition } from "../../core/models/user-definition.model";
import { UsersService } from "../../core/services/users.service";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<UserDefinition>;
  dataSource = new UsersListDataSource();

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
    this.usersService.getAllUsers().subscribe(response => {
      this.dataSource.data = response;
    });
    this.setDisplayedColumns();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
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
        console.log("creating conv")
        this.conversationsService.createConversation(username).subscribe( conversation => {
          this.router.navigate([`conversations/${username}`], { state: { conversationId: conversation.id_conversation } });
        })
      } else {
        console.log("already exists")
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
