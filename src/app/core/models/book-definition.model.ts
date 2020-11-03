import {BookHistoryDefinition} from "./bookHistory-definition.model";

export class BookDefinition {
  id_book: number;
  title: string;
  description: string;
  author: string;
  isbn: number;
  category: string;
  history: BookHistoryDefinition;
}
