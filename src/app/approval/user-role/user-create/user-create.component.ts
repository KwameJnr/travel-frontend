// user-role-create.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TravelService } from 'src/app/core/services/travel.service';
import { UserRole, CreateUserRoleDto  } from 'src/app/shared/models/app/user-role-models';


@Component({
  selector: 'app-user-role-create',
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
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {

  form!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private travelService: TravelService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      fNumber: ['', Validators.required],
      roleName: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload: CreateUserRoleDto = this.form.value;

    this.travelService.addUserRole(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = 'User role assigned successfully';

        setTimeout(() => {
          this.router.navigate(['/travel/user/list']);
        }, 1000);
      },
      error: (err) => {
        console.error('Failed to create user role', err);
        this.errorMessage = 'Failed to create user role';
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/travel/user/list']);
  }
}

