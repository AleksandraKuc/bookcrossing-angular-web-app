import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";

import { AboutBookcrossingComponent } from './about-bookcrossing/about-bookcrossing.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ContactComponent } from './contact/contact.component';
import { MainNavigationComponent } from './main-navigation/main-navigation.component';
import { MainPageComponent } from './main-page/main-page.component';
import { SharedModule } from "./shared/shared.module";
import { httpInterceptorProviders } from "./shared/helpers/auth-interceptor";

@NgModule({
  declarations: [
    AboutBookcrossingComponent,
    AppComponent,
    ContactComponent,
    MainNavigationComponent,
    MainPageComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    SharedModule.forRoot(),
    RouterModule
  ],
  providers: [ httpInterceptorProviders ],
  bootstrap: [AppComponent]
})
export class AppModule { }
