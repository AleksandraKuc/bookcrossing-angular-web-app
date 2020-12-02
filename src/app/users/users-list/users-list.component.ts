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

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
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
              protected router: Router) {
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
    this.dataSource.paginator = this.paginator;
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
          this.router.navigate([`conversations/${username}`], { state: { conversationId: conversation.id_conversation } });
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

  isAdmin(): boolean {
    return this.tokenStorage.getAuthorities()[0] === "ROLE_ADMIN";
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
