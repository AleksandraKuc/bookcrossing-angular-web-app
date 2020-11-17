import {BookHistoryDefinition} from "./bookHistory-definition.model";

export class BookDefinition {
  id_book: number;
  title: string;
  description: string;
  author: string;
  isbn: number;
  category: string;
  history: BookHistoryDefinition;

  constructor() {
  }

  // constructor(title: string, description: string, author: string, isbn: number, category: string) {
  //   this.title = title;
  //   this.description = description;
  //   this.author = author;
  //   this.isbn = isbn;
  //   this.category = category;
  // }

  setId(id: number): void {
    this.id_book = id;
  }
}
