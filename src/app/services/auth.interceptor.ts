import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtToken } from "./jwt-token";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler) {
    const token = JwtToken.get();
    if (!token) return next.handle(request);
    const requestWithToken = request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next.handle(requestWithToken);
  }
}
