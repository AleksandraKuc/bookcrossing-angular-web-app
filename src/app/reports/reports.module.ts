import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../shared/shared.module";
import { ReportItemComponent } from './report-item/report-item.component';
import { ReportsListComponent } from './reports-list/reports-list.component';
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    SharedModule.forRoot(),
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [
    ReportItemComponent
  ],
  declarations: [
    ReportItemComponent,
    ReportsListComponent]
})
export class ReportsModule {}
