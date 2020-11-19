import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";

import { ConversationsService } from "../../core/services/conversations.service";
import { ConversationDefinition } from "../../core/models/conversation-definition.model";
import { TokenStorageService } from "../../shared/helpers/services/token-storage.service";
import {MessageDefinition} from "../../core/models/message-definition.model";

@Component({
  selector: 'app-conversations-list',
  templateUrl: './conversations-list.component.html',
  styleUrls: ['./conversations-list.component.css']
})
export class ConversationsListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource<ConversationDefinition>();

  displayedColumns = ['name', 'username', 'date', 'message'];

  public searchForm: FormGroup;
  public firstName = '';
  public username = '';

  constructor(protected conversationsService: ConversationsService,
              protected tokenStorage: TokenStorageService,
              protected router: Router) { }

  ngOnInit(): void {
    this.getConversations();
    this.searchFormInit();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  searchFormInit() {
    this.searchForm = new FormGroup({
      firstName: new FormControl('', Validators.pattern('^[a-zA-Z ]+$')),
      username: new FormControl('', Validators.pattern('^[a-zA-Z ]+$')),
    });
  }

  getConversations(): void {
    this.conversationsService.getConversations().subscribe( data => {
      let conversations = data;
      conversations.forEach( conv => {
        this.conversationsService.getMessages(conv.id_conversation).subscribe( list => {
          conv.messages = list;
        });
      });
      this.dataSource.data = conversations;
      this.dataSource.filterPredicate = this.getFilterPredicate;
    });
  }

  getDetailsLink(id: number, username: string) {
    this.router.navigate([`conversations/${username}`], { state: { conversationId: id } } );
  }

  getLastMessageDate(messages: MessageDefinition[]): Date {
    if (messages) {
      return messages[messages.length-1].date;
    }
  }

  getLastMessageContent(messages: MessageDefinition[]): string {
    if (messages) {
      return messages[messages.length-1].content;
    }
  }

  /* this method well be called for each row in table  */
  getFilterPredicate = (row: ConversationDefinition, filters: string) => {

    // split string per '$' to array
    const filterArray = filters.split('$');
    const firstName = filterArray[0];
    const username = filterArray[1];

    const matchFilter = [];

    // Fetch data from row
    const columnFirstName = row.recipient.firstname;
    const columnUsername = row.recipient.username;

    // verify fetching data by our searching values
    const customFilterFirstName = columnFirstName.toLowerCase().includes(firstName);
    const customFilterUsername = columnUsername.toLowerCase().includes(username);

    // push boolean values into array
    matchFilter.push(customFilterFirstName);
    matchFilter.push(customFilterUsername);

    // return true if all values in array is true
    // else return false
    return matchFilter.every(Boolean);
  }

  applyFilter() {
    const firstName = this.searchForm.get('firstName').value;
    const username = this.searchForm.get('username').value;

    this.firstName = firstName === null ? '' : firstName;
    this.username = username === null ? '' : username;

    // create string of our searching values and split if by '$'
    const filterValue = this.firstName + '$' + this.username;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(filterValue);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
