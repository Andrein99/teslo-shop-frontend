import { HttpEvent, HttpEventType, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable, tap } from "rxjs";

export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  /**
   * Interceptor que loggea en consola la url de la peticion
   * y el status de la respuesta.
   * @param req - HttpRequest<unknown>
   * @param next - HttpHandlerFn
   * @returns Observable<HttpEvent<unknown>>
   */
  return next(req).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response) {
        console.log(req.url, 'returned a response with status', event.status);
      }
    })
  );
}
