import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { UsersListDataSource } from './users-list-datasource';
import {UserDefinition} from "../../core/models/user-definition.model";
import {Router} from "@angular/router";
import {UsersService} from "../../core/services/users.service";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<UserDefinition>;
  dataSource = new UsersListDataSource();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.usersService.getAllUsers().subscribe(response => {
      this.dataSource.data = response;
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  getDetailsLink(id: any) {
    return `details/${encodeURIComponent(id)}`;
  }
}
