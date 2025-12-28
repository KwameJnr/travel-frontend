import { Component, HostListener, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    NgIf
  ],
  template: `
    <mat-toolbar class="bank-toolbar">
      <div class="brand" routerLink="/travel/list">
        <img src="assets/images/fnb-logo.png" class="brand-logo" />
        <span class="brand-text">Travel Request Manager</span>
      </div>

      <span class="spacer"></span>

      <!-- NAV LINKS -->
      <ng-container *ngIf="isAuthenticated">
        <button mat-button *ngIf="canViewTravel" routerLink="/travel/list"
          [class.active-link]="currentUrl === '/travel/list'">Travel Requests</button>

        <button mat-button *ngIf="canCreateTravel" routerLink="/travel/create"
          [class.active-link]="currentUrl === '/travel/create'">Create Travel</button>

        <button mat-button *ngIf="isBUHead || isAdmin" routerLink="/travel/buhead/list"
          [class.active-link]="currentUrl.startsWith('/travel/buhead')">BU Head Approvals</button>

        <button mat-button *ngIf="isCFO || isAdmin" routerLink="/travel/cfo/list"
          [class.active-link]="currentUrl.startsWith('/travel/cfo/list')">CFO Approvals</button>

        <button mat-button *ngIf="isCFO || isAdmin" routerLink="/travel/cfo/dashboard"
          [class.active-link]="currentUrl.startsWith('/travel/cfo/dashboard')">CFO Dashboard</button>

        <!-- Admin Manage -->
        <ng-container *ngIf="isAdmin">
          <button mat-button [matMenuTriggerFor]="manageMenu"
            [class.active-link]="currentUrl.startsWith('/travel/perdiem')">Manage</button>
          <mat-menu #manageMenu="matMenu">
            <button mat-menu-item routerLink="/travel/perdiem/create"
              [class.active-link]="currentUrl.startsWith('/travel/perdiem/create')">Create Per Diem</button>
            <button mat-menu-item routerLink="/travel/perdiem/list"
              [class.active-link]="currentUrl.startsWith('/travel/perdiem/list')">List Per Diem</button>
          </mat-menu>
        </ng-container>
      </ng-container>

      <span class="spacer"></span>

      <!-- USER OVERLAY TRIGGER -->
      <ng-container *ngIf="isAuthenticated">
        <button mat-icon-button (click)="toggleUserOverlay()" class="user-trigger">
          <mat-icon>account_circle</mat-icon>
        </button>

        <div class="user-overlay" *ngIf="showUserOverlay" [class.show]="showUserOverlay">
          <div class="user-header">
            <div class="user-avatar">{{ userName?.charAt(0) || 'U' }}</div>
            <div class="user-meta">
              <div class="user-name">{{ userName }}</div>
              <div class="user-email">{{ loggedInEmail }}</div>
            </div>
          </div>

          <mat-divider></mat-divider>

          <div class="user-details">
            <div class="detail-row"><span class="label">Role</span><span class="value">{{ userRole }}</span></div>
            <div class="detail-row"><span class="label">F-Number</span><span class="value">{{ userFnumber }}</span></div>
          </div>

          <mat-divider></mat-divider>

          <button mat-button class="logout-btn" (click)="logout()">Logout</button>
        </div>
      </ng-container>
    </mat-toolbar>

    <div *ngIf="showWarning" class="logout-warning">
      ⚠️ You will be logged out in 1 minute due to inactivity.
    </div>

    <main class="layout-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .bank-toolbar { 
      position: sticky; top: 0; z-index: 1000; height: 64px; 
      background-color: #fff; color: #000; display: flex; padding: 0 20px; 
      border-bottom: 2px solid #149e97a1; 
    }
    .bank-toolbar .mat-mdc-button:hover, .bank-toolbar .mat-mdc-icon-button:hover { 
      background-color: rgba(39,184,189,0.08); 
    }

    .brand { display: flex; align-items: center; gap: 12px; cursor: pointer; }
    .brand-logo { height: 36px; object-fit: contain; }
    .brand-text { font-size: 1.2rem; font-weight: 600; }
    .spacer { flex: 1 1 auto; }
    button.mat-button { font-weight: 500; }

    button.mat-button.active-link {
      background-color: #27b8bd;
      color: #fff;
      border-radius: 4px;
    }

    /* USER OVERLAY */
    .user-overlay {
      position: absolute;
      top: 64px;
      right: 20px;
      width: 260px;
      background: #ffffff;
      border: 1px solid #149e97a1;
      border-radius: 8px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.2);
      padding: 16px;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      gap: 12px;
      opacity: 0;
      transform: translateY(-10px);
      transition: all 0.25s ease;
    }

    .user-overlay.show {
      opacity: 1;
      transform: translateY(0);
    }

    .user-avatar { 
      background-color: #149e97; color: #fff; width: 40px; height: 40px; 
      border-radius: 50%; display: flex; align-items: center; justify-content: center; 
      font-weight: 700; font-size: 1.2rem; 
    }
    .user-meta { display: flex; flex-direction: column; }
    .user-name { font-weight: 600; }
    .user-email { font-size: 0.85rem; color: #555; }
    .user-details { display: flex; flex-direction: column; gap: 4px; font-size: 0.85rem; }
    .detail-row { display: flex; justify-content: space-between; }
    .logout-btn { color: #d32f2f; font-weight: 600; justify-content: flex-start; }

    .logout-warning { position: fixed; top: 64px; width: 100%; background: #fff3cd; color: #856404; padding: 12px; text-align: center; font-weight: 500; z-index: 999; box-shadow: 0 2px 6px rgba(0,0,0,0.15); }

    .layout-content { padding: 24px; }
  `]
})
export class LayoutComponent implements OnInit, OnDestroy {
  loggedInEmail = localStorage.getItem('loggedInEmail');
  userRole = localStorage.getItem('userRole');
  userFnumber = localStorage.getItem('userFnumber');
  userName = localStorage.getItem('userName');

