import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import {TokenStorageService} from "./services/token-storage.service";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private tokenStorage: TokenStorageService,
              private snackBar: MatSnackBar) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const username = this.tokenStorage.getUsername();
    if (username) {
      // authorised so return true
      return true;
    }

    this.openSnackBar();
    this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }

  openSnackBar(): void {
    let config = new MatSnackBarConfig();
    config.duration = 5000;
    let message = "You have to log in to see this page";
    this.snackBar.open(message, "x", config);
  }
}
