import { Component, OnInit } from '@angular/core';
import { TravelService } from 'src/app/core/services/travel.service';
import { Travel } from 'src/app/shared/models/travel/travel.model';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-travel-list',
  templateUrl: './travel-list.component.html',
  styleUrls: ['./travel-list.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule
  ]
})
export class TravelListComponent implements OnInit {
  travels: Travel[] = [];
  displayedColumns: string[] = ['employeeName', 'purpose', 'country', 'actions'];
  loading = false;

  constructor(private travelService: TravelService) {}

  ngOnInit(): void {
    this.fetchTravels();
  }

  fetchTravels(): void {
    this.loading = true;
    this.travelService.getAll().subscribe({
      next: (data) => {
        this.travels = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load travel data', err);
        this.loading = false;
      }
    });
  }

  deleteTravel(id: string | undefined): void {
    if (!id) return;

    if (confirm('Are you sure you want to delete this travel request?')) {
      this.travelService.delete(id).subscribe({
        next: () => this.fetchTravels(),
        error: (err) => console.error('Failed to delete', err)
      });
    }
  }
}

