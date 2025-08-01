import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { BuheadService } from 'src/app/core/services/buhead.service';
import { PerdiemService } from 'src/app/core/services/perdiem.service';
import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // For Datepicker
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/travel/confirm-dialog/confirm-dialog.component';
import { SubmissionResultDialogComponent } from 'src/app/shared/dialogs/submission-result-dialog/submission-result-dialog.component';
import { PerDiemFeedbackDialogComponent } from '../per-diem-feedback-dialog/per-diem-feedback-dialog.component';

@Component({
  selector: 'app-perdiem-create',
  templateUrl: './per-diem.component.html',
  styleUrl: './per-diem.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatStepperModule,
    MatIcon,
    MatProgressSpinnerModule,
    NgxMatTimepickerModule
  ]
})
export class PerDiemComponent implements OnInit {
  perdiemForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private perdiemService: PerdiemService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const userRole = localStorage.getItem('userRole');

    if (userRole !== 'TR-ADMIN') {
      this.router.navigate(['/unauthorized']);  // Redirect unauthorized users
      return;
    }

    this.perdiemForm = this.fb.group({
      rate : ['', Validators.required],
      status: ['', Validators.required],
      location: ['', Validators.required],
      effectiveDate: ['', Validators.required],
      createdBy: [''],
      editedBy: [''],
      editedDate: [''],
    });
  }

  onSubmit(): void {
    if (this.perdiemForm.invalid) return;
  
    const formValue = this.perdiemForm.value;
  
    const formatToLocalDateTime = (date: Date | string | null): string | null =>
      date ? new Date(date).toISOString().slice(0, 19) : null;
  
    const payload = {
      ...formValue,
      dateCreated: formatToLocalDateTime(new Date()),
    };
  
    const dialogRef = this.dialog.open(PerDiemFeedbackDialogComponent, {
      width: '600px',
      data: payload,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
  
        this.perdiemService.create(payload).subscribe({
          next: () => {
            this.loading = false;
  
            // Show success dialog
            this.dialog.open(SubmissionResultDialogComponent, {
              width: '400px',
              // maxHeight: '80vh',
              data: {
                success: true,
                message: 'Your per-diem create request was submitted successfully.'
              }
            });
  
            this.perdiemForm.reset(); // Soft reset
          },
          error: (err) => {
            this.loading = false;
  
            console.error('Creation failed', err);
  
            // Show failure dialog
            this.dialog.open(SubmissionResultDialogComponent, {
              width: '400px',
              data: {
                success: false,
                message: 'Failed to submit your per-diem create request. Please try again.'
              }
            });
  
            // Do not reset form – keep user input for retry
          }
        });
      }
    });
  }
  
  onCancel(): void {
    this.perdiemForm.reset(); // Optional: Reset the form
    this.router.navigate(['/travel/perdiem/create']); // Navigate back to travel list or desired route
  }
  
}
