import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from "rxjs";
import { finalize } from "rxjs/operators";

import { SpinnerOverlayService } from "../services/spinner-overlay.service";

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  constructor(private readonly spinnerOverlayService: SpinnerOverlayService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const spinnerSubscription: Subscription = this.spinnerOverlayService.spinner$.subscribe();
    return next.handle(req).pipe(finalize(() => spinnerSubscription.unsubscribe()));
  }
}

export const httpOverlayInterceptorProvider = [
  { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true }
];
