import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-travel-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    NgIf
  ],
  templateUrl: './travel-landing.component.html',
  styleUrl: './travel-landing.component.scss'
})
export class TravelLandingComponent {

  /* ===================== SAME STORAGE SOURCE ===================== */
  userRole = localStorage.getItem('userRole');

  /* ===================== SAME ROLE GETTERS ===================== */
  get isAuthenticated() { return !!this.userRole; }
  get isAdmin() { return this.userRole === 'TR-ADMIN'; }
  get isBUHead() { return this.userRole === 'TR-BU_HEAD'; }
  get isCFO() { return this.userRole === 'TR-CFO'; }
  get canCreateTravel() {
    return this.userRole === 'TR-EMPLOYEE' || this.isAdmin;
  }
  get canViewTravel() {
    return this.canCreateTravel || this.isBUHead || this.isCFO;
  }
}


