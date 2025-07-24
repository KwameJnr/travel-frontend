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
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SubmissionResultDialogComponent } from 'src/app/shared/dialogs/submission-result-dialog/submission-result-dialog.component';
import { Department } from 'src/app/shared/models/deparment/department.model';
import { BauHeadForm } from 'src/app/shared/models/buhead/buheadform';
import { PerDiemForm } from 'src/app/shared/models/perdiem/perdiemform.model';

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

  departments: Department[] = [];
  bauHeads: BauHeadForm[] = [];
  perDiemCountries: PerDiemForm[] = [];


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
      daysOutOfficialAssignmentDate: [{ value: 0, disabled: true }], 
      hotelReservation: [''],
      hotelName: [''],
      hotelAddress: [''],
      hotelCity: [''],
      hotelCountry: [''],
      rentalCarRequired: [''],
      airportTransportRequiredToAndFrom: [''],
      subsistenceAllowance: [''],
      perDiemDays: [{ value: 0, disabled: true }], 
      estimatedPerDiemAmount: [{ value: 0, disabled: true }], 
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

    // 👇 Recalculate days out when dates change
  this.travelForm.get('departureDate')?.valueChanges.subscribe(() => this.calculateWorkingDays());
  this.travelForm.get('returnDate')?.valueChanges.subscribe(() => this.calculateWorkingDays());
  this.travelForm.get('perDiemStartDate')?.valueChanges.subscribe(() => this.calculatePerDiemDays());
  this.travelForm.get('perDiemEndDate')?.valueChanges.subscribe(() => this.calculatePerDiemDays());
  this.travelForm.get('country')?.valueChanges.subscribe(() => this.calculatePerDiemDays()); // 


  this.travelService.getDepartments().subscribe({
    next: (response) => {
      this.departments = response.data; // assuming 'response' has a 'data' array
    },
    error: (err) => {
      console.error('Failed to load departments:', err);
    }
  });

  this.travelService.getBAUHeads().subscribe({
    next: (response) => {
      this.bauHeads = response.data;
  
      const selectedDept = this.travelForm.get('employeeDepartment')?.value;
  
      const excoHead = this.bauHeads.find((bau: BauHeadForm) =>
        selectedDept &&
        bau.unit.toLowerCase() === selectedDept.toLowerCase()
      );
  
      const cfo = this.bauHeads.find((bau: BauHeadForm) =>
        bau.unit.toLowerCase() === 'finance'
      );
  
      if (excoHead) {
        this.travelForm.patchValue({
          excoHeadName: excoHead.name,
          excoHeadEmail: excoHead.email
        });
      }
  
      if (cfo) {
        this.travelForm.patchValue({
          cfoName: cfo.name,
          cfoEmail: cfo.email
        });
      }
    },
    error: (err) => {
      console.error('Failed to load BAU heads:', err);
    }
  });  

  this.travelForm.get('employeeDepartment')?.valueChanges.subscribe((dept: string) => {
    this.populateHeadFields(dept);
  });  
  
  this.travelService.getAllPerDiemCountries().subscribe({
    next: ({ data }) => {
      const seen = new Set<string>();
      const uniqueCountryObjects = data.filter(perDiem => {
        const location = perDiem.location?.trim();
        if (!location || seen.has(location)) return false;
        seen.add(location);
        return true;
      });
  
      this.perDiemCountries = uniqueCountryObjects;
    },
    error: (error) => {
      console.error('Failed to load per diem countries:', error);
    }
  });
  
  }

  populateHeadFields(selectedDept: string) {
    if (!selectedDept || !this.bauHeads?.length) return;
  
    // Find Exco Head
    const exco = this.bauHeads.find(bau => bau.unit === selectedDept);
    if (exco) {
      this.travelForm.patchValue({
        excoHeadName: exco.name,
        excoHeadEmail: exco.email
      });
    } else {
      this.travelForm.patchValue({
        excoHeadName: '',
        excoHeadEmail: ''
      });
    }
  
    // Find CFO (Finance department is fixed)
    const cfo = this.bauHeads.find(bau => bau.unit.toLowerCase() === 'finance');
    if (cfo) {
      this.travelForm.patchValue({
        cfoName: cfo.name,
        cfoEmail: cfo.email
      });
    }
  }
  

  calculateWorkingDays() {
    const start = this.travelForm.get('departureDate')?.value;
    const end = this.travelForm.get('returnDate')?.value;
  
    if (!start || !end || new Date(start) > new Date(end)) {
      this.travelForm.patchValue({ daysOutOfficialAssignmentDate: 0 });
      return;
    }
  
    let count = 0;
    let current = new Date(start);
  
    while (current <= new Date(end)) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) count++; // skip Sunday (0) and Saturday (6)
      current.setDate(current.getDate() + 1);
    }
  
    this.travelForm.patchValue({ daysOutOfficialAssignmentDate: count });
  }  

  calculatePerDiemDays(): void {
    const start = this.travelForm.get('perDiemStartDate')?.value;
    const end = this.travelForm.get('perDiemEndDate')?.value;
    const selectedCountry = this.travelForm.get('country')?.value;
  
    if (!start || !end || new Date(start) > new Date(end)) {
      this.travelForm.patchValue({
        perDiemDays: 0,
        estimatedPerDiemAmount: 0
      });
      return;
    }
  
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dayDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;
  
    let applicableRate = 100;
  
    if (this.perDiemCountries?.length && selectedCountry) {
      const today = new Date();
  
      const matching = this.perDiemCountries.find(p =>
        p.location?.trim().toLowerCase() === selectedCountry.trim().toLowerCase() &&
        p.status?.toUpperCase() === 'ACTIVE' &&
        new Date(p.effectiveDate) <= today
      );
  
      if (matching) {
        applicableRate = Number(matching.rate) || 100;
      }
  
      console.log('Selected Country:', selectedCountry);
      console.log('Matching Record:', matching);
      console.log('Rate Used:', applicableRate);
    }
  
    const estimatedAmount = dayDiff * applicableRate;
  
    this.travelForm.patchValue({
      perDiemDays: dayDiff,
      estimatedPerDiemAmount: estimatedAmount
    });
  }
  
  
  onSubmit(): void {
    if (this.travelForm.invalid) return;
  
    const formValue = this.travelForm.getRawValue();
  
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
      daysOutOfficialAssignmentDate: formValue.daysOutOfficialAssignmentDate,
      perDiemDays: formValue.perDiemDays,
      dateCreated: formatToLocalDateTime(new Date()),
  
      excoHeadStatus: withDefaultEnum(formValue.excoHeadStatus, 'Pending'),
      excoHeadFeedback: withDefaultEnum(formValue.excoHeadFeedback, 'Pending'),
      cfoStatus: withDefaultEnum(formValue.cfoStatus, 'Pending'),
      cfoFeedback: withDefaultEnum(formValue.cfoFeedback, 'Pending'),
  
      excRemarks: 'Pending',
      status: 'Pending BU Head Approval',
    };
  
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '600px',
      data: payload,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
  
        this.travelService.create(payload).subscribe({
          next: (savedTravelResponse) => {
            this.loading = false;
            console.log('Raw backend response:', savedTravelResponse);
  
            const savedTravel = savedTravelResponse.data;  // Unwrap .data here
            console.log('Saved travel data:', savedTravel);
  
            const emailPayload = {
              clientKey: 'Travel-Request-Manager-EmailerId-BU-Head',
              approvalRequestId: savedTravel.travelId!,
              fromEmail: 'Travel Request <travelrequest@firstnationalbank.com.gh>',
              toEmail: savedTravel.excoHeadEmail,
              subject: 'Approval Request for Travel: ' + savedTravel.purpose,
              body: `
                <p>Dear ${savedTravel.excoHeadName},</p>
                
                <p>${savedTravel.employeeName}'s travel request has been submitted.</p>
                
                <p>
                  Purpose: ${savedTravel.purpose}<br>
                  Departure Date: ${savedTravel.departureDate}<br>
                  Return Date: ${savedTravel.returnDate}
                </p>
                
                <p>Regards,<br>Travel Request Management System</p>
              `
            };
  
            this.travelService.sendApprovalEmail(emailPayload).subscribe({
              next: () => console.log('Approval email sent successfully'),
              error: (err) => console.error('Failed to send approval email', err)
            });

            const SendEmailPayload = {
              clientKey: 'Travel-Request-Manager-EmailerId-Requester',
              fromEmail: 'Travel Request <travelrequest@firstnationalbank.com.gh>',
              toEmail: savedTravel.employeeEmail,
              subject: 'Travel Approval Request Notification: ' + savedTravel.purpose,
              body: 
                  `
                <p>Dear ${savedTravel.employeeName},</p>
          
                <p>travel request has been submitted successfully to your approver.</p>
                
                <p>
                  Purpose: ${savedTravel.purpose}<br>
                  Departure Date: ${savedTravel.departureDate}<br>
                  Return Date: ${savedTravel.returnDate}
                </p>
                
                <p>Regards,<br>Travel Request Management System</p>`
              
            };
  
            this.travelService.sendEmailMsg(SendEmailPayload).subscribe({
              next: () => console.log('Notifacation approval email sent successfully'),
              error: (err) => console.error('Failed to send approval email', err)
            });
  
            this.dialog.open(SubmissionResultDialogComponent, {
              width: '400px',
              data: {
                success: true,
                message: 'Your travel request was submitted successfully. Approval email has been sent to your BU head'
              }
            });
  
            this.travelForm.reset();
          },
          error: (err) => {
            this.loading = false;
            console.error('Creation failed', err);
  
            this.dialog.open(SubmissionResultDialogComponent, {
              width: '400px',
              data: {
                success: false,
                message: 'Failed to submit your travel request. Please try again.'
              }
            });
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

