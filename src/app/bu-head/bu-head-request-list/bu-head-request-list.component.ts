import { Component, OnInit } from '@angular/core';
import { TravelService } from 'src/app/core/services/travel.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-buhead-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './bu-head-Request-list.component.html',
  styleUrls: ['./bu-head-Request-list.component.scss']
})
export class BuheadListComponent implements OnInit {
  travelRequests: any[] = [];
  loading = true;
  displayedColumns: string[] = ['employeeName', 'purpose', 'departureDate', 'status', 'actions'];

  constructor(private travelService: TravelService, private router: Router) {}

  ngOnInit(): void {
    this.travelService.getPendingRequestsForBuHead().subscribe({
      next: (res) => {
        this.travelRequests = res; // Extract the actual travel request array
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load travel requests', err);
        this.loading = false;
      }
    });
  }
  

  viewDetails(id: string) {
    this.router.navigate(['/travel/buhead/detail', id]);
  }
}