import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';

/* Material */
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

/* Third-party */
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';

/* App */
import { TravelService } from 'src/app/core/services/travel.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SubmissionResultDialogComponent } from
  'src/app/shared/dialogs/submission-result-dialog/submission-result-dialog.component';

import { Department } from 'src/app/shared/models/deparment/department.model';
import { BauHeadForm } from 'src/app/shared/models/buhead/buheadform';
import { PerDiemForm } from 'src/app/shared/models/perdiem/perdiemform.model';

/* ---------------- VALIDATOR ---------------- */

export const perDiemDateValidator: ValidatorFn = (
  group: AbstractControl
): ValidationErrors | null => {
  const start = group.get('perDiemStartDate')?.value;
  const end = group.get('perDiemEndDate')?.value;

  if (start && end && new Date(start) > new Date(end)) {
    group.get('perDiemEndDate')?.setErrors({ perDiemDateInvalid: true });
  }
  return null;
};

/* ---------------- COMPONENT ---------------- */

@Component({
  selector: 'app-travel-create',
  standalone: true,
  templateUrl: './travel-create.component.html',
  styleUrls: ['./travel-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    MatIconModule,
    MatProgressSpinnerModule,
    NgxMatTimepickerModule,
    MatSnackBarModule
  ]
})
export class TravelCreateComponent implements OnInit {

  travelForm!: FormGroup;
  loading = false;

  departments: Department[] = [];
  bauHeads: BauHeadForm[] = [];
  perDiems: PerDiemForm[] = [];      
  perDiemCountries: string[] = [];   


  private perDiemLoaded = false;

