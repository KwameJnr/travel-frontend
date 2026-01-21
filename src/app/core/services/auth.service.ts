import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private _isAuthenticated$ = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this._isAuthenticated$.asObservable();

  constructor() {
    this.restoreAuthState();
  }

  private restoreAuthState(): void {
    const token = localStorage.getItem('userToken');
    this._isAuthenticated$.next(!!token);
  }

  isAuthenticated(): boolean {
    return this._isAuthenticated$.value;
  }

  login(token: string): void {
    localStorage.setItem('userToken', token);
    this._isAuthenticated$.next(true);

    
  // Preload heavy PDF libraries in the background
    // import('html2pdf.js');
    // import('html2canvas');
  }

  logout(): void {
    localStorage.clear();
    this._isAuthenticated$.next(false);
  }
}



