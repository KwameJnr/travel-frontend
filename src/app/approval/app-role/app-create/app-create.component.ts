import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TravelService } from 'src/app/core/services/travel.service';
import { ApplicationRole } from 'src/app/shared/models/app/application-role-model';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './app-create.component.html',
  styleUrls: ['./app-create.component.scss']
})
export class AppCreateComponent implements OnInit {

  roleForm!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private travelService: TravelService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      permissions: ['/**', Validators.required]
    });
  }

  submit(): void {
    if (this.roleForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const role: ApplicationRole = {
      name: this.roleForm.value.name,
      permissions: this.roleForm.value.permissions,
      dateCreated: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    this.travelService.addApplicationRole(role).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = `Role "${res.name}" created successfully!`;
        this.roleForm.reset({ permissions: '/**' });
      },
      error: (err) => {
        console.error('Failed to create role', err);
        this.errorMessage = 'Failed to create role';
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/travel/app/list']);
  }
}