import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Protege las rutas internas (requiere estar logueado)
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Si no está logueado, redirigir a login
  router.navigate(['/login']);
  return false;
};

/**
 * Protege las rutas públicas como Login (evita entrar si ya estás logueado)
 */
export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  // Si ya está logueado y trata de ir a login, redirigir a la app
  router.navigate(['/welcome']);
  return false;
};
