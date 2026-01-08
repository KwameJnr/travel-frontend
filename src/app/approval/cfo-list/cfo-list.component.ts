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
  selector: 'app-cfo-list',
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
  templateUrl: './cfo-list.component.html',
  styleUrl: './cfo-list.component.scss'
})
export class CfoListComponent implements OnInit {
  travelRequests: any[] = [];
  filteredRequests: any[] = [];   // ✅ used only in history
  loading = true;
  displayedColumns: string[] = ['employeeName', 'purpose', 'departureDate', 'status', 'actions'];

  // track which list is showing
  showHistory = false;
  searchForm!: FormGroup;

  constructor(private travelService: TravelService, private router: Router,  private fb: FormBuilder) {}

  ngOnInit(): void {
    const userRole = localStorage.getItem('userRole');

  if (userRole !== 'TR-CFO' && userRole !== 'TR-ADMIN') {
    this.router.navigate(['/unauthorized']);  // Redirect unauthorized users
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

  // Fetch only pending requests from the backend
  this.travelService.getCfoFeedbackRequests('PENDING').subscribe({
    next: (res) => {
      this.travelRequests = res.sort(
        (a: any, b: any) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
      );
      this.filteredRequests = [...this.travelRequests];
      this.loading = false;
    },
    error: (err) => {
      console.error('Failed to load pending travel requests', err);
      this.loading = false;
    }
  });
}

loadHistory(): void {
  this.loading = true;

  const feedbacks: ('APPROVED' | 'REJECTED')[] = ['APPROVED', 'REJECTED'];

  this.travelService.getCfoFeedbackRequestsByMultiple(feedbacks).subscribe({
    next: (res) => {
      console.log('History records:', res); // 👈 confirm data
      this.travelRequests = res.sort(
        (a, b) =>
          new Date(b.dateCreated).getTime() -
          new Date(a.dateCreated).getTime()
      );

      this.filteredRequests = [...this.travelRequests];
      this.loading = false;
    },
    error: (err) => {
      console.error('Failed to load travel history', err);
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
    this.router.navigate(['/travel/cfo/detail', id]);
  }
}