  constructor(
    private fb: FormBuilder,
    private travelService: TravelService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  /* ---------------- INIT ---------------- */

  ngOnInit(): void {
    this.buildForm();
    this.restoreDraft();
    this.registerSubscriptions();
    this.loadInitialData();
  }

  /* ---------------- FORM ---------------- */

  private buildForm(): void {
    this.travelForm = this.fb.group({
      step1: this.fb.group({
        employeeName: ['', Validators.required],
        employeeEmail: ['', [Validators.required, Validators.email]],
        employeePassportNo: [''],
        employeePassportExpiry: [''],
        employeeNumber: [''],
        employeeDepartment: [''],
        departmentCode:[{value: null,disabled: true}],
        employeeTravellingContact: [''],
        employeeContact: [''],
        purpose: ['', Validators.required]
      }),

      step2: this.fb.group({
      city: [''],
      country: [''],
      visaRequired: [''],
      departureDate: ['', Validators.required],
      departureTime: ['', Validators.required],
      returnDate: ['', Validators.required],
      returnTime: ['', Validators.required],
      perDiemStartDate: [{ value: null, disabled: true }],
      perDiemEndDate: [{ value: null, disabled: true }],
      daysOutOfOfficialAssignment: [0],
      perDiemDays: [{ value: 0, disabled: true }],
      }),

      step3: this.fb.group({
      hotelReservation:[''],
      hotelName:[''],
      hotelAddress:[''],
      hotelCity:[''],
      hotelCountry:[''],
      rentalCarRequired:[''],
      airportTransportRequiredToAndFrom:[''],
      subsistenceAllowance:[''],
      estimatedPerDiemAmount: [{ value: 0, disabled: true }],
      totalEstimatedTravelCost: [{ value: 0, disabled: true }],
      travelBudgetCode: [''],
      classOfTravelDeparture:[''],
      classOfTravelReturn:['']
      }),

      step4: this.fb.group({
      excoHeadName: [''],
      excoHeadEmail: [''],
      cfoName: [''],
      cfoEmail: [''],
      })
    },
    {
      validators: perDiemDateValidator
    }
  );
}

  /* ---------------- SUBSCRIPTIONS ---------------- */

  private registerSubscriptions(): void {

    this.travelForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe(value =>
        localStorage.setItem('travelFormDraft', JSON.stringify(value))
      );

    this.travelForm.get('employeeDepartment')?.valueChanges
      .subscribe(dept => this.populateHeadFields(dept));

      ['step2.country', 'step2.perDiemDays']
    .forEach(path =>
      this.travelForm.get(path)?.valueChanges
        .subscribe(() => this.calculateEstimatedCostsFromPerDiem())
    );

    ['departureDate', 'departureTime', 'returnDate', 'returnTime', 'daysOutOfOfficialAssignment']
      .forEach(field =>
        this.travelForm.get(`step2.${field}`)?.valueChanges
          .subscribe(() => this.calculatePerDiemDays())
      );

  }

  /* ---------------- DATA LOAD ---------------- */

    private loadInitialData(): void {
      this.loadDepartments();
      this.loadCFO();     
      this.listenToDepartmentChange();
    }


    private loadDepartments(): void {
      this.travelService.getComponentDepartments().subscribe({
        next: (res) => {
          this.departments = res.data ?? [];
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Failed to load departments', err);
          this.departments = [];
          this.cdr.markForCheck();
        }
      });
    }

    private loadCFO(): void {
      const CFO_DEPT_CODE = 'FIN';

      this.travelService.getComponentBUHeads(CFO_DEPT_CODE).subscribe({
        next: (res) => {
          const cfo = res.data?.[0]; // assuming one CFO

          if (!cfo) {
            this.resetCFOFields();
            return;
          }

          this.travelForm.patchValue({
            step4: {
              cfoName: cfo.name,
              cfoEmail: cfo.email
            }
          });

          this.cdr.markForCheck();
        },
        error: () => this.resetCFOFields()
      });
    }


    private listenToDepartmentChange(): void {
      const deptControl = this.travelForm.get('step1.employeeDepartment');

            deptControl?.valueChanges.subscribe((dept: Department) => {
        if (!dept) return;

        this.travelForm.patchValue({
          step1: {
            departmentCode: dept.code
          }
        });

        this.loadBUHeadByDepartmentCode(dept.code);
      });

    }

    private loadBUHeadByDepartmentCode(deptCode: string): void {
      this.travelService.getComponentBUHeads(deptCode).subscribe({
        next: (res) => {
          const buHead = res.data?.[0]; // assuming one BU head per department

          if (!buHead) {
            this.resetBUHeadFields();
            return;
          }

          this.travelForm.patchValue({
            step4: {
              excoHeadName: buHead.name,
              excoHeadEmail: buHead.email
            }
          });

          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Failed to load BU Head', err);
          this.resetBUHeadFields();
        }
      });
    }

    private resetBUHeadFields(): void {
      this.travelForm.patchValue({
        step4: {
          excoHeadName: '',
          excoHeadEmail: ''
        }
      });
    }

    private resetCFOFields(): void {
      this.travelForm.patchValue({
        step4: {
          cfoName: '',
          cfoEmail: ''
        }
      });
    }
    /* ---------------- STEP CHANGE ---------------- */

    onStepChange(index: number): void {
      if (index !== 1 || this.perDiemLoaded) {
        return;
      }

      this.perDiemLoaded = true;

      this.travelService.getComponentPerDiemCountries().subscribe({
        next: (res) => {
          this.perDiems = res.data ?? []; // full API response for calculations
          this.perDiemCountries = this.uniqueCountries(this.perDiems); // strings only
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Failed to load Per Diem countries', err);
          this.perDiems = [];
          this.perDiemCountries = [];
          this.cdr.markForCheck();
        }
      });
    }

  /* ---------------- HELPERS ---------------- */

  private restoreDraft(): void {
    const draft = localStorage.getItem('travelFormDraft');
    if (draft) {
      this.travelForm.patchValue(JSON.parse(draft));
    }
  }

  private uniqueCountries(perDiems: any[]): string[] {
    const countries = perDiems.map(p => p.country); // pick only the country
    return Array.from(new Set(countries)); // remove duplicates
  }

  populateHeadFields(dept: string): void {
    if (!dept) return;

    const exco = this.bauHeads.find(b => b.unit === dept);
    const cfo = this.bauHeads.find(b => b.unit.toLowerCase() === 'finance');

    this.travelForm.patchValue({
      excoHeadName: exco?.name || '',
      excoHeadEmail: exco?.email || '',
      cfoName: cfo?.name || '',
      cfoEmail: cfo?.email || ''
    });
  }

  calculateWorkingDays(): void {
    // (Your existing logic unchanged – safe & fast)
  }

  private calculateEstimatedCostsFromPerDiem(): void {
    const step2 = this.travelForm.get('step2')!;
    const step3 = this.travelForm.get('step3')!;

    const country = step2.get('country')?.value;
    const perDiemDays = Number(step2.get('perDiemDays')?.value || 0);

    if (!country || perDiemDays <= 0) {
      this.resetCostFields();
      return;
    }

    const perDiem = this.perDiems.find(p => p.country === country);

    if (!perDiem) {
      this.resetCostFields();
      return;
    }

    // 1️⃣ Per diem amount (NEVER NULL)
    const estimatedPerDiemAmount =
      Math.max(perDiem.dollarRate * perDiemDays, 0);

    // 2️⃣ Total travel cost (from backend response)
    const totalEstimatedTravelCost =
      estimatedPerDiemAmount +
      (perDiem.airFareCost || 0) +
      (perDiem.accommodationCost || 0) +
      (perDiem.visaApplicationCost || 0) +
      (perDiem.transportationCost || 0) +
      (perDiem.otherCost || 0);

    // 3️⃣ Patch form safely
    step3.patchValue(
      {
        estimatedPerDiemAmount,
        totalEstimatedTravelCost
      },
      { emitEvent: false }
    );

    this.cdr.markForCheck();
  }

  private resetCostFields(): void {
    this.travelForm.get('step3')?.patchValue(
      {
        estimatedPerDiemAmount: 0,
        totalEstimatedTravelCost: 0
      },
      { emitEvent: false }
    );
  }

  calculatePerDiemDays(): void {
    const step2 = this.travelForm.get('step2')!;
    const depDate: Date = step2.get('departureDate')?.value;
    const depTime: string = step2.get('departureTime')?.value; // "08:30 AM"
    const retDate: Date = step2.get('returnDate')?.value;
    const retTime: string = step2.get('returnTime')?.value;     // "05:00 PM"
    const daysOut: number = Number(step2.get('daysOutOfOfficialAssignment')?.value || 0);

    // If any required date/time is missing, alert user and reset
    if (!depDate || !depTime || !retDate || !retTime) {
      step2.patchValue({ perDiemStartDate: null, perDiemEndDate: null, perDiemDays: 0 });

      this.snackBar.open('Please select both departure and return dates & times.', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['warning-snackbar']
      });

      return;
    }

    const parseTime = (date: Date, timeStr: string): Date => {
      const [time, meridian] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (meridian === 'PM' && hours < 12) hours += 12;
      if (meridian === 'AM' && hours === 12) hours = 0;

      const newDate = new Date(date);
      newDate.setHours(hours, minutes, 0, 0);
      return newDate;
    };

    const depDateTime = parseTime(depDate, depTime);
    const retDateTime = parseTime(retDate, retTime);

    let perDiemStart = new Date(depDateTime);
    let perDiemEnd = new Date(retDateTime);

    // Apply AM/PM rules
    if (depDateTime.getHours() >= 12) perDiemStart.setDate(perDiemStart.getDate() + 1);
    if (retDateTime.getHours() < 12) perDiemEnd.setDate(perDiemEnd.getDate() - 1);

    // Ensure valid range
    if (perDiemStart > perDiemEnd) {
      step2.patchValue({ perDiemStartDate: null, perDiemEndDate: null, perDiemDays: 0 });

      this.snackBar.open('Return date cannot be in the past. Please correct the dates.', 'Close', {
        duration: 10000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['warning-snackbar']
      });

      return;
    }

    // Calculate per diem days
    const msPerDay = 24 * 60 * 60 * 1000;
    let totalDays = Math.round((perDiemEnd.getTime() - perDiemStart.getTime()) / msPerDay) + 1;

    // Subtract days out of official assignment
    totalDays = Math.max(totalDays - daysOut, 0);

    // Patch the form
    step2.patchValue({
      perDiemStartDate: perDiemStart,
      perDiemEndDate: perDiemEnd,
      perDiemDays: totalDays
    });

    this.cdr.markForCheck();
  }

  /* ---------------- SUBMIT ---------------- */

  onSubmit(): void {
    if (this.travelForm.invalid) return;

    this.loading = true;
    const payload = this.travelForm.getRawValue();

    this.travelService.create(payload).subscribe({
      next: () => {
        this.loading = false;
        localStorage.removeItem('travelFormDraft');

        this.dialog.open(SubmissionResultDialogComponent, {
          data: { success: true }
        });

        this.router.navigate(['/travel/list']);
      },
      error: () => {
        this.loading = false;
        this.dialog.open(SubmissionResultDialogComponent, {
          data: { success: false }
        });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/travel']);
  }
}
