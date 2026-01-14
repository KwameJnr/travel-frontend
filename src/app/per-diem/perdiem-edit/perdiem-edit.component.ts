import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { PerdiemService } from 'src/app/core/services/perdiem.service';
import { PerDiem, PerDiemEditRequest } from 'src/app/shared/models/perdiem/perdiem.model';

@Component({
  selector: 'app-perdiem-edit',
  standalone: true,
  templateUrl: './perdiem-edit.component.html',
  styleUrl: './perdiem-edit.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ]
})
export class PerdiemEditComponent implements OnInit {
  form!: FormGroup;
  loading = true;
  perdiemId!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private perdiemService: PerdiemService
  ) {}

  ngOnInit(): void {
    this.perdiemId = this.route.snapshot.paramMap.get('id')!;

    this.form = this.fb.group({
      dollarRate: [null, Validators.required],
      airFareCost: [0],
      accommodationCost: [0],
      visaApplicationCost: [0],
      transportationCost: [0],
      otherCost: [0],
      country: ['', Validators.required]
    });

    this.loadPerDiem();
  }

  private loadPerDiem(): void {
    this.perdiemService.getById(this.perdiemId).subscribe({
      next: (data) => {
        if (!data) {
          this.router.navigate(['/travel/perdiem']);
          return;
        }

        this.form.patchValue({
          dollarRate: data.dollarRate,
          airFareCost: data.airFareCost ?? 0,
          accommodationCost: data.accommodationCost ?? 0,
          visaApplicationCost: data.visaApplicationCost ?? 0,
          transportationCost: data.transportationCost ?? 0,
          otherCost: data.otherCost ?? 0,
          country: data.country
        });

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/travel/perdiem']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const payload: Partial<PerDiemEditRequest> = this.form.value;

    this.perdiemService.update(this.perdiemId, payload).subscribe({
      next: () => this.router.navigate(['/travel/perdiem']),
      error: err => console.error('Update failed', err)
    });
  }

  onCancel(): void {
    this.router.navigate(['/travel/perdiem']);
  }
}
