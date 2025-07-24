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
  selector: 'app-cfo-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './cfo-list.component.html',
  styleUrl: './cfo-list.component.scss'
})
export class CfoListComponent implements OnInit {
  travelRequests: any[] = [];
  loading = true;
  displayedColumns: string[] = ['employeeName', 'purpose', 'departureDate', 'status', 'actions'];

  constructor(private travelService: TravelService, private router: Router) {}

  ngOnInit(): void {
    const userRole = localStorage.getItem('userRole');

  if (userRole !== 'TR-CFO' && userRole !== 'TR-ADMIN') {
    this.router.navigate(['/unauthorized']);  // Redirect unauthorized users
    return;
  }
  
    this.travelService.getPendingRequestsForCfo().subscribe({
      next: (res) => {
        this.travelRequests = res.sort(
          (a: any, b: any) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load travel requests', err);
        this.loading = false;
      }
    });
  }
  
  

  viewDetails(id: string) {
    this.router.navigate(['/travel/cfo/detail', id]);
  }
}

