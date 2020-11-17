import {MessageDefinition} from "./message-definition.model";

export class ConversationDefinition {
  idConversation: number;
  firstUser: ConvUser;
  messages: MessageDefinition[];

  // constructor(recipient: any, id?: number) {
  //   this.recipient = recipient;
  //   this.id_conversation = id;
  // }

  setId(id: number): void {
    this.idConversation = id;
  }

  setMessages(messages: MessageDefinition[]){
    this.messages = messages;
  }
}

class ConvUser {
  firstName: string;
  username: string;
}
