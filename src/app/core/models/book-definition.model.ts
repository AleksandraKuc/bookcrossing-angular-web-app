import {BookHistoryDefinition} from "./bookHistory-definition.model";

export class BookDefinition {
  id_book: number;
  title: string;
  description: string;
  author: string;
  isbn: string;
  category: string;
  history: BookHistoryDefinition;

  constructor(title: string, description: string, author: string, isbn: string, category: string) {
    this.title = title;
    this.description = description;
    this.author = author;
    this.isbn = isbn;
    this.category = category;
  }

  setId(id: number): void {
    this.id_book = id;
  }
}
