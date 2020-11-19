export class ReportInfo {
  user: string;
  reporter: string;
  description: string;

  constructor(user: string, description: string, reporter?: string) {
    this.user = user;
    this.description = description;
    this.reporter = reporter;
  }

  setReporter(reporter: string): void {
    this.reporter = reporter;
  }
}
