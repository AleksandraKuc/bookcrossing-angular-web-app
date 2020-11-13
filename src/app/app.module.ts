import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";

import { AboutBookcrossingComponent } from './about-bookcrossing/about-bookcrossing.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ContactComponent } from './contact/contact.component';
// import { ErrorInterceptor } from "./shared/helpers/error.interceptor";
// import { JwtInterceptor } from "./shared/helpers/jwt.interceptor";
import { MainNavigationComponent } from './main-navigation/main-navigation.component';
import { MainPageComponent } from './main-page/main-page.component';
import { SharedModule } from "./shared/shared.module";
import {httpInterceptorProviders} from "./shared/helpers/auth-interceptor";
import { MessagesComponent } from './messages/messages.component';

@NgModule({
  declarations: [
    AboutBookcrossingComponent,
    AppComponent,
    ContactComponent,
    MainNavigationComponent,
    MainPageComponent,
    MessagesComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    SharedModule.forRoot(),
    RouterModule
  ],
  providers: [ httpInterceptorProviders
    // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
