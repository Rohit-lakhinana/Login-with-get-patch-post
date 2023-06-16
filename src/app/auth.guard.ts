import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    if (this.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']); // Redirect to login if not logged in
      return false;
    }
  } 

  isLoggedIn(): boolean {
    // Implement your logic to check if the user is logged in
    // For example, you can check if the token exists in session storage
    const token = sessionStorage.getItem('token');
    return !!token; // Return true if the token exists, false otherwise
  }
}
