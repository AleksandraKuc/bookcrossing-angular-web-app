import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { AboutBookcrossingComponent } from './about-bookcrossing/about-bookcrossing.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ContactComponent } from './contact/contact.component';
import { httpAuthInterceptorProvider } from "./shared/helpers/interceptors/auth-interceptor";
import { httpOverlayInterceptorProvider } from "./shared/helpers/interceptors/spinner-overlay.interceptor";
import { MainNavigationComponent } from './main-navigation/main-navigation.component';
import { MainPageComponent } from './main-page/main-page.component';
import { SharedModule } from "./shared/shared.module";
import { SpinnerOverlayComponent } from "./shared/components/spinner-overlay/spinner-overlay.component";
import {BooksModule} from "./books/books.module";
import {MatCardModule} from "@angular/material/card";

@NgModule({
  declarations: [
    AboutBookcrossingComponent,
    AppComponent,
    ContactComponent,
    MainNavigationComponent,
    MainPageComponent,
    SpinnerOverlayComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    SharedModule.forRoot(),
    RouterModule,
    ReactiveFormsModule,
    BooksModule
  ],
  providers: [
    httpAuthInterceptorProvider,
    httpOverlayInterceptorProvider
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
