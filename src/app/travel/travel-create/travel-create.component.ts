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
  perDiemCountries: PerDiemForm[] = [];

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
        employeeTravellingContact: [''],
        employeeContact: [''],
        purpose: ['', Validators.required]
      }),

      city: [''],
      country: [''],
      visaRequired: [''],

      departureDate: ['', Validators.required],
      departureTime: ['', Validators.required],
      returnDate: ['', Validators.required],
      returnTime: ['', Validators.required],

      perDiemStartDate: [{ value: null, disabled: true }],
      perDiemEndDate: [{ value: null, disabled: true }],
      daysOutOfficialAssignmentDate: [{ value: 0, disabled: true }],
      perDiemDays: [{ value: 0, disabled: true }],
      estimatedPerDiemAmount: [{ value: 0, disabled: true }],

      totalEstimatedTravelCost: [0],
      travelBudgetCode: [''],

      excoHeadName: [''],
      excoHeadEmail: [''],
      cfoName: [''],
      cfoEmail: [''],

      status: [''],
      dateCreated: [new Date()]
    }, { validators: perDiemDateValidator });
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

    ['departureDate', 'departureTime', 'returnDate', 'returnTime']
      .forEach(field =>
        this.travelForm.get(field)?.valueChanges
          .subscribe(() => this.calculateWorkingDays())
      );

    ['perDiemStartDate', 'perDiemEndDate', 'country']
      .forEach(field =>
        this.travelForm.get(field)?.valueChanges
          .subscribe(() => this.calculatePerDiemDays())
      );
  }

  /* ---------------- DATA LOAD ---------------- */

  private loadInitialData(): void {
    this.travelService.getDepartments().subscribe(r => {
      this.departments = r.data;
      this.cdr.markForCheck();
    });

    this.travelService.getBAUHeads().subscribe(r => {
      this.bauHeads = r.data;
      this.cdr.markForCheck();
    });
  }

  onStepChange(index: number): void {
    if (index === 1 && !this.perDiemLoaded) {
      this.perDiemLoaded = true;

      this.travelService.getAllPerDiemCountries().subscribe(r => {
        this.perDiemCountries = this.uniqueCountries(r.data);
        this.cdr.markForCheck();
      });
    }
  }

  /* ---------------- HELPERS ---------------- */

  private restoreDraft(): void {
    const draft = localStorage.getItem('travelFormDraft');
    if (draft) {
      this.travelForm.patchValue(JSON.parse(draft));
    }
  }

  private uniqueCountries(data: PerDiemForm[]): PerDiemForm[] {
    const seen = new Set<string>();
    return data.filter(p => {
      const loc = p.location?.trim();
      if (!loc || seen.has(loc)) return false;
      seen.add(loc);
      return true;
    });
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

  calculatePerDiemDays(): void {
    // (Your existing logic unchanged – safe & fast)
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
