import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

const roleRoutes: Record<string, string[]> = {
  EMPLOYEE: ['/travel/list', '/travel/detail/'],
  BU_HEAD: ['/buhead/list', '/buhead/detail/'],
  CFO: ['/cfo/dashboard', '/cfo/list'],
  ADMIN: ['ALL']
};

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('userToken');
  const role = localStorage.getItem('userRole');
  const email = localStorage.getItem('loggedInEmail');
  const requestedUrl = state.url;

  // ✅ Allow login page for everyone
  if (requestedUrl === '/login') return true;

  // ✅ Allow landing page for all logged-in users
  if (requestedUrl === '/travel/landing' && token && role && email) return true;

  // Case 1: Not logged in → redirect to login
  if (!token || !role || !email) {
    return router.createUrlTree(['/login']);
  }

  // Case 2: Logged in → check role access
  const allowedRoutes = roleRoutes[role] || [];

  if (allowedRoutes.includes('ALL')) return true;

  const hasAccess = allowedRoutes.some(prefix => requestedUrl.startsWith(prefix));

  // Case 3: Logged in but forbidden → redirect to unauthorized
  return hasAccess ? true : router.createUrlTree(['/unauthorized']);
};
