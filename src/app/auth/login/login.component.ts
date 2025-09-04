import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { baseUrlCamp } from 'src/app/core/services/constants';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


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
    RouterModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  // roles = ['EMPLOYEE', 'BU_HEAD', 'CFO', 'ADMIN'];

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient, private cdr: ChangeDetectorRef, private snackBar: MatSnackBar) {}

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
    isPolling: boolean = false; // control UI state
    pollingMessage = ''; // message to show during polling
    showPollingMessage: boolean = false;
    isErrorPollingMessage = false; 

    ngOnDestroy(): void {
      document.body.classList.remove('login-page');
      clearInterval(this.pollingInterval); // Clear polling interval on component destroy
    }

    get fnumber() {
      return this.loginForm.get('fnumber');
    }

    get password() {
      return this.loginForm.get('password');
    }

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

      this.http.post<any>(`${baseUrlCamp}/security/search-and-authenticate`, {
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
          this.cdr.detectChanges(); // 👈 force Angular to update view
        }
      });
    }
  }

  start2FAPolling(authId: string): void {
    this.pollingAttempts = 0;

    this.pollingInterval = setInterval(() => {
      this.pollingAttempts++;

      this.http.post<any>(`${baseUrlCamp}/security/verify-2fa`, { authId }).subscribe({
        next: (res) => {
          const statusCode = res?.statusCode;
          const statusMessage = res?.statusMessage || '';

          if (statusCode === '000') {
            // ✅ Authentication successful
            clearInterval(this.pollingInterval);
            this.resetPollingState();

            const userToken = res?.token;
            const user = res?.user;
            const userEmail = user?.mail;

            if (userEmail) {
              localStorage.setItem('loggedInEmail', userEmail);
              localStorage.setItem('userRole', user?.role);
              localStorage.setItem('userFnumber', user?.userId);
              localStorage.setItem('userMobile', user?.mobile);
              localStorage.setItem('userTitle', user?.title);
              localStorage.setItem('userName', user?.name);
              localStorage.setItem('userToken', userToken);

              this.router.navigate(['/travel/list']);
            } else {
              this.pollingMessage = 'Login failed: Email not found in response.';
              this.showPollingMessage = true;
            }

          } else if (statusCode === '001') {
            // ❌ Authentication failed
            this.pollingMessage = statusMessage || 'Authentication failed. Please try again.';
            this.isErrorPollingMessage = true;
            this.showPollingMessage = true;
            this.cdr.detectChanges();
            clearInterval(this.pollingInterval);
            this.resetPollingState();
            this.isPolling = false;
            this.loginForm.enable();

          } else if (statusCode === '002') {
            // 🔄 Waiting for push notification
            this.pollingMessage = statusMessage || 'Awaiting push notification on your phone...';
            this.isErrorPollingMessage = false;
            this.showPollingMessage = true;
            this.cdr.detectChanges();

          } else {
            // 🔄 Other polling messages
            this.pollingMessage = statusMessage || 'Awaiting authentication...';
            this.isErrorPollingMessage = false;
            this.showPollingMessage = true;
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          clearInterval(this.pollingInterval);
          const msg = err?.error?.statusMessage || 'Network error. Please try again.';
          this.snackBar.open(msg, 'Dismiss', { duration: 4000 });
          this.resetPollingState();
          this.cdr.detectChanges();
        }
      });

      if (this.pollingAttempts >= this.maxPollingAttempts) {
        clearInterval(this.pollingInterval);
        this.snackBar.open('2FA timeout. Please try logging in again.', 'Dismiss', { duration: 4000 });
        this.resetPollingState();
        this.cdr.detectChanges();
      }

    }, 2000);
  }

  resetPollingState(): void {
    this.isPolling = false;
    this.loginForm.enable();
    clearInterval(this.pollingInterval);
  }

}
