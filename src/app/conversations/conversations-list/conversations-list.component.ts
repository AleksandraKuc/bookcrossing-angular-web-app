import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {TokenStorageService} from "../../shared/helpers/services/token-storage.service";
import {Router} from "@angular/router";
import {ConversationsService} from "../../core/services/conversations.service";
import {ConversationDefinition} from "../../core/models/conversation-definition.model";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {ConversationsListDataSource} from "./conversations-list-datasource";
import {BookDefinition} from "../../core/models/book-definition.model";
import {MatTableFilter} from "mat-table-filter";

@Component({
  selector: 'app-conversations-list',
  templateUrl: './conversations-list.component.html',
  styleUrls: ['./conversations-list.component.css']
})
export class ConversationsListComponent implements OnInit {
  dataSource: MatTableDataSource<ConversationDefinition>;
  filterType: MatTableFilter;
  filterEntity: ConversationDefinition;

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
      this.dataSource = new MatTableDataSource(conversations);
    });

    this.filterEntity = new ConversationDefinition();
    this.filterType = MatTableFilter.ANYWHERE;
  }

  getDetailsLink(id: number, username: string) {
    this.router.navigate([`conversations/${username}`], { state: { conversationId: id } } );
  }
}
