import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {ConversationsService} from "../../core/services/conversations.service";
import {MessageDefinition} from "../../core/models/message-definition.model";
import {TokenStorageService} from "../../shared/helpers/token-storage.service";
import {BooksService} from "../../core/services/books.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-conversations-details',
  templateUrl: './conversations-details.component.html',
  styleUrls: ['./conversations-details.component.css']
})
export class ConversationsDetailsComponent implements OnInit {

  content = new FormControl('', Validators.required);
  conversationId: number;
  messages: MessageDefinition[];

  constructor(protected conversationsService: ConversationsService,
              protected tokenStorage: TokenStorageService,
              protected route: ActivatedRoute,
              protected router: Router) {
    this.conversationId = history.state.conversationId;

    if (!this.conversationId) {
      let recipient = this.route.snapshot.paramMap.get('username');
      this.conversationsService.getConversationByUsers(recipient).subscribe( result => {
        console.log(result);
      })
    }

    this.conversationsService.getMessages(this.conversationId).subscribe( list => {
      this.messages = list;
    });
  }

  ngOnInit(): void {
  }

  getMessages() {

  }

  sendMessage(){
    console.log(this.tokenStorage.getUsername());
    console.log(this.conversationId);
    let message = new MessageDefinition(
      this.content.value,
      this.tokenStorage.getUsername(),
      this.conversationId);

    this.conversationsService.sendMessage(message).subscribe( message => {
      this.messages.push(message);
    })
  }

  removeConversation(){
    this.conversationsService.deleteConversation(this.conversationId).subscribe( () => {
      this.router.navigate([`/conversations`]);
    })
  }
}
