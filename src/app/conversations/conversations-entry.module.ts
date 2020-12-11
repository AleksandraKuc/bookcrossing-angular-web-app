import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { AuthGuard } from "../shared/helpers/auth.guard";
import { ConversationsDetailsComponent } from "./conversations-details/conversations-details.component";
import { ConversationsLayoutComponent } from "./conversations-layout/conversations-layout.component";

const CONVERSATIONS_ROUTES: Routes = [
  {
    path: '', component: ConversationsLayoutComponent,
    children: [
      { path: '', component: ConversationsDetailsComponent, canActivate: [ AuthGuard ] },
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(CONVERSATIONS_ROUTES) ],
  exports: [ RouterModule ],
})
export class ConversationsEntryModule {}



