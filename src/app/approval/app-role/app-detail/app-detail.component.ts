// app-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

import { TravelService } from 'src/app/core/services/travel.service';
import { ApplicationRole } from 'src/app/shared/models/app/application-role-model';


@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    DatePipe,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './app-detail.component.html',
  styleUrls: ['./app-detail.component.scss']
})
export class AppDetailComponent implements OnInit {

  role?: ApplicationRole;
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private travelService: TravelService,
  ) {}

  ngOnInit(): void {
    const roleId = Number(this.route.snapshot.paramMap.get('id'));

    if (!roleId) {
      this.errorMessage = 'Invalid role ID';
      this.loading = false;
      return;
    }

    this.loadRole(roleId);
  }

  loadRole(id: number): void {
    this.loading = true;

    this.travelService.getApplicationRoleDetails(id).subscribe({
      next: (role) => {
        this.role = role;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load role details', err);
        this.errorMessage = 'Failed to load role details';
        this.loading = false;
      }
    });
  }

  back(): void {
    this.router.navigate(['/travel/app/list']);
  }

  edit(roleId: number): void {
    this.router.navigate(['travel/app/edit', roleId]);
  }
}

