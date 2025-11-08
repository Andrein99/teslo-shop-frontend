import { HttpRequest, HttpHandlerFn, HttpEvent, HttpEventType } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "@auth/services/auth.service";
import { Observable, tap } from "rxjs";

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  /**
   * Función que intercepta las peticiones HTTP y añade el token de autenticación en el encabezado Authorization.
   * @param req La solicitud HTTP entrante.
   * @param next La función manejadora de la solicitud HTTP.
   * @returns Un Observable que emite los eventos HTTP.
   */
  const token = inject(AuthService).token();

  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`),
  });
  return next(newReq);
}
