import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BuheadService } from 'src/app/core/services/buhead.service';
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
import { BuheadFeedbackDialogComponent } from '../buhead-feedback-dialog/buhead-feedback-dialog.component';

@Component({
  selector: 'app-buhead-create',
  templateUrl: './buhead-create.component.html',
  styleUrl: './buhead-create.component.scss',
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
export class BuheadCreateComponent implements OnInit {
  buheadForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private buheadService: BuheadService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.buheadForm = this.fb.group({
      buHeadName:['', Validators.required],
      buHeadEmail: ['', [Validators.required, Validators.email]],
      fNumber:['', Validators.required],
      Department:['', Validators.required],
      dateCreated: [new Date()]
    });
  }

  onSubmit(): void {
    if (this.buheadForm.invalid) return;
  
    const formValue = this.buheadForm.value;
  
    const formatToLocalDateTime = (date: Date | string | null): string | null =>
      date ? new Date(date).toISOString().slice(0, 19) : null;
  
    const payload = {
      ...formValue,
      dateCreated: formatToLocalDateTime(new Date()),
    };
  
    const dialogRef = this.dialog.open(BuheadFeedbackDialogComponent, {
      width: '600px',
      data: payload,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
  
        this.buheadService.create(payload).subscribe({
          next: () => {
            this.loading = false;
  
            // Show success dialog
            this.dialog.open(SubmissionResultDialogComponent, {
              width: '400px',
              // maxHeight: '80vh',
              data: {
                success: true,
                message: 'Your Bu Head request was submitted successfully.'
              }
            });
  
            this.buheadForm.reset(); // Soft reset
          },
          error: (err) => {
            this.loading = false;
  
            console.error('Creation failed', err);
  
            // Show failure dialog
            this.dialog.open(SubmissionResultDialogComponent, {
              width: '400px',
              data: {
                success: false,
                message: 'Failed to submit your Bu Head request. Please try again.'
              }
            });
  
            // Do not reset form – keep user input for retry
          }
        });
      }
    });
  }
  
  onCancel(): void {
    this.buheadForm.reset(); // Optional: Reset the form
    this.router.navigate(['/travel/buhead/create']); // Navigate back to travel list or desired route
  }
  
}
