import {LayoutModule} from "@angular/cdk/layout";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatTableModule} from "@angular/material/table";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatSortModule} from "@angular/material/sort";
import {ModuleWithProviders, NgModule} from "@angular/core";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {CommonModule} from "@angular/common";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatDialogModule} from "@angular/material/dialog";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from "@angular/material/card";

const SHARED_COMPONENTS = [];
const SHARED_MODULES = [
  LayoutModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatDatepickerModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatTableModule,
  MatDialogModule,
  MatToolbarModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatSortModule,
  MatFormFieldModule,
  MatAutocompleteModule,
  MatSnackBarModule,
  MatNativeDateModule,
  MatCardModule,
  MatTabsModule
];

@NgModule({
  imports: [...SHARED_MODULES, CommonModule],
  declarations: [...SHARED_COMPONENTS],
  exports: [...SHARED_COMPONENTS, ...SHARED_MODULES],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
    }
  }
}
