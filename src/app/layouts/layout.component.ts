import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterModule, 
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    MatMenuModule,
    NgIf
  ],
  template: `
    <mat-toolbar color="primary" class="top-toolbar">
      <span class="logo">Travel Request Manager</span>

      <span class="spacer"></span>

      <!-- Admin Dropdown -->
      <ng-container *ngIf="isAdmin || canCreateTravel">
        <mat-menu #adminMenu="matMenu">
          <button mat-menu-item [routerLink]="'/travel/perdiem/create'">Create Per Diem</button>
          <button mat-menu-item [routerLink]="'/travel/perdiem/list'">List Per Diem</button>
          <!-- <button mat-menu-item [routerLink]="'/travel/buhead/create'">Create BU Head</button> -->
        </mat-menu>
        <button mat-button [matMenuTriggerFor]="adminMenu">Manage</button>
      </ng-container>

      <!-- Common Tabs -->
      <button mat-button [routerLink]="'/travel/list'" *ngIf="canCreateTravel || isBUHead || isCFO || isAdmin" >Travel Requests</button>
      <button mat-button [routerLink]="'/travel/create'" *ngIf="canCreateTravel || isBUHead || isCFO || isAdmin">Create Travel</button>
      <button mat-button routerLink="/travel/buhead/list" *ngIf="isBUHead || isAdmin">BU Head Approvals</button>
      <button mat-button routerLink="/travel/cfo/list" *ngIf="isCFO || isAdmin">CFO Approvals</button>
      <button mat-button routerLink="/travel/cfo/dashboard" *ngIf="isCFO || isAdmin">CFO Dashboard</button>
      
      <span class="spacer"></span>

      <!-- User info & Logout -->
      <mat-menu #userMenu="matMenu">
        <button mat-menu-item disabled>Logged in as: <strong>{{ userName }}</strong></button>
        <button mat-menu-item disabled>Email: <strong>{{ loggedInEmail }}</strong></button>
        <button mat-menu-item disabled>System Role: <strong>{{ userRole }}</strong></button>
        <button mat-menu-item disabled>F-Number: <strong>{{ userFnumber }}</strong></button>
        <button mat-menu-item disabled>Mobile: <strong>{{ userMobile }}</strong></button>
        <button mat-menu-item disabled>Job Title: <strong>{{ userTitle }}</strong></button>
        <button mat-menu-item (click)="logout()">Logout</button>
      </mat-menu>
      <button mat-icon-button [matMenuTriggerFor]="userMenu">
        <mat-icon>account_circle</mat-icon>
      </button>
    </mat-toolbar>
    <div *ngIf="showWarning" class="logout-warning">
  ⚠️ You will be logged out in 1 minute due to inactivity. Move your mouse or press a key to stay logged in.
    </div>

    <router-outlet></router-outlet>
  `,
  styles: [`
    .top-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background-color: #048a73;
      color: white; /* Ensures text and icons are visible */
    }
  
    .logo {
      font-weight: bold;
      font-size: 1.3rem;
    }
  
    .spacer {
      flex: 1 1 auto;
    }

    .logout-warning {
    background-color: #fff3cd;
    color: #856404;
    padding: 12px;
    text-align: center;
    font-weight: bold;
    position: fixed;
    top: 64px; // adjust based on your header height
    width: 100%;
    z-index: 1000;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
    button, .mat-button, .mat-icon-button {
      color: black;
    }
  `]
})
export class LayoutComponent {
  private logoutTimeout: any;
  private warningTimeout: any;

  private readonly INACTIVITY_LIMIT_MS = 10 * 60 * 1000; // 10 minutes
  private readonly WARNING_BEFORE_MS = 1 * 60 * 1000;     // 1 minute before logout

  showWarning = false;

  loggedInEmail = localStorage.getItem('loggedInEmail') || 'Guest';
  userRole = localStorage.getItem('userRole') || 'Guest';

  userFnumber = localStorage.getItem('userFnumber');
  userMobile = localStorage.getItem('userMobile');
  userTitle = localStorage.getItem('userTitle');
  userName = localStorage.getItem('userName');

  get isAdmin() {
    return this.userRole === 'TR-ADMIN';
  }

  get isBUHead() {
    return this.userRole === 'TR-BU_HEAD';
  }

  get isCFO() {
    return this.userRole === 'TR-CFO';
  }

  get canCreateTravel() {
    return this.userRole === 'TR-EMPLOYEE' || this.isAdmin;
  }

  ngOnInit() {
    this.startInactivityWatcher();
  }

  ngOnDestroy() {
    this.clearTimeouts();
  }

  @HostListener('document:mousemove')
  @HostListener('document:keydown')
  @HostListener('document:click')
  @HostListener('document:scroll')
  resetTimer() {
    this.showWarning = false;
    this.clearTimeouts();
    this.startInactivityWatcher();
  }

  startInactivityWatcher() {
    // Show warning 1 minute before logout
    this.warningTimeout = setTimeout(() => {
      this.showWarning = true;
    }, this.INACTIVITY_LIMIT_MS - this.WARNING_BEFORE_MS);

    // Perform logout after full timeout
    this.logoutTimeout = setTimeout(() => {
      this.logout(true);
    }, this.INACTIVITY_LIMIT_MS);
  }

  clearTimeouts() {
    if (this.logoutTimeout) {
      clearTimeout(this.logoutTimeout);
    }
    if (this.warningTimeout) {
      clearTimeout(this.warningTimeout);
    }
  }

  logout(auto: boolean = false) {
    this.showWarning = false;
    // Clear token and redirect to login
    localStorage.removeItem('loggedInEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userFnumber');
    localStorage.removeItem('userMobile');
    localStorage.removeItem('userName');
    if (auto) {
      alert('You were logged out due to inactivity.');
    }
    location.href = 'tent/travel-request/login';
  }
}
