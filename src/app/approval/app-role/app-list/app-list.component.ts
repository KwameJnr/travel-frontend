// app-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { TravelService } from 'src/app/core/services/travel.service';


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    DatePipe,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.scss']
})
export class AppListComponent implements OnInit {

  displayedColumns: string[] = [
    'name',
    'created',
    'updated',
    'actions'
  ];

  roles: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private travelService: TravelService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.loading = true;

    this.travelService.getApplicationRoles().subscribe({
      next: (res) => {
        this.roles = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load application roles', err);
        this.errorMessage = 'Failed to load application roles';
        this.loading = false;
      }
    });
  }

  viewDetails(roleId: number): void {
    this.router.navigate(['travel/app/detail', roleId]);
  }

  editRole(roleId: number): void {
    this.router.navigate(['/app/edit', roleId]);
  }
}

