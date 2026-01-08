import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TravelService } from 'src/app/core/services/travel.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { EmployeeDetailComponent } from 'src/app/travel/employee-detail/employee-detail.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Location } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';


@Component({
  selector: 'app-cfo-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatOption,
    MatSelectModule,
    MatSnackBarModule,
    MatDialogModule,
    MatIcon,
    MatDividerModule
  ],
  templateUrl: './cfo-detail.component.html',
  styleUrl: './cfo-detail.component.scss'
})
export class CfoDetailComponent  implements OnInit {
  travel: any;
  loading = true;
  actionForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private travelService: TravelService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    private location: Location
  ) {}

  get isEditable(): boolean {
    const isAdminUser = this.isAdminUser(); // Check if admin
    return this.travel?.status === 'PENDING_CFO_APPROVAL';
    // return this.travel?.status === 'PENDING_CFO_APPROVAL' && !isAdminUser;  //allow only cfo to approve
  }
  
  isAdminUser(): boolean {
    const email = localStorage.getItem('userRole') || '';
    return email.toLowerCase().includes('tr-admin');
  }

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');
    this.travelService.getMyTravelRequestsById(id!).subscribe({
      next: (res) => {
        this.travel = res;
        this.initForm();
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load travel details.', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  initForm() {
    this.actionForm = this.fb.group({
      cfoStatus: ['Pending', Validators.required],
      cfoFeedback: ['', Validators.required],
      cfoFeedbackRemarks: ['', Validators.required]
    });
  }
  
  // cfo-detail.component.ts
  approve(): void {
    this.submitDecision('APPROVED');
  }

  reject(): void {
    this.submitDecision('REJECTED');
  }

  private submitDecision(feedback: 'APPROVED' | 'REJECTED'): void {
    if (this.actionForm.invalid) {
      this.actionForm.markAllAsTouched();
      return;
    }

    const payload = {
      travelId: this.travel.travelId, // UUID
      feedback,
      remarks: this.actionForm.value.cfoFeedbackRemarks ?? ''
    };

    this.travelService.submitCfoApproval(payload).subscribe({
      next: () => {
        this.snackBar.open(
          `Travel request ${feedback.toLowerCase()} successfully`,
          'Close',
          { duration: 3000 }
        );
        this.router.navigate(['/cfo/list']);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open(
          'Failed to submit CFO decision',
          'Close',
          { duration: 4000 }
        );
      }
    });
  }


  details() {
    this.dialog.open(EmployeeDetailComponent, {
      width: '600px',
      data: this.travel  // Pass full travel data here
    });

  }

  goBack(): void {
    this.location.back();  
  }
  
}
