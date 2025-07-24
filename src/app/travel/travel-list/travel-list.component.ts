import { Component, OnInit } from '@angular/core';
import { TravelService } from 'src/app/core/services/travel.service';
import { Travel } from 'src/app/shared/models/travel/travel.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

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
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    NgChartsModule
  ]
})
export class TravelListComponent implements OnInit {
  travels: Travel[] = [];
  displayedColumns: string[] = ['employeeName', 'purpose', 'country', 'date', 'status', 'actions'];
  loading = false;

  pieChartData: any = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
    }]
  };

  barChartData: any = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [{
      label: 'Travel Requests',
      data: [0, 0, 0],
      backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
    }]
  };

  constructor(private travelService: TravelService, private router: Router) {}

  ngOnInit(): void {
    const loggedInEmail = localStorage.getItem('loggedInEmail');
    if (!loggedInEmail) {
      this.router.navigate(['/login']);
    } else {
      this.fetchTravels();
    }
  }

  fetchTravels(): void {
    this.loading = true;
    this.travelService.getAll().subscribe({
      next: (data) => {
        const loggedInEmail = localStorage.getItem('loggedInEmail');
        this.travels = data
          .filter((travel: Travel) => travel.employeeEmail === loggedInEmail)
          .sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
        
        this.updateAnalytics();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load travel data', err);
        this.loading = false;
      }
    });
  }

  updateAnalytics(): void {
    const counts = { Approved: 0, Pending: 0, Rejected: 0 };
    this.travels.forEach(travel => {
      const status = (travel.status || '').toLowerCase();
      const cfoStatus = (travel.cfoFeedback || '').toLowerCase();
      if (status.includes('cfo approval successful')) counts.Approved++;
      else if (status.includes('pending')) counts.Pending++;
      else if (cfoStatus.includes('rejected')) counts.Rejected++;
    });

    const data = [counts.Approved, counts.Pending, counts.Rejected];

    this.pieChartData = {
      labels: ['Approved', 'Pending', 'Rejected'],
      datasets: [{
        data: data,
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
      }]
    };

    this.barChartData = {
      labels: ['Approved', 'Pending', 'Rejected'],
      datasets: [{
        label: 'Travel Requests',
        data: data,
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
      }]
    };
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