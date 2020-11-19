import {MessageDefinition} from "./message-definition.model";

export class ConversationDefinition {
  id_conversation: number;
  recipient: ConvUser;
  messages: MessageDefinition[];

  constructor(recipient: any, id?: number) {
    this.recipient = recipient;
    this.id_conversation = id;
  }
  setId(id: number): void {
    this.id_conversation = id;
  }

  setMessages(messages: MessageDefinition[]){
    this.messages = messages;
  }
}

class ConvUser {
  firstname: string;
  username: string;
}
