import { HttpInterceptor, HttpHandler } from "@angular/common/http";
import { HttpRequest, HttpEvent } from "@angular/common/module.d-CnjH8Dlt";
import { Injectable } from "@angular/core";
import { EMPTY, Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.router.navigate(['/login']);
      return EMPTY;
    }
    
    const token = this.authService.getToken();

    const cloned = request.clone({
      setHeaders: {
        Authorization: `Token ${token}`
      }
    });
    return next.handle(cloned);
  }
}