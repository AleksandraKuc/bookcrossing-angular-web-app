import { ActivatedRoute, Router } from "@angular/router";
import {AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import { FormControl, Validators } from "@angular/forms";

import { ConversationsService } from "../../core/services/conversations.service";
import { MessageDefinition } from "../../core/models/message-definition.model";
import { TokenStorageService } from "../../shared/helpers/services/token-storage.service";
import {ConversationDefinition, ConvUser} from "../../core/models/conversation-definition.model";

@Component({
  selector: 'app-conversations-details',
  templateUrl: './conversations-details.component.html',
  styleUrls: ['./conversations-details.component.css']
})
export class ConversationsDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollframe', {static: false}) scrollFrame: ElementRef;
  @ViewChildren('item') itemElements: QueryList<any>;

  private scrollContainer: any;
  private isNearBottom = true;

  content = new FormControl('', Validators.required);
  conversationId: number;
  messages: MessageDefinition[];
  recipient: ConvUser;
  newMessage = '';

  conversations: ConversationDefinition[];

  constructor(protected conversationsService: ConversationsService,
              protected tokenStorage: TokenStorageService,
              protected route: ActivatedRoute,
              protected router: Router) {
    this.setContentMessage();
    this.conversationId = history.state.conversationId;
    this.getConversations();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.scrollContainer = this.scrollFrame.nativeElement;
    this.itemElements.changes.subscribe(_ => this.onItemElementsChanged());
  }

  private onItemElementsChanged(): void {
    if (this.isNearBottom) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  private isUserNearBottom(): boolean {
    const threshold = 150;
    const position = this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight;
    const height = this.scrollContainer.scrollHeight;
    return position > height - threshold;
  }

  scrolled(event: any): void {
    this.isNearBottom = this.isUserNearBottom();
  }

  getConversations(): void {
    this.conversationsService.getConversations().subscribe( data => {
      this.conversations = data;
      this.conversationId = this.conversationId ? this.conversationId : this.conversations[0].id_conversation;
      this.getConversationByUser();
    });
  }

  getConversationByUser() {
    if (!this.conversationId) {
      let recipient = String(history.state.useraname);
      this.conversationsService.getConversationByUsers(recipient).subscribe(result => {
        this.conversationId = result.id_conversation;
        this.getMessages();
      })
    } else {
      this.getMessages();
    }
  }

  getMessages() {
    this.conversations.forEach( conv => {
      this.conversationsService.getMessages(conv.id_conversation).subscribe( list => {
        conv.messages = list;
        if (conv.id_conversation === this.conversationId) {
          this.messages = conv.messages;
          this.recipient = conv.recipient;
        }
      });
    });
  }

  setContentMessage(): void {
    let contentMessage = String(history.state.message);
    if (contentMessage !== undefined && contentMessage !== "undefined") {
      this.content.setValue(contentMessage);
    }
  }

  sendMessage(){
    let message = new MessageDefinition(
      this.content.value,
      this.tokenStorage.getUsername(),
      this.conversationId);

    this.conversationsService.sendMessage(message).subscribe( m => {
      this.getConversations();
      this.content.setValue('');
    })
  }

  removeConversation(){
    this.conversationsService.deleteConversation(this.conversationId).subscribe( () => {
      this.conversationId = null;
      this.recipient = null;
      this.messages = null;
      this.getConversations();
    })
  }

  get recipientName() {
    return this.recipient;
  }

  getLastMessageContent(messages: MessageDefinition[]): string {
    if (messages) {
      return messages[messages.length-1]?.content;
    }
  }

  chooseUser(conversation: ConversationDefinition) {
    this.conversationId = conversation.id_conversation;
    this.recipient = conversation.recipient;
    this.messages = conversation.messages;
    this.getConversations();
  }

  isSelected(convId: number): boolean {
    return this.conversationId === convId;
  }

  amIRecipient(sender: string): boolean {
    return sender === this.recipient.username
  }
}
