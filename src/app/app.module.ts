import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { MainNavigationComponent } from './main-navigation/main-navigation.component';
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule} from "@angular/common/http";
import { AboutBookcrossingComponent } from './about-bookcrossing/about-bookcrossing.component';
import { MainPageComponent } from './main-page/main-page.component';
import {RouterModule} from "@angular/router";
import {SharedModule} from "./shared/shared.module";
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import {BooksModule} from "./books/books.module";
import {UsersModule} from "./users/users.module";

@NgModule({
  declarations: [
    AppComponent,
    MainNavigationComponent,
    AboutBookcrossingComponent,
    MainPageComponent,
    ContactComponent,
    LoginComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    SharedModule.forRoot(),
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
