import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ConfigService } from 'src/app/config.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm!: FormGroup;

  private baseUrlCamp!: string;

  /* =====================
   DEV CONFIG (Component-only)
   ===================== */
  private readonly DEV_BYPASS_LOGIN = true; // 👈 SET TO FALSE BEFORE PROD
  
  /* =====================
   Dev Login Bypass
   ===================== */
private devLogin(): void {
  console.warn('⚠️ DEV LOGIN BYPASS ACTIVE');

  const devResponse = {
    token: 'DEV_JWT_TOKEN',
    user: {
      userId: 'F123456',
      name: 'Dev User',
      mail: 'dev.user@bank.com',
      role: 'TR-ADMIN',
      mobile: '0000000000',
      title: 'Software Engineer'
    }
  };

  // Reuse the real success handler
  this.handleSuccess(devResponse);
}


  /* =====================
     Polling State
     ===================== */
  pollingInterval: any = null;
  countdownInterval: any = null;

  maxPollingAttempts = 30; // 60 seconds (2s interval)
  pollingAttempts = 0;
  pollingCountdown = 60;

  isPolling = false;
  showPollingOverlay = false;
  showPollingMessage = false;
  pollingMessage = '';
  isErrorPollingMessage = false;

  hasLoggedIn = false;
  isComponentAlive = true;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private config: ConfigService
  ) {}

  /* =====================
     Lifecycle
     ===================== */
  ngOnInit(): void {
    document.body.classList.add('login-page');

    this.baseUrlCamp = this.config.get('baseUrlCamp');

    this.loginForm = this.fb.group({
      fnumber: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.isComponentAlive = false;
    this.cleanupPolling();
    document.body.classList.remove('login-page');
  }

  /* =====================
     Submit Login
     ===================== */
  onSubmit(): void {
    if (this.loginForm.invalid) return;

    // 🚧 DEV LOGIN BYPASS (component-only)
    if (this.DEV_BYPASS_LOGIN) {
      this.devLogin();
      return;
    }

    //  Normal Login Flow
    this.loginForm.disable();

    const { fnumber, password } = this.loginForm.value;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-SrcApp': 'Travel-Request'
    });

    this.http
      .post<any>(`${this.baseUrlCamp}/travel-request/auth/login`, {
        fnumber,
        password
      }, { headers })
      .subscribe({
        next: (res) => {
          const authId = res?.data?.[0]?.authId;

          if (!authId) {
            this.handleFailure('Authentication failed.');
            return;
          }

          this.start2FAPolling(authId);
        },
        error: () => {
          this.handleFailure('Invalid F-Number or Password.');
        }
      });
  }

  /* =====================
     2FA Polling
     ===================== */
  start2FAPolling(authId: string): void {
    this.pollingAttempts = 0;
    this.hasLoggedIn = false;

    this.showPollingOverlay = true;
    this.isPolling = true;
    this.startCountdown();

    const poll = () => {
      if (this.hasLoggedIn || !this.isComponentAlive) {
        this.cleanupPolling();
        return;
      }

      this.pollingAttempts++;

      this.http
        .post<any>(`${this.baseUrlCamp}/travel-request/auth/verify2fa`, { authId })
        .subscribe({
          next: (res) => {
            if (!this.isComponentAlive || this.hasLoggedIn) return;

            const statusCode = res?.statusCode;
            const statusMessage = res?.statusMessage || '';

            switch (statusCode) {
              case '000':
                this.handleSuccess(res);
                break;

              case '001':
                this.handleFailure(
                  statusMessage || 'Authentication failed.'
                );
                break;

              case '002':
                this.pollingMessage = 'Approve the login request on your phone';
                this.isErrorPollingMessage = false;
                break;

              default:
                this.pollingMessage =
                  statusMessage || 'Awaiting authentication...';
                this.isErrorPollingMessage = false;
            }

            this.cdr.detectChanges();
          },
          error: () => {
            if (!this.isComponentAlive) return;
            this.handleFailure('Network error. Please try again.');
          }
        });

      if (this.pollingAttempts >= this.maxPollingAttempts) {
        this.handleFailure('2FA timeout. Please try again.');
      }
    };

    this.pollingInterval = setInterval(poll, 2000);
  }

  /* =====================
     Success Handler
     ===================== */
  private handleSuccess(res: any): void {
    this.hasLoggedIn = true;
    this.cleanupPolling();

    const user = res?.user;

    if (!user?.mail) {
      this.snackBar.open('Login failed: Email missing.', 'Dismiss', {
        duration: 4000
      });
      return;
    }

    localStorage.setItem('loggedInEmail', user.mail);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userFnumber', user.userId);
    localStorage.setItem('userMobile', user.mobile);
    localStorage.setItem('userTitle', user.title);
    localStorage.setItem('userName', user.name);
    localStorage.setItem('userToken', res?.token);

    // this.router.navigate(['/travel/list']);
    this.router.navigate(['/travel/landing']);
  }

  /* =====================
     Failure Handler
     ===================== */
  private handleFailure(message: string): void {
    this.pollingMessage = message;
    this.isErrorPollingMessage = true;

    this.cleanupPolling();
    this.snackBar.open(message, 'Dismiss', { duration: 4000 });
  }

  /* =====================
     Cancel
     ===================== */
  cancelPolling(): void {
    this.cleanupPolling();
    this.pollingMessage = '';
  }

  /* =====================
     Countdown
     ===================== */
  private startCountdown(): void {
    this.pollingCountdown = this.maxPollingAttempts * 2;

    this.countdownInterval = setInterval(() => {
      if (this.pollingCountdown > 0) {
        this.pollingCountdown--;
      }
    }, 1000);
  }

  private stopCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  /* =====================
     Cleanup
     ===================== */
  private cleanupPolling(): void {
    this.stopPolling();
    this.stopCountdown();

    this.isPolling = false;
    this.showPollingOverlay = false;

    this.loginForm.enable();
  }

  private stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }
}
