import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ConfigService } from 'src/app/config.service';
import { AuthService } from 'src/app/core/services/auth.service';

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
  private get baseUrl() {
    return this.config.get('baseUrl');
  }

  // ================= DEV CONFIG =================
  private readonly DEV_BYPASS_LOGIN = false; // 👈 SET TO FALSE BEFORE PROD

  // ================= Polling / Overlay =================
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
    private config: ConfigService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    document.body.classList.add('login-page');
    // this.baseUrl = this.config.get('baseUrl');

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

  // ================= DEV LOGIN BYPASS =================
  private devLogin(): void {
    console.warn('⚠️ DEV LOGIN BYPASS ACTIVE');

    const devResponse = {
      token: 'DEV_JWT_TOKEN',
      user: {
        userId: 'F5353203',
        name: 'Dev User',
        mail: 'dev.user@bank.com',
        role: 'TR_ADMIN',
        // role: 'TR_BU_HEAD',
        // role: 'TR_CFO',
        mobile: '0000000000',
        title: 'Software Engineer'
      }
    };

    this.showPollingOverlay = true;
    this.showPollingMessage = true;
    this.isPolling = true;
    this.pollingMessage = 'Logging in (DEV BYPASS)...';
    this.isErrorPollingMessage = false;
    this.cdr.detectChanges();

    // Show overlay for 4 seconds before success
    setTimeout(() => {
      this.handleSuccess(devResponse);
    }, 4000);
  }

  // ================= SUBMIT LOGIN =================
  onSubmit(): void {
    if (this.loginForm.invalid) return;

    if (this.DEV_BYPASS_LOGIN) {
      this.devLogin();
      return;
    }

    this.loginForm.disable();
    const { fnumber, password } = this.loginForm.value;

    console.log(this.baseUrl + "this is the base url")
    // Properly encode special chars in query string
    const url = `${this.baseUrl}/auth/login?fnumber=${encodeURIComponent(fnumber)}&password=${encodeURIComponent(password)}`;

    console.log(url + "working")

    this.showPollingOverlay = true;
    this.showPollingMessage = true;
    this.isPolling = true;
    this.pollingMessage = 'Authenticating...';
    this.isErrorPollingMessage = false;
    this.cdr.detectChanges();

    this.http.post<any>(url, null).subscribe({
      next: (res) => {
        const authId = res?.authId;
        if (!authId) {
          this.handleFailure('Authentication failed.');
          return;
        }
        this.start2FAPolling(authId);
      },
      error: (err) => {
        console.error('Login failed', err);
        this.handleFailure('Invalid F-Number or Password.');
      }
    });
  }

  // ================= 2FA POLLING =================
  private start2FAPolling(authId: string): void {
    this.pollingAttempts = 0;
    this.hasLoggedIn = false;
    this.pollingCountdown = this.maxPollingAttempts * 2;

    this.startCountdown();

    const poll = () => {
      if (this.hasLoggedIn || !this.isComponentAlive) return;

      this.pollingAttempts++;

      this.http.post<any>(
        `${this.baseUrl}/auth/verify2fa`,
        null,
        { params: { authId } }
      ).subscribe({
        next: (res) => {
          if (!this.isComponentAlive || this.hasLoggedIn) return;

          const statusCode = res?.statusCode;

          switch (statusCode) {
            case '000':
              this.handleSuccess(res);
              break;
            case '002':
            case '001':
              this.pollingMessage = 'Approve the login request on your phone';
              this.isErrorPollingMessage = false;
              break;
            default:
              this.pollingMessage = 'Awaiting authentication...';
              this.isErrorPollingMessage = false;
          }
          this.cdr.detectChanges();
        },
        error: () => {
          if (!this.isComponentAlive) return;
          this.handleFailure('Network error during verification');
        }
      });

      if (this.pollingAttempts >= this.maxPollingAttempts) {
        this.handleFailure('2FA timeout. Please try again.');
      }
    };

    this.pollingInterval = setInterval(poll, 2000);
  }

  // ================= SUCCESS HANDLER =================
  private handleSuccess(res: any): void {
    this.hasLoggedIn = true;
    this.showPollingOverlay = false;
    this.cleanupPolling();

    const user = res?.user;
    if (!user?.mail) {
      this.snackBar.open('Login failed: Email missing.', 'Dismiss', { duration: 4000 });
      this.loginForm.enable();
      return;
    }

    localStorage.setItem('loggedInEmail', user.mail);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userFnumber', user.userId);
    localStorage.setItem('userMobile', user.mobile);
    localStorage.setItem('userTitle', user.title);
    localStorage.setItem('userName', user.name);
    localStorage.setItem('userToken', res?.token);

    this.authService.login(res?.token);

    this.router.navigateByUrl('/travel/landing', { replaceUrl: true });

  }

  // ================= FAILURE HANDLER =================
  private handleFailure(message: string): void {
    this.showPollingOverlay = false;
    this.pollingMessage = message;
    this.isErrorPollingMessage = true;
    this.cleanupPolling();
    this.loginForm.enable();
    this.snackBar.open(message, 'Dismiss', { duration: 4000 });
  }

  // ================= CANCEL POLLING =================
  cancelPolling(): void {
    this.cleanupPolling();
    this.showPollingOverlay = false;
    this.pollingMessage = '';
    this.loginForm.enable();
  }

  // ================= COUNTDOWN =================
  private startCountdown(): void {
    this.countdownInterval = setInterval(() => {
      if (this.pollingCountdown > 0) this.pollingCountdown--;
    }, 1000);
  }

  private stopCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  // ================= CLEANUP =================
  private cleanupPolling(): void {
    this.stopPolling();
    this.stopCountdown();
    this.isPolling = false;
    this.showPollingMessage = false;
  }

  private stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

}
