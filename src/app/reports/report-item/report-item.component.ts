import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ReportService} from "../../core/services/report.service";
import {ReportInfo} from "../../shared/models/report-info";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";

@Component({
  selector: 'app-report-item',
  templateUrl: './report-item.component.html',
  styleUrls: ['./report-item.component.css']
})
export class ReportItemComponent implements OnInit {

  form: FormGroup = new FormGroup({
    user: new FormControl('', Validators.required),
    description: new FormControl('', [Validators.required, Validators.minLength(20)])
  })

  constructor(private dialogRef: MatDialogRef<ReportItemComponent>,
              @Inject(MAT_DIALOG_DATA) data,
              private reportService: ReportService,
              protected snackBar: MatSnackBar) {
    this.form.get('user').setValue(data.username);
  }

  ngOnInit(): void {
  }

  sendReport() {
    let report = new ReportInfo(this.form.get('user').value, this.form.get('description').value);
    this.reportService.createReport(report).subscribe( () => {
      this.dialogRef.close();
      this.openReportSnackBar();
    })
  }

  openReportSnackBar(): void {
    let config = new MatSnackBarConfig();
    config.duration = 5000;
    let message = "Report sent";
    this.snackBar.open(message, "x", config);
  }
}
