import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterModule, 
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    MatMenuModule
  ],
  template: `
    <mat-toolbar color="primary" class="top-toolbar">
      <span class="logo">Travel Request Manager</span>

      <span class="spacer"></span>

      <!-- Admin Dropdown -->
      <mat-menu #adminMenu="matMenu">
        <button mat-menu-item [routerLink]="'/travel/list'">Travel Requests</button>
        <button mat-menu-item [routerLink]="'/travel/buhead/create'">Create BU Head</button>
      </mat-menu>

      <button mat-button [matMenuTriggerFor]="adminMenu">Manage</button>

      <!-- Other tabs -->
      <button mat-button [routerLink]="'/travel/create'">Create Travel</button>
      <button mat-button routerLink="/travel/buhead/list">BU Head Approvals</button>
      <button mat-button routerLink="/travel/cfo/list">CFO Approvals</button>
      <button mat-button routerLink="/travel/cfo/dashboard">CFO Dashboard</button>
      <span class="spacer"></span>
      <!-- <span class="spacer"></span> -->

      <!-- Navigation Tabs -->
      <!-- <button mat-button routerLink="/travel/list">Travel Requests</button>
      <button mat-button routerLink="/travel/create">Create Request</button>
      <button mat-button routerLink="/travel/buhead/list">BU Head Approvals</button>
      <button mat-button routerLink="/travel/cfo/list">CFO Approvals</button>

      <span class="spacer"></span> -->

      <!-- User info & Logout -->
      <mat-menu #userMenu="matMenu">
        <!-- <button mat-menu-item disabled>Logged in as: <strong>employee@example.com</strong></button> -->
        <button mat-menu-item disabled>Logged in as: <strong>employee&#64;example.com</strong></button>
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
  logout() {
    // Clear token and redirect to login
    localStorage.removeItem('loggedInEmail');
    location.href = '/login';
  }
}
