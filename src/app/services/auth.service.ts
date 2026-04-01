import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// TODO [CONCEPT: Services & Dependency Injection]
// Services are classes decorated with @Injectable that hold reusable logic.
// providedIn: 'root' means Angular creates a SINGLETON instance app-wide.
// This is Dependency Injection — Angular injects this service wherever it's needed.
@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private router: Router) {} // TODO: Router is injected via DI

  login(username: string, password: string): boolean {
    // TODO: In a real app, you'd call an API via HttpClient here
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('user', JSON.stringify({ username, role: 'admin' }));
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  getUser(): { username: string; role: string } | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }
}
