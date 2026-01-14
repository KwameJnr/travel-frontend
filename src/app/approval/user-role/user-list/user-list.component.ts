// user-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TravelService } from 'src/app/core/services/travel.service';
import { UserRole } from 'src/app/shared/models/app/user-role-models';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  displayedColumns: string[] = [
    'roleName',
    'fNumber',
    'created',
    'actions'
  ];

  userRoles: UserRole[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private travelService: TravelService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserRoles();
  }

  loadUserRoles(): void {
    this.loading = true;
    this.travelService.getUserRoles().subscribe({
      next: (roles) => {
        this.userRoles = roles;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load user roles', err);
        this.errorMessage = 'Failed to load user roles';
        this.loading = false;
      }
    });
  }

  viewDetails(userRoleId: number): void {
    this.router.navigate(['/travel/user/detail', userRoleId]);
  }

  editUserRole(userRoleId: number): void {
    this.router.navigate(['/travel/user/edit', userRoleId]);
  }
}

