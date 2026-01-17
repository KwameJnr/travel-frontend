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

    // Only allow TR_USER role to access this component BUT CHANGE TO ADMIN FOR PRODUCTION
    if (userRole !== 'TR_ADMIN' ) {
      this.router.navigate(['/unauthorized']);  // Redirect unauthorized users
      return;
    }

    this.perdiemForm = this.fb.group({
      country: ['', Validators.required],

      dollarRate: [
        null,
        [Validators.required, Validators.min(0)]
      ],

      airFareCost: [0, Validators.min(0)],
      accommodationCost: [0, Validators.min(0)],
      visaApplicationCost: [0, Validators.min(0)],
      transportationCost: [0, Validators.min(0)],
      otherCost: [0, Validators.min(0)]
    });
  }

  onSubmit(): void {
    if (this.perdiemForm.invalid) return;
  
    const formValue = this.perdiemForm.value;
    
    const payload = {
      country: formValue.country,
      dollarRate: Number(formValue.dollarRate),

      airFareCost: Number(formValue.airFareCost || 0),
      accommodationCost: Number(formValue.accommodationCost || 0),
      visaApplicationCost: Number(formValue.visaApplicationCost || 0),
      transportationCost: Number(formValue.transportationCost || 0),
      otherCost: Number(formValue.otherCost || 0)
    };

    // 1. CONFIRM DIALOG
    const dialogRef = this.dialog.open(PerDiemFeedbackDialogComponent, {
      width: '600px',
      data: payload,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
  
      this.loading = true;
  
      // 2. CREATE REQUEST
      this.perdiemService.create(payload).subscribe({
        next: (savedPerDiem) => {
          this.loading = false;
  
          // 3. SUCCESS DIALOG
          const successDialog = this.dialog.open(SubmissionResultDialogComponent, {
            width: '400px',
            data: {
              success: true,
              message: 'Your per-diem create request was submitted successfully.'
            }
          });
  
          successDialog.afterClosed().subscribe(() => {

          });
  
          this.perdiemForm.reset();
        },
  
        error: (err) => {
          this.loading = false;
          console.error('Creation failed', err);
  
          this.dialog.open(SubmissionResultDialogComponent, {
            width: '400px',
            data: {
              success: false,
              message: 'Failed to submit your per-diem create request. Please try again.'
            }
          });
        }
      });
    });
  }
  
  onCancel(): void {
    this.perdiemForm.reset(); // Optional: Reset the form
    this.router.navigate(['/travel/perdiem/list']); // Navigate back to travel list or desired route
  }
  
}
