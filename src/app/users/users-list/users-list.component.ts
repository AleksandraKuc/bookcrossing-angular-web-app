import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from "@angular/router";

import { BooksService } from "../../core/services/books.service";
import { ConversationsService } from "../../core/services/conversations.service";
import { TokenStorageService } from "../../shared/helpers/services/token-storage.service";
import { UserDefinition } from "../../core/models/user-definition.model";
import { UsersService } from "../../core/services/users.service";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements AfterViewInit, OnInit {
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource<UserDefinition>();

  isHandOverMode: boolean = false;
  bookToHandOver: number;

  displayedColumns = ['name', 'username', 'city', 'province', 'addedBooks'];

  public searchForm: FormGroup;
  public firstName = '';
  public username = '';
  public city = '';

  constructor(private usersService: UsersService,
              private bookService: BooksService,
              private conversationsService: ConversationsService,
              private tokenStorage: TokenStorageService,
              protected router: Router,
              protected snackBar: MatSnackBar) {
    this.isHandOverMode = !!history.state.bookId;
    this.bookToHandOver = history.state.bookId;
  }

  ngOnInit() {
    this.getUsersList();
    this.setDisplayedColumns();
    this.searchFormInit();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  setDisplayedColumns(): void {
    if (this.tokenStorage.getUsername() && this.isHandOverMode){
      this.displayedColumns = ['name', 'username', 'city', 'province', 'addedBooks', 'handOver'];
    } else if (this.tokenStorage.getUsername() && !this.isHandOverMode){
      this.displayedColumns = ['name', 'username', 'city', 'province', 'addedBooks', 'sendMessage'];
    }
  }

  searchFormInit() {
    this.searchForm = new FormGroup({
      firstName: new FormControl('', Validators.pattern('^[a-zA-Z ]+$')),
      username: new FormControl('', Validators.pattern('^[a-zA-Z ]+$')),
      city: new FormControl('')
    });
  }

  getUsersList(): void {
    let filterResult = !this.isAdmin();
    this.usersService.getAllUsers(filterResult).subscribe(response => {
      this.dataSource.data = response.users;
      setTimeout(() => {
        this.dataSource.paginator = this.paginator
      });
      this.dataSource.filterPredicate = this.getFilterPredicate;
    });
  }

  getDetailsLink(username: string) {
    return `details/${username}`;
  }

  sendMessage(username: string): void {
    this.conversationsService.checkIfExists(username).subscribe( response => {
      if (!response) {
        this.conversationsService.createConversation(username).subscribe( conversation => {
          this.router.navigate([`conversations`], { state: { conversationId: conversation.id_conversation, username: username } });
        })
      } else {
        this.router.navigate([`conversations`], { state: { username: username } });
      }
    })
  }

  handOverBook(username: string): void {
    this.bookService.updateBookHired(this.bookToHandOver, username).subscribe( () => {
      delete this.bookToHandOver;
      this.isHandOverMode = false;
      this.router.navigate([`books`]);
      this.openSuccessSnackBar(username);
    })
  }

  openSuccessSnackBar(username: string): void {
    let config = new MatSnackBarConfig();
    config.duration = 10000;
    let message = `Book successfully hand over to ${username}`;
    this.snackBar.open(message, "x", config);
  }

  isAdmin(): boolean {
    return this.tokenStorage.getAuthorities()[0] === "ROLE_ADMIN";
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
        case 'name': return compare(a.firstName, b.firstName, isAsc);
        case 'username': return compare(a.username, b.username, isAsc);
        case 'city': return compare(a.city, b.city, isAsc);
        case 'province': return compare(a.province, b.province, isAsc);
        case 'addedBooks': return compare(+a.addedBooks, +b.addedBooks, isAsc);
        default: return 0;
      }
    });
  }

  /* this method well be called for each row in table  */
  getFilterPredicate = (row: UserDefinition, filters: string) => {
    // split string per '$' to array
    const filterArray = filters.split('$');
    const firstName = filterArray[0];
    const username = filterArray[1];
    const city = filterArray[2];

    const matchFilter = [];

    // Fetch data from row
    const columnFirstName = row.firstName;
    const columnUsername = row.username;
    const columnCity = row.city;

    // verify fetching data by our searching values
    const customFilterFirstName = columnFirstName.toLowerCase().includes(firstName);
    const customFilterUsername = columnUsername.toLowerCase().includes(username);
    const customFilterCity = columnCity.toLowerCase().includes(city);

    // push boolean values into array
    matchFilter.push(customFilterFirstName);
    matchFilter.push(customFilterUsername);
    matchFilter.push(customFilterCity);

    // return true if all values in array is true
    // else return false
    return matchFilter.every(Boolean);
  }

  applyFilter() {
    const firstName = this.searchForm.get('firstName').value;
    const username = this.searchForm.get('username').value;
    const city = this.searchForm.get('city').value;

    this.firstName = firstName === null ? '' : firstName;
    this.username = username === null ? '' : username;
    this.city = city === null ? '' : city;

    // create string of our searching values and split if by '$'
    const filterValue = this.firstName + '$' + this.username + '$' + this.city;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
