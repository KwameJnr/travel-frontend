import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

const roleRoutes: Record<string, string[]> = {
  EMPLOYEE: ['/travels', '/travels/list', '/travels/detail/:id'],
  BU_HEAD: ['/buhead', '/buhead/list', '/buhead/detail/:id'],
  CFO: ['/cfo', '/cfo/dashboard', '/cfo/list'],
  ADMIN: ['ALL']
};

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const role = localStorage.getItem('userRole');
  const email = localStorage.getItem('loggedInEmail');
  const requestedUrl = state.url;

  if (!role || !email) {
    return router.createUrlTree(['/login']);
  }

  const allowedRoutes = roleRoutes[role] || [];

  if (allowedRoutes.includes('ALL')) return true;

  const hasAccess = allowedRoutes.some(r => requestedUrl.startsWith(r));
  if (hasAccess) return true;

  return router.createUrlTree(['/login/unauthorized']);
};


// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

// import { Injectable } from '@angular/core';
// import { roleRoutes } from './roleRoutes';

// @Injectable({
//   providedIn: 'root'
// })
// export class authGuard implements CanActivate {
  

//   constructor(private router: Router) {}

//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
//     const role = localStorage.getItem('userRole');  // Role must be stored on login
//     const email = localStorage.getItem('loggedInEmail');

//     if (!role || !email) {
//       this.router.navigate(['/login']);
//       return false;
//     }

//     const allowedRoutes = roleRoutes[role] || [];
//     const requestedUrl = state.url;

//     if (allowedRoutes.includes('ALL') || allowedRoutes.includes(requestedUrl)) {
//       return true;
//     }

//     // Unauthorized
//     this.router.navigate(['login/unauthorized']);  // (Optional page)
//     return false;
//   }
// }
