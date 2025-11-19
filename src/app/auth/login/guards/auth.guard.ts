import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

const roleRoutes: Record<string, string[]> = {
  EMPLOYEE: ['/travels', '/travels/list', '/travels/detail/'],
  BU_HEAD: ['/buhead', '/buhead/list', '/buhead/detail/'],
  CFO: ['/cfo', '/cfo/dashboard', '/cfo/list'],
  ADMIN: ['ALL']
};

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('userToken');
  const role = localStorage.getItem('userRole');
  const email = localStorage.getItem('loggedInEmail');
  const requestedUrl = state.url;

  if (!token || !role || !email) {
    return router.createUrlTree(['/login']);
  }

  const allowedRoutes = roleRoutes[role] || [];

  if (allowedRoutes.includes('ALL')) return true;

  const hasAccess = allowedRoutes.some(prefix => requestedUrl.startsWith(prefix));

  return hasAccess 
    ? true 
    : router.createUrlTree(['/login/unauthorized']);
};


// import { CanActivateFn, Router } from '@angular/router';
// import { inject } from '@angular/core';

// const roleRoutes: Record<string, string[]> = {
//   EMPLOYEE: ['/travel', '/travel/list', '/travel/detail/:id'],
//   BU_HEAD: ['/buhead', '/buhead/list', '/buhead/detail/:id'],
//   CFO: ['/cfo', '/cfo/dashboard', '/cfo/list'],
//   ADMIN: ['ALL']
// };

// export const authGuard: CanActivateFn = (route, state) => {
//   const router = inject(Router);
//   const token = localStorage.getItem('userToken');
//   const role = localStorage.getItem('userRole');
//   const email = localStorage.getItem('loggedInEmail');
//   const requestedUrl = state.url;

//   if (!token || !role || !email) {
//     return router.createUrlTree(['/login']);
//   }

//   const allowedRoutes = roleRoutes[role] || [];

//   if (allowedRoutes.includes('ALL')) return true;

//   const hasAccess = allowedRoutes.some(r => requestedUrl.startsWith(r));
//   if (hasAccess) return true;

//   return router.createUrlTree(['/login/unauthorized']);
// };
