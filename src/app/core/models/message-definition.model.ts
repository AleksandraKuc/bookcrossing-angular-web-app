export class MessageDefinition {
  id_message: number;
  content: string;
  sender: string;
  date: Date;
  conversationId: number;

  constructor(content: string, sender: string, conversation: number, date?: Date) {
    this.content = content;
    this.sender = sender;
    this.conversationId = conversation;
    this.date = date;
  }

  setId(id: number): void {
    this.id_message = id;
  }
}
