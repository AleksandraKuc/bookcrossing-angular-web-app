export class ReportDefinition {
  id_report: number;
  description: string;
  date: Date;
  user: string;
  reporter: string;

  constructor(id_report: number, description: string, date: Date, user: string, reporter: string) {
    this.id_report = id_report;
    this.description = description;
    this.date = date;
    this.user = user;
    this.reporter = reporter;
  }

}
