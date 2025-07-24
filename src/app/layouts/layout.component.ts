import { Component } from '@angular/core';
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
      <ng-container *ngIf="isAdmin">
        <mat-menu #adminMenu="matMenu">
          <button mat-menu-item [routerLink]="'/travel/perdiem/create'">Create Per Diem</button>
          <button mat-menu-item [routerLink]="'/travel/perdiem/list'">List Per Diem</button>
          <button mat-menu-item [routerLink]="'/travel/buhead/create'">Create BU Head</button>
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
        <button mat-menu-item disabled>Logged in as: <strong>{{ loggedInEmail }}</strong></button>
        <button mat-menu-item (click)="logout()">Logout</button>
      </mat-menu>
      <button mat-icon-button [matMenuTriggerFor]="userMenu">
        <mat-icon>account_circle</mat-icon>
      </button>
    </mat-toolbar>

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
  
    button, .mat-button, .mat-icon-button {
      color: black;
    }
  `]
})
export class LayoutComponent {
  loggedInEmail = localStorage.getItem('loggedInEmail') || 'Guest';
  userRole = localStorage.getItem('userRole') || 'Guest';

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

  logout() {
    // Clear token and redirect to login
    localStorage.removeItem('loggedInEmail');
    location.href = '/login';
  }
}
