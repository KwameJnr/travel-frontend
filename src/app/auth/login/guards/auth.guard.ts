import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

const roleRoutes: Record<string, string[]> = {
  EMPLOYEE: ['/travel'],
  BU_HEAD: ['/buhead'],
  CFO: ['/cfo'],
  ADMIN: ['ALL'],
};

function normalizeUrl(url: string): string {
  return url.replace(/^#/, '').split('?')[0].toLowerCase();
}

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('userToken');
  const role = localStorage.getItem('userRole');
  const email = localStorage.getItem('loggedInEmail');
  const requestedUrl = normalizeUrl(state.url);

  // ✅ Allow login page for everyone
  if (requestedUrl === '/login') return true;

  // ✅ Allow landing page for all logged-in users
  if (requestedUrl === '/travel/landing' && token && role && email) return true;

  // Case 1: Not logged in → redirect to login
  if (!token || !role || !email) {
    return router.createUrlTree(['/login']);
  }

  // Case 2: Logged in → check role access
  const allowedRoutes = roleRoutes[role] ?? [];

  if (allowedRoutes.includes('ALL')) return true;

  const hasAccess = allowedRoutes.some(prefix => requestedUrl.includes(prefix.toLowerCase()));

  // Case 3: Logged in but forbidden → redirect to unauthorized
  return hasAccess ? true : router.createUrlTree(['/unauthorized']);
};
