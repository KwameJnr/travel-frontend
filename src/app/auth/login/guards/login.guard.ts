import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('userToken');

  // If logged in, redirect to dashboard
  if (token) {
    router.createUrlTree(['/travel/list']);
    return false;
  }

  return true;
};

