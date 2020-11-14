import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {TokenStorageService} from "../../shared/helpers/token-storage.service";
import {Router} from "@angular/router";
import {ConversationsService} from "../../core/services/conversations.service";
import {ConversationDefinition} from "../../core/models/conversation-definition.model";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTable} from "@angular/material/table";
import {UsersListDataSource} from "../../users/users-list/users-list-datasource";
import {ConversationsListDataSource} from "./conversations-list-datasource";
import {MessageDefinition} from "../../core/models/message-definition.model";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-conversations-list',
  templateUrl: './conversations-list.component.html',
  styleUrls: ['./conversations-list.component.css']
})
export class ConversationsListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<ConversationDefinition>;
  dataSource = new ConversationsListDataSource();

  displayedColumns = ['name', 'username', 'date', 'message'];

  constructor(protected conversationsService: ConversationsService,
              protected tokenStorage: TokenStorageService,
              protected router: Router) { }

  ngOnInit(): void {
    this.conversationsService.getConversations().subscribe( data => {
      let conversations = data;
      conversations.forEach( conv => {
        this.conversationsService.getMessages(conv.id_conversation).subscribe( list => {
          conv.messages = list;
        });
      });
      this.dataSource.data = conversations;
      console.log(conversations);
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  getDetailsLink(id: number, username: string) {
    this.router.navigate([`conversations/${username}`], { state: { conversationId: id } } );
  }

}
