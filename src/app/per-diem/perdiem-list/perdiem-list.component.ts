import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PerdiemService } from 'src/app/core/services/perdiem.service';
import { PerDiem } from 'src/app/shared/models/perdiem/perdiem.model';

@Component({
  selector: 'app-perdiem-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  templateUrl: './perdiem-list.component.html',
   styleUrl: './perdiem-list.component.scss'
})
export class PerdiemListComponent implements OnInit {
  travelRequests: any[] = [];
  perdiem: PerDiem[] = [];
  loading = true;
  displayedColumns: string[] = ['dollarRate', 'country', 'airFareCost', 'actions'];

  constructor(private perdiemService: PerdiemService, private router: Router) {}

  ngOnInit(): void {
    const loggedInEmail = localStorage.getItem('loggedInEmail');
    if (!loggedInEmail) {
      this.router.navigate(['/login']);
    } else {
      this.fetchPerdiems();
    }
  }

  fetchPerdiems(): void {
    this.loading = true;
    this.perdiemService.getAll().subscribe({
      next: (data) => {
        const loggedInEmail = localStorage.getItem('loggedInEmail');
        this.perdiem = data
          .sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load travel data', err);
        this.loading = false;
      }
    });
  }
  viewDetails(id: string) {
    this.router.navigate(['/travel/perdiem/detail', id]);
  }
}

