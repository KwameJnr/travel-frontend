// user-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TravelService } from 'src/app/core/services/travel.service';
import { UserRole } from 'src/app/shared/models/app/user-role-models';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  userRole?: UserRole;
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private travelService: TravelService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.errorMessage = 'Invalid User Role ID';
      this.loading = false;
      return;
    }

    this.loadUserRole(id);
  }

  loadUserRole(id: number): void {
    this.loading = true;

    this.travelService.getUserRoleDetails(id).subscribe({
      next: (role) => {
        this.userRole = role;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load user role details', err);
        this.errorMessage = 'Failed to load user role details';
        this.loading = false;
      }
    });
  }

  back(): void {
    this.router.navigate(['travel/user/list']);
  }

  edit(): void {
    if (this.userRole) {
      this.router.navigate(['/travel/user/edit', this.userRole.userRoleId]);
    }
  }
}

