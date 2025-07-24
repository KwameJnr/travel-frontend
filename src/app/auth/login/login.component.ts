import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


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
    MatProgressSpinnerModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  // roles = ['EMPLOYEE', 'BU_HEAD', 'CFO', 'ADMIN'];

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {}

    ngOnInit(): void {
      document.body.classList.add('login-page');
      this.loginForm = this.fb.group({
        fnumber: ['', Validators.required],
        password: ['', Validators.required]
      });
  }

  pollingInterval: any;
maxPollingAttempts = 30; // 1 minute with 2s interval
pollingAttempts = 0;
isPolling = false; // control UI state

onSubmit(): void {
  if (this.loginForm.valid) {
    this.loginForm.disable(); // Disable form to prevent resubmission
    this.isPolling = true;

    const fnumber = this.loginForm.value.fnumber;
    const password = this.loginForm.value.password;

    const authHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-SrcApp': 'Travel-Request'
    });

    this.http.post<any>('http://localhost:9090/camp/security/search-and-authenticate', {
      fnumber,
      password
    }, { headers: authHeaders }).subscribe({
      next: (res) => {
        const authId = res?.data?.[0]?.authId;
        if (authId) {
          this.start2FAPolling(authId);
        } else {
          alert('Authentication failed: No authId returned.');
          this.resetPollingState();
        }
      },
      error: (err) => {
        console.error('Login failed', err);
        alert('Invalid F-Number or Password.');
        this.resetPollingState();
      }
    });
  }
}

start2FAPolling(authId: string): void {
  this.pollingAttempts = 0;

  this.pollingInterval = setInterval(() => {
    this.pollingAttempts++;

    this.http.post<any>('http://localhost:9090/camp/security/verify-2fa', {
      authId
    }).subscribe({
      next: (res) => {
        const statusCode = res?.statusCode;

        if (statusCode === '000') {
        clearInterval(this.pollingInterval);
        this.resetPollingState();

        const user = res?.user;
        const userEmail = user?.mail;
        const userRole = user?.role;

        if (userEmail) {
          localStorage.setItem('loggedInEmail', userEmail);
          localStorage.setItem('userRole', userRole);
          this.router.navigate(['/travel/list']);
        } else {
          alert('Login failed: Email not found in response.');
        }
      }
      },
      error: (err) => {
        // Silently ignore and wait for next poll
      }
    });

    if (this.pollingAttempts >= this.maxPollingAttempts) {
      clearInterval(this.pollingInterval);
      alert('2FA timeout. Please try logging in again.');
      this.resetPollingState();
    }

  }, 2000);
}

resetPollingState(): void {
  this.isPolling = false;
  this.loginForm.enable();
  clearInterval(this.pollingInterval);
}

}
