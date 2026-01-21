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
import { Location } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
// import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-travel-edit',
  templateUrl: './travel-edit.component.html',
  styleUrls: ['./travel-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
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
    MatProgressSpinnerModule,
    MatCardModule
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
    private travelService: TravelService,
    private location: Location
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
      if (!this.travelId || !this.travelForm) return;

      this.loading = true;

      this.travelService.getMyTravelRequestsById(this.travelId).subscribe({
        next: (travel) => {
          if (!travel) {
            console.error('Travel data not found for id', this.travelId);
            this.loading = false;
            return;
          }

          const convertToDate = (val: string | null | undefined) => val ? new Date(val) : null;

          this.travelForm.patchValue({
            ...travel,
            employeePassportExpiry: convertToDate(travel.employeePassportExpiry),
            departureDate: convertToDate(travel.departureDate),
            returnDate: convertToDate(travel.returnDate),
            perDiemStartDate: convertToDate(travel.perDiemStartDate),
            perDiemEndDate: convertToDate(travel.perDiemEndDate),

            status: `Pending BU Head Approval`,
            excoHeadFeedback: `Pending`,
          });

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

    const formValue = this.travelForm.getRawValue(); // Get disabled fields too

  const formatToLocalDateTime = (date: Date | string | null): string | null =>
    date ? new Date(date).toISOString().slice(0, 19) : null;

  const payload = {
    ...formValue,
    employeePassportExpiry: formatToLocalDateTime(formValue.employeePassportExpiry),
    departureDate: formatToLocalDateTime(formValue.departureDate),
    departureTime: this.formatTime(formValue.departureTime),
    returnDate: formatToLocalDateTime(formValue.returnDate),
    returnTime: this.formatTime(formValue.returnTime),
    perDiemStartDate: formatToLocalDateTime(formValue.perDiemStartDate),
    perDiemEndDate: formatToLocalDateTime(formValue.perDiemEndDate),
    daysOutOfficialAssignmentDate: formValue.daysOutOfficialAssignmentDate,
    perDiemDays: formValue.perDiemDays,
  };

    this.loading = true;
    const updatedData: Travel = this.travelForm.value;
    this.travelService.updateTravelRequestsById(this.travelId, payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['travel/list']);
      },
      error: (err) => {
        console.error('Update failed', err);
        this.loading = false;
      }
    });
  }

  private formatTime(time: string): string {
  // time can come like "08:30 AM" or "08:30"
  const [hourMin, meridian] = time.split(' ');
  let [hours, minutes] = hourMin.split(':').map(Number);

  if (meridian) {
    if (meridian.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (meridian.toUpperCase() === 'AM' && hours === 12) hours = 0;
  }

  const hh = hours.toString().padStart(2, '0');
  const mm = minutes.toString().padStart(2, '0');

  return `${hh}:${mm}:00`; // always include seconds
}

  goBack(): void {
    this.location.back();
  }
}

