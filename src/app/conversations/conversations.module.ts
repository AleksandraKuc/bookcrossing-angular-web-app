import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import { SharedModule } from "../shared/shared.module";
import { ConversationsLayoutComponent } from './conversations-layout/conversations-layout.component';
import { ConversationsListComponent } from './conversations-list/conversations-list.component';
import { ConversationsDetailsComponent } from './conversations-details/conversations-details.component';
import { ConversationsEntryModule } from "./conversations-entry.module";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule.forRoot(),
        ConversationsEntryModule,
        FormsModule,
    ],
  declarations: [
  ConversationsLayoutComponent,
  ConversationsListComponent,
  ConversationsDetailsComponent],
})
export class ConversationsModule {}
