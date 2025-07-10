import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  // roles = ['EMPLOYEE', 'BU_HEAD', 'CFO', 'ADMIN'];

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    document.body.classList.add('login-page');
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const role = this.loginForm.value.role;
      localStorage.setItem('loggedInEmail', email);  // Save email in local storage
      localStorage.setItem('userRole', role); // Save role in local storage
      this.router.navigate(['/travel']);
    }
  }
  
  // onSubmit(): void {
  //   document.body.classList.add('login-page');
  //   if (this.loginForm.valid) {
  //     // Replace with real auth logic
  //     this.router.navigate(['/travel']);
  //   }
  // }
}
