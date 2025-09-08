import { Component, OnInit } from '@angular/core';
import { TravelService } from 'src/app/core/services/travel.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-buhead-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './bu-head-request-list.component.html',
  styleUrls: ['./bu-head-request-list.component.scss']
})
export class BuheadListComponent implements OnInit {
  travelRequests: any[] = [];
  filteredRequests: any[] = [];   // ✅ used only in history
  loading = true;
  displayedColumns: string[] = ['employeeName', 'purpose', 'departureDate', 'status', 'actions'];

  // track which list is showing
  showHistory = false;
  searchForm!: FormGroup;
  
  constructor(private travelService: TravelService, private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    const userRole = localStorage.getItem('userRole');

    if (userRole !== 'TR-BU_HEAD' && userRole !== 'TR-ADMIN') {
      this.router.navigate(['/unauthorized']);  
      return;
    }

    // ✅ Search form for history
    this.searchForm = this.fb.group({
      employee: [''],
      status: ['']
    });

    // ✅ Default load pending requests
    this.loadPendingRequests();
  }

  toggleView(): void {
    this.showHistory = !this.showHistory;
    if (this.showHistory) {
      this.loadHistory();
    } else {
      this.loadPendingRequests();
    }
  }
  
  loadPendingRequests(): void {
    this.loading = true;
    this.travelService.getPendingRequestsForBuHead().subscribe({
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

  loadHistory(): void {
    this.loading = true;

    const currentUserEmail = localStorage.getItem('loggedInEmail');

    this.travelService.getAll().subscribe({
      next: (data) => {
        this.travelRequests = data
          // ✅ You can refine this filter depending on who should see history
          .filter((travel: any) =>
            [
              'Pending BU Head Approval',
              'Pending CFO Approval',
              'CFO Approval Successful',
              'BU Head Approval Successful'
            ].includes(travel.status)
          )
          .filter((travel: any) => travel.excoHeadEmail?.toLowerCase() === currentUserEmail?.toLowerCase())
          .sort(
            (a: any, b: any) =>
              new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
          );

        this.filteredRequests = [...this.travelRequests];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load travel data', err);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    const { employee, status } = this.searchForm.value;
    this.filteredRequests = this.travelRequests.filter((req: any) => {
      const matchesEmployee = employee
        ? req.employeeName.toLowerCase().includes(employee.toLowerCase())
        : true;
      const matchesStatus = status ? req.status === status : true;
      return matchesEmployee && matchesStatus;
    });
  }

  resetFilters(): void {
    this.searchForm.reset();
    this.filteredRequests = [...this.travelRequests];
  }

  viewDetails(id: string) {
    this.router.navigate(['/travel/buhead/detail', id]);
  }
}