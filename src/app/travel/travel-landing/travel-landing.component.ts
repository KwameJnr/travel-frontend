import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { TravelService } from 'src/app/core/services/travel.service';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    NgIf,
    MatTooltipModule
  ],
  templateUrl: './travel-landing.component.html',
  styleUrl: './travel-landing.component.scss'
})
export class TravelLandingComponent implements OnInit {

  /* ===================== USER CONTEXT ===================== */
  userRole = localStorage.getItem('userRole');

  /* ===================== BADGE COUNTS ===================== */
  cfoPendingCount = 0;
  buPendingCount = 0;

  constructor(private travelService: TravelService) {}

  ngOnInit(): void {

    if (this.isCFO) {
      this.travelService.getCfoPendingCount().subscribe({
        next: count => this.cfoPendingCount = count,
        error: () => this.cfoPendingCount = 0
      });
    }

    if (this.isBUHead) {
      this.travelService.getBuPendingCount().subscribe({
        next: count => this.buPendingCount = count,
        error: () => this.buPendingCount = 0
      });
    }
  }

  /* ===================== ROLE GETTERS ===================== */
  get isAuthenticated() { return !!this.userRole; }
  get isAdmin() { return this.userRole === 'TR_ADMIN'; }
  get isBUHead() { return this.userRole === 'TR_BU_HEAD'; }
  get isCFO() { return this.userRole === 'TR_CFO'; }

  get canCreateTravel() {
    return this.userRole === 'TR_USER' || this.isAdmin;
  }

  get canViewTravel() {
    return this.canCreateTravel || this.isBUHead || this.isCFO;
  }
}


