export class SearchParamsInfo {
  title: string;
  category: string;
  username: string;

  constructor() {
  }

  setBookValues(title: string, category: string, username?: string) {
    this.title = title;
    this.category = category;
    this.username = username;
  }
}