  showWarning = false;
  showUserOverlay = false;
  currentUrl = '';

  private logoutTimeout: any;
  private warningTimeout: any;
  private readonly INACTIVITY_LIMIT_MS = 10 * 60 * 1000;
  private readonly WARNING_BEFORE_MS = 1 * 60 * 1000;
  private routerSub!: Subscription;

  constructor(private router: Router, private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.routerSub = this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((event: any) => this.currentUrl = event.urlAfterRedirects);

    this.startInactivityWatcher();
  }

  ngOnDestroy(): void {
    this.clearTimeouts();
    if (this.routerSub) this.routerSub.unsubscribe();
  }

  /* ===================== ROLE GETTERS ===================== */
  get isAuthenticated() { return !!this.userRole; }
  get isAdmin() { return this.userRole === 'TR-ADMIN'; }
  get isBUHead() { return this.userRole === 'TR-BU_HEAD'; }
  get isCFO() { return this.userRole === 'TR-CFO'; }
  get canCreateTravel() { return this.userRole === 'TR-EMPLOYEE' || this.isAdmin; }
  get canViewTravel() { return this.canCreateTravel || this.isBUHead || this.isCFO; }

  /* ===================== INACTIVITY WATCHER ===================== */
  @HostListener('document:mousemove')
  @HostListener('document:keydown')
  @HostListener('document:scroll')
  resetTimer(): void {
    this.showWarning = false;
    this.clearTimeouts();
    this.startInactivityWatcher();
  }

  private startInactivityWatcher(): void {
    this.warningTimeout = setTimeout(() => this.showWarning = true, this.INACTIVITY_LIMIT_MS - this.WARNING_BEFORE_MS);
    this.logoutTimeout = setTimeout(() => this.logout(true), this.INACTIVITY_LIMIT_MS);
  }

  private clearTimeouts(): void {
    if (this.logoutTimeout) clearTimeout(this.logoutTimeout);
    if (this.warningTimeout) clearTimeout(this.warningTimeout);
  }

  /* ===================== LOGOUT ===================== */
  logout(auto = false): void {
    this.showWarning = false;
    this.showUserOverlay = false;
    localStorage.clear();
    if (auto) alert('You were logged out due to inactivity.');
    this.router.navigateByUrl('tent/travel-request/login');
  }

  /* ===================== USER OVERLAY ===================== */
  toggleUserOverlay(): void { setTimeout(() => this.showUserOverlay = !this.showUserOverlay); }
  closeUserOverlay(): void { this.showUserOverlay = false; }

  /* ===================== CLOSE ON OUTSIDE CLICK ===================== */
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (!this.showUserOverlay) return;
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside && this.showUserOverlay) this.closeUserOverlay();
  }
}
