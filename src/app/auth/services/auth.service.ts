import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';

import type { AuthResponse } from '@auth/interfaces/auth-response.interface';
import type { User } from '@auth/interfaces/user.interface';
import { environment } from 'src/environments/environment';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated'
const baseUrl = environment.baseUrl;

@Injectable({providedIn: 'root'})
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User|null>(null);
  private _token = signal<string|null>(localStorage.getItem('token'));

  private httpClient = inject(HttpClient);
  router = inject(Router);

  checkStatusResource = rxResource({ // Recurso reactivo para verificar el estado de autenticación
    stream: () => this.checkStatus(),
  });

  constructor() {
    effect(() => {
      // Observar cambios en el estado de autenticación
      if (this.authStatus() === 'not-authenticated') {
        // Asegurar que la navegación ocurra después de que el estado se actualice
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 0);
      }
    });
  }

  authStatus = computed<AuthStatus>(() => {
    /**
     * Computed property para obtener el estado de autenticación
     * @returns AuthStatus - Estado de autenticación actual
     */
    if (this._authStatus() === 'checking') return 'checking';

    if (this._user()) {
      return 'authenticated';
    }

    return 'not-authenticated';
  })

  user = computed<User|null>(() => this._user());
  token = computed(this._token);
  isAdmin = computed(() => this._user()?.roles.includes('admin') ?? false);

  register(email: string, password: string, fullName: string): Observable<boolean> {
    /**
     * Función para registrar un nuevo usuario
     * @param email - Correo electrónico del usuario
     * @param password - Contraseña del usuario
     * @param fullName - Nombre completo del usuario
     * @returns Observable<boolean> - Indica si el registro fue exitoso
     */
    return this.httpClient.post<AuthResponse>(`${baseUrl}/auth/register`, {
      email: email,
      password: password,
      fullName: fullName
    }).pipe(
      map((resp) => this.handleAuthSuccess(resp)),
      catchError((error: any) => this.handleAuthError(error))
    )
  }

  login(email: string, password: string): Observable<boolean> {
    /**
     * Función para autenticar un usuario existente
     * @param email - Correo electrónico del usuario
     * @param password - Contraseña del usuario
     * @returns Observable<boolean> - Indica si el inicio de sesión fue exitoso
     */
    return this.httpClient.post<AuthResponse>(`${baseUrl}/auth/login`, {
      email: email,
      password: password,
    }).pipe(
      map((resp) => this.handleAuthSuccess(resp)),
      catchError((error: any) => this.handleAuthError(error))
    )
  }

  checkStatus():Observable<boolean> {
    /**
     * Función para verificar el estado de autenticación del usuario
     * @returns Observable<boolean> - Indica si el usuario está autenticado
     */
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    return this.httpClient.get<AuthResponse>(`${baseUrl}/auth/check-status`, {
      // headers: {
      //   Authorization: `Bearer ${token}`
      // }
    }).pipe(
      map((resp) => this.handleAuthSuccess(resp)),
      catchError((error: any) => this.handleAuthError(error))
    );
  }

  logout() {
    /**
     * Función para cerrar la sesión del usuario
     */
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');

    localStorage.removeItem('token');
  }

  private handleAuthSuccess({ token, user }: AuthResponse) {
    /**
     * Función para manejar el éxito de la autenticación
     * @param token - Token de autenticación
     * @param user - Información del usuario autenticado
     * @returns boolean - Indica que la autenticación fue exitosa
     */
    this._user.set(user);
    this._authStatus.set('authenticated');
    this._token.set(token);

    localStorage.setItem('token', token);
    return true;
  }

  private handleAuthError(error: any) {
    /**
     * Función para manejar errores de autenticación
     * @param error - Objeto de error
     * @returns Observable<boolean> - Indica que la autenticación falló
     */
    this.logout();
    return of(false);
  }
}
