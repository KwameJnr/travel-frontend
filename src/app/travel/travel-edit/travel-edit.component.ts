import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TravelService } from 'src/app/core/services/travel.service';
import { Travel } from 'src/app/shared/models/travel/travel.model';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatIconModule } from '@angular/material/icon';
// import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-travel-edit',
  templateUrl: './travel-edit.component.html',
  styleUrls: ['./travel-edit.component.scss'],
  standalone: true,
  // isReadonly: true,
  imports: [
    CommonModule,
    // HttpClientModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatOptionModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatTimepickerModule,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class TravelEditComponent implements OnInit {
  travelForm!: FormGroup;
  travelId!: string;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private travelService: TravelService
  ) {}

  ngOnInit(): void {
    this.travelId = this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadTravel();
  }

  initForm(): void {
    this.travelForm = this.fb.group({
      employeeName: ['', Validators.required],
      employeeEmail: ['', [Validators.required, Validators.email]],
      employeePassportNo: [''],
      employeePassportExpiry: [''],
      employeeNumber: [''],
      employeeDepartment: [''],
      employeeTravellingContact: [''],
      employeeContact: [''],
      purpose: [''],
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
    });
  }

  loadTravel(): void {
    this.loading = true;
    this.travelService.getById(this.travelId).subscribe({
      next: (data) => {
        this.travelForm.patchValue(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load travel request', err);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.travelForm.invalid) return;

    this.loading = true;
    const updatedData: Travel = this.travelForm.value;
    this.travelService.update(this.travelId, updatedData).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/list']);
      },
      error: (err) => {
        console.error('Update failed', err);
        this.loading = false;
      }
    });
  }
}

