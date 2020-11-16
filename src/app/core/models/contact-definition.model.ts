export class ContactDefinition {
  name: string;
  title: string;
  content: string;
  email: string;

  constructor(name: string, title: string, content: string, email: string) {
    this.name = name;
    this.title = title;
    this.content = content;
    this.email = email;
  }

}
