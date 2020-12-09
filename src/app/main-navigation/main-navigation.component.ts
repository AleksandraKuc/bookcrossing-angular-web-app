import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { TokenStorageService } from "../shared/helpers/services/token-storage.service";

@Component({
  selector: 'app-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.css']
})
export class MainNavigationComponent {

  isLoggedUser: boolean = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,
              private tokenStorage: TokenStorageService) {
    if(tokenStorage.getToken()) {
      this.isLoggedUser = true;
    }
  }

  logout(): void {
    this.tokenStorage.signOut();
    window.location.reload();
  }

  isAdmin(): boolean {
    return this.tokenStorage.getAuthorities()[0] === "ROLE_ADMIN";
  }
}
