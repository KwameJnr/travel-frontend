import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SubmissionResultDialogComponent } from 'src/app/shared/dialogs/submission-result-dialog/submission-result-dialog.component';
import { Department } from 'src/app/shared/models/deparment/department.model';
import { BauHeadForm } from 'src/app/shared/models/buhead/buheadform';
import { PerDiemForm } from 'src/app/shared/models/perdiem/perdiemform.model';

import { HttpClient } from '@angular/common/http';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export const perDiemDateValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const form = group as FormGroup;
  const start = form.get('perDiemStartDate');
  const end = form.get('perDiemEndDate');

  if (start?.value && end?.value && new Date(start.value) > new Date(end.value)) {
    // Attach error ONLY to end date
    end?.setErrors({ ...(end.errors || {}), perDiemDateInvalid: true });
    return null; // nothing at the group level
  } else {
    if (end?.errors) {
      const { perDiemDateInvalid, ...otherErrors } = end.errors;
      end.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
    }
    return null;
  }
};

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
    NgxMatTimepickerModule,
    MatSnackBarModule
  ]
})
export class TravelCreateComponent implements OnInit {
  travelForm!: FormGroup;
  loading = false;

  public warningMessage: string | null = null;

  departments: Department[] = [];
  bauHeads: BauHeadForm[] = [];
  perDiemCountries: PerDiemForm[] = [];


  constructor(
    private fb: FormBuilder,
    private travelService: TravelService,
    private router: Router,
    private dialog: MatDialog,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
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
      departureDate: ['', Validators.required],
      departureTime: ['', Validators.required],
      returnDate: ['', Validators.required],
      returnTime: ['', Validators.required],
      perDiemStartDate: [{ value: null, disabled: true },Validators.required],
      perDiemEndDate: [{ value: null, disabled: true },],
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
    }, { validators: perDiemDateValidator });

    this.travelForm.get('perDiemStartDate')?.valueChanges.subscribe(() => {
      this.travelForm.updateValueAndValidity({ onlySelf: false, emitEvent: true });
    });
    this.travelForm.get('perDiemEndDate')?.valueChanges.subscribe(() => {
      this.travelForm.updateValueAndValidity({ onlySelf: false, emitEvent: true });
    });
    
    // Load draft if exists
    const savedDraft = localStorage.getItem('travelFormDraft');
    if (savedDraft) {
      this.travelForm.patchValue(JSON.parse(savedDraft));
    }

    // Auto-save draft on changes
    this.travelForm.valueChanges.subscribe(val => {
      localStorage.setItem('travelFormDraft', JSON.stringify(val));
    });

    // Pre-populate employee fields from localStorage
    const storedEmail = localStorage.getItem('loggedInEmail');
    const storedName = localStorage.getItem('userName');
    const storedNumber = localStorage.getItem('userFnumber');
    const storedPhnone = localStorage.getItem('userMobile');

    this.travelForm.patchValue({
      employeeEmail: storedEmail || '',
      employeeName: storedName || '',
      employeeNumber: storedNumber || '',
      employeeContact: storedPhnone || ''
    });

    // 👇 Recalculate days out when dates change
    this.travelForm.get('departureDate')?.valueChanges.subscribe(() => this.calculateWorkingDays());
    this.travelForm.get('departureTime')?.valueChanges.subscribe(() => this.calculateWorkingDays());
    this.travelForm.get('returnDate')?.valueChanges.subscribe(() => this.calculateWorkingDays());
    this.travelForm.get('returnTime')?.valueChanges.subscribe(() => this.calculateWorkingDays());
    
  this.travelForm.get('perDiemStartDate')?.valueChanges.subscribe(() => this.calculatePerDiemDays());
  this.travelForm.get('perDiemEndDate')?.valueChanges.subscribe(() => this.calculatePerDiemDays());
  this.travelForm.get('country')?.valueChanges.subscribe(() => this.calculatePerDiemDays()); 

  // Load departments and BAU heads
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
  
  calculateWorkingDays(): void {
    const departureDate = this.travelForm.get('departureDate')?.value;
    const returnDate = this.travelForm.get('returnDate')?.value;
    const departureTime = this.travelForm.get('departureTime')?.value?.toLowerCase();
    const returnTime = this.travelForm.get('returnTime')?.value?.toLowerCase();
  
    // Reset if required fields are missing
    if (!departureDate || !returnDate || !departureTime || !returnTime) {
      this.travelForm.patchValue({
        perDiemStartDate: null,
        perDiemEndDate: null,
        daysOutOfficialAssignmentDate: 0,
        perDiemDays: 0,
        estimatedPerDiemAmount: 0
      }, { emitEvent: false });
      this.travelForm.updateValueAndValidity({ emitEvent: true });
      return;
    }
  
    const start = new Date(departureDate);
    const end = new Date(returnDate);
  
    if (start > end) {
      // invalid overall range → let validator handle the error
      this.travelForm.patchValue({
        perDiemStartDate: null,
        perDiemEndDate: null,
        daysOutOfficialAssignmentDate: 0,
        perDiemDays: 0,
        estimatedPerDiemAmount: 0
      }, { emitEvent: false });
  
      this.travelForm.updateValueAndValidity({ emitEvent: true });
      return;
    }
  
    // Per Diem Start Date
    let perDiemStart = new Date(start);
    if (departureTime.includes('pm')) {
      perDiemStart.setDate(perDiemStart.getDate() + 1);
    }
  
    // Per Diem End Date
    let perDiemEnd = new Date(end);
    if (returnTime.includes('am')) {
      perDiemEnd.setDate(perDiemEnd.getDate() - 1);
    }
  
    // Patch calculated values
    this.travelForm.patchValue({
      perDiemStartDate: this.formatDate(perDiemStart),
      perDiemEndDate: this.formatDate(perDiemEnd)
    }, { emitEvent: false });
  
    // Count working days (Mon–Fri) between departure and return
    let count = 0;
    let current = new Date(start);
    while (current <= end) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) count++;
      current.setDate(current.getDate() + 1);
    }
  
    this.travelForm.patchValue({ daysOutOfficialAssignmentDate: count }, { emitEvent: false });
  
    // Force validation (so validator runs instantly)
    this.travelForm.updateValueAndValidity({ emitEvent: true });
  
    // Trigger recalculation of per diem days & amount
    this.calculatePerDiemDays();
  }
   

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
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

    // 👇 Force UI to re-check validity whenever status changes
    this.travelForm.statusChanges.subscribe(() => {
    this.cdr.detectChanges();
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

            localStorage.removeItem('travelFormDraft'); // Clear draft after successful submission
  
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

