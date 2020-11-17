import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTable} from "@angular/material/table";
import {ReportDefinition} from "../../core/models/report-definition.model";
import {ReportsListDataSource} from "./reports-list-datasource";
import {TokenStorageService} from "../../shared/helpers/services/token-storage.service";
import {Router} from "@angular/router";
import {ReportService} from "../../core/services/report.service";

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.css']
})
export class ReportsListComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<ReportDefinition>;
  dataSource = new ReportsListDataSource();

  displayedColumns = ['user', 'reporter', 'description', 'date'];

  constructor(private reportService: ReportService,
              private tokenStorage: TokenStorageService,
              protected router: Router) { }

  ngOnInit(): void {
    this.reportService.getReports().subscribe(response => {
      this.dataSource.data = response;
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  getUserLink(username: string) {
    return `/users/details/${username}`;
  }
}
