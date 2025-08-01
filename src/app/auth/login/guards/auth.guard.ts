import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Injectable } from '@angular/core';
import { roleRoutes } from './roleRoutes';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const role = localStorage.getItem('userRole');  // Role must be stored on login
    const email = localStorage.getItem('loggedInEmail');

    if (!role || !email) {
      this.router.navigate(['/login']);
      return false;
    }

    const allowedRoutes = roleRoutes[role] || [];
    const requestedUrl = state.url;

    if (allowedRoutes.includes('ALL') || allowedRoutes.includes(requestedUrl)) {
      return true;
    }

    // Unauthorized
    this.router.navigate(['login/unauthorized']);  // (Optional page)
    return false;
  }
}
