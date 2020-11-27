import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";

import { ConversationsService } from "../../core/services/conversations.service";
import { MessageDefinition } from "../../core/models/message-definition.model";
import { TokenStorageService } from "../../shared/helpers/services/token-storage.service";

@Component({
  selector: 'app-conversations-details',
  templateUrl: './conversations-details.component.html',
  styleUrls: ['./conversations-details.component.css']
})
export class ConversationsDetailsComponent implements OnInit {

  content = new FormControl('', Validators.required);
  conversationId: number;
  messages: MessageDefinition[];
  recipient: string;
  contentMessage: string;

  constructor(protected conversationsService: ConversationsService,
              protected tokenStorage: TokenStorageService,
              protected route: ActivatedRoute,
              protected router: Router) {
    this.conversationId = history.state.conversationId;
    this.setContentMessage();

    if (!this.conversationId) {
      this.recipient = this.route.snapshot.paramMap.get('username');
      this.conversationsService.getConversationByUsers(this.recipient).subscribe( result => {
        this.conversationId = result.id_conversation;
        this.getMessages();
      })
    } else {
      this.getMessages();
    }
  }

  ngOnInit(): void {
  }

  getMessages() {
    this.conversationsService.getMessages(this.conversationId).subscribe( list => {
      this.messages = list;
    });
  }

  setContentMessage(): void {
    this.contentMessage = String(history.state.message);
    if (this.contentMessage !== undefined && this.contentMessage !== "undefined") {
      console.log(true)
      this.content.setValue(this.contentMessage);
    }
  }

  sendMessage(){
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

  get recipientName() {
    return this.recipient;
  }
}
