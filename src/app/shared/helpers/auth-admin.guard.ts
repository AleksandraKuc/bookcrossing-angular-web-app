import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import {TokenStorageService} from "./services/token-storage.service";

@Injectable({ providedIn: 'root' })
export class AuthAdminGuard implements CanActivate {

  constructor(private router: Router,
              private tokenStorage: TokenStorageService,
              private snackBar: MatSnackBar) {}

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot) {

    const username = this.tokenStorage.getUsername();
    const roles = this.tokenStorage.getAuthorities()
    if (username && roles[0] === "ROLE_ADMIN") {
      // authorised so return true
      return true;
    }

    this.openSnackBar();
    this.router.navigate(['/']);
    return false;
  }

  openSnackBar(): void {
    let config = new MatSnackBarConfig();
    config.duration = 5000;
    let message = "You are not authorized to view this page";
    this.snackBar.open(message, "x", config);
  }
}
