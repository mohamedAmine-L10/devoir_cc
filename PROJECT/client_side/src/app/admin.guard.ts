import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // Set during login

  if (token && userRole === 'admin') {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
