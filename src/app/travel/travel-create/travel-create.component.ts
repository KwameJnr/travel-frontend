import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TravelService } from 'src/app/core/services/travel.service';
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
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component'; // adjust path
import { SubmissionResultDialogComponent } from 'src/app/shared/dialogs/submission-result-dialog/submission-result-dialog.component';

@Component({
  selector: 'app-travel-create',
  templateUrl: './travel-create.component.html',
  styleUrls: ['./travel-create.component.scss'],
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
export class TravelCreateComponent implements OnInit {
  travelForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private travelService: TravelService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.travelForm = this.fb.group({
      employeeName: ['', Validators.required],
      employeeEmail: ['', [Validators.required, Validators.email]],
      employeePassportNo: [''],
      employeePassportExpiry: [''],
      employeeNumber: [''],
      employeeDepartment: [''],
      employeeTravellingContact: [''],
      employeeContact: [''],
      purpose: ['', Validators.required],
      city: [''],
      country: [''],
      visaRequired: [''],
      departureDate: [''],
      departureTime: [''],
      returnDate: [''],
      returnTime: [''],
      perDiemStartDate: [''],
      perDiemEndDate: [''],
      daysOutOfficialAssignmentDate: [''],
      hotelReservation: [''],
      hotelName: [''],
      hotelAddress: [''],
      hotelCity: [''],
      hotelCountry: [''],
      rentalCarRequired: [''],
      airportTransportRequiredToAndFrom: [''],
      subsistenceAllowance: [''],
      perDiemDays: [0],
      estimatedPerDiemAmount: [0],
      totalEstimatedTravelCost: [0],
      travelBudgetCode: [''],
      travelRequestApproved: [''],
      classOfTravelDeparture: [''],
      classOfTravelReturn: [''],
      excoHeadStatus: [''],
      excoHeadName: [''],
      excoHeadEmail: [''],
      excoHeadFeedback: [''],
      excoHeadFeedbackRemarks: [''],
      cfoStatus: [''],
      cfoName: [''],
      cfoEmail: [''],
      cfoFeedback: [''],
      cfoFeedbackRemarks: [''],
      status: [''],
      dateCreated: [new Date()]
    });
  }

  // onSubmit(): void {
  //   if (this.travelForm.invalid) return;
  
  //   const formValue = this.travelForm.value;
  
  //   const formatToLocalDateTime = (date: Date | string | null): string | null => {
  //     if (!date) return null;
  //     return new Date(date).toISOString().slice(0, 19); // "yyyy-MM-ddTHH:mm:ss"
  //   };
  
  //   const withDefaultEnum = (value: string | null | undefined, defaultValue: string): string =>
  //     value && value.trim() !== '' ? value : defaultValue;

  //   const payload = {
  //     ...formValue,
  //     employeePassportExpiry: formatToLocalDateTime(formValue.employeePassportExpiry),
  //     departureDate: formatToLocalDateTime(formValue.departureDate),
  //     returnDate: formatToLocalDateTime(formValue.returnDate),
  //     perDiemStartDate: formatToLocalDateTime(formValue.perDiemStartDate),
  //     perDiemEndDate: formatToLocalDateTime(formValue.perDiemEndDate),
  //     daysOutOfficialAssignmentDate: formatToLocalDateTime(formValue.daysOutOfficialAssignmentDate),
  //     dateCreated: formatToLocalDateTime(new Date()),
  //     // Add more date fields here if needed

  //     // Apply default for enum-like fields
  //   excoHeadStatus: withDefaultEnum(formValue.excoHeadStatus, 'Pending'),
  //   excoHeadFeedback: withDefaultEnum(formValue.excoHeadStatus, 'Pending'),
  //   cfoStatus: withDefaultEnum(formValue.cfoStatus, 'Pending'),
  //   cfoFeedback: withDefaultEnum(formValue.excoHeadStatus, 'Pending'),
  //   // Add more enums as needed
  //   };
  
  //   this.loading = true;
  //   this.travelService.create(payload).subscribe({
  //     next: () => {
  //       this.loading = false;
  //       this.router.navigate(['/travel']);
  //     },
  //     error: (err) => {
  //       this.loading = false;
  //       console.error('Creation failed', err);
  //     }
  //   });
  // }
  onSubmit(): void {
    if (this.travelForm.invalid) return;
  
    const formValue = this.travelForm.value;
  
    const formatToLocalDateTime = (date: Date | string | null): string | null =>
      date ? new Date(date).toISOString().slice(0, 19) : null;
  
    const withDefaultEnum = (value: string | null | undefined, defaultValue: string): string =>
      value && value.trim() !== '' ? value : defaultValue;
  
    const payload = {
      ...formValue,
      employeePassportExpiry: formatToLocalDateTime(formValue.employeePassportExpiry),
      departureDate: formatToLocalDateTime(formValue.departureDate),
      returnDate: formatToLocalDateTime(formValue.returnDate),
      perDiemStartDate: formatToLocalDateTime(formValue.perDiemStartDate),
      perDiemEndDate: formatToLocalDateTime(formValue.perDiemEndDate),
      daysOutOfficialAssignmentDate: formatToLocalDateTime(formValue.daysOutOfficialAssignmentDate),
      dateCreated: formatToLocalDateTime(new Date()),

      excoHeadStatus: withDefaultEnum(formValue.excoHeadStatus, 'Pending'),
      excoHeadFeedback: withDefaultEnum(formValue.excoHeadFeedback, 'Pending'),
      cfoStatus: withDefaultEnum(formValue.cfoStatus, 'Pending'),
      cfoFeedback: withDefaultEnum(formValue.cfoFeedback, 'Pending'),
    };
  
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '600px',
      data: payload,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
  
        this.travelService.create(payload).subscribe({
          next: () => {
            this.loading = false;
  
            // Show success dialog
            this.dialog.open(SubmissionResultDialogComponent, {
              width: '400px',
              // maxHeight: '80vh',
              data: {
                success: true,
                message: 'Your travel request was submitted successfully. Approval email has been sent to your BU head'
              }
            });
  
            this.travelForm.reset(); // Soft reset
          },
          error: (err) => {
            this.loading = false;
  
            console.error('Creation failed', err);
  
            // Show failure dialog
            this.dialog.open(SubmissionResultDialogComponent, {
              width: '400px',
              data: {
                success: false,
                message: 'Failed to submit your travel request. Please try again.'
              }
            });
  
            // Do not reset form – keep user input for retry
          }
        });
      }
    });
  }
  
  onCancel(): void {
    this.travelForm.reset(); // Optional: Reset the form
    this.router.navigate(['/travel']); // Navigate back to travel list or desired route
  }
  
}

