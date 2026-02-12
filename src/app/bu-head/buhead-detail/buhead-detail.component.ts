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
import { ApproveDialogComponent } from 'src/app/approval/approve-dialog/approve-dialog.component';


@Component({
  selector: 'app-buhead-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDialogModule,
    MatIcon,
    MatDividerModule
  ],
  templateUrl: './buhead-detail.component.html',
  styleUrls: ['./buhead-detail.component.scss']
})
export class BuheadDetailComponent implements OnInit {
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
    // return this.travel?.status === 'PENDING_BUH_APPROVAL' && !isAdminUser;
    return this.travel?.status === 'PENDING_BUH_APPROVAL';
  }
  
  isAdminUser(): boolean {
    const email = localStorage.getItem('userRole') || '';
    return email.toLowerCase().includes('admin');
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
      buHeadFeedbackRemarks: ['', Validators.required]
    });
  }
  
   approve(): void {
    this.confirmAction('APPROVED');
  }

    reject(): void {
      this.confirmAction('REJECTED');
    }

    returnForReview() {
      this.confirmAction('RETURNED');
    
    }
    
    private submitDecision(feedback: 'APPROVED' | 'REJECTED' | 'RETURNED'): void {
      if (this.actionForm.invalid) {
        this.actionForm.markAllAsTouched();
        return;
      }

      const payload = {
        travelId: this.travel.travelId, // UUID
        feedback,
        remarks: this.actionForm.value.buHeadFeedbackRemarks ?? ''
      };

      this.travelService.submitBuApproval(payload).subscribe({
        next: () => {
          this.snackBar.open(
            `Travel request ${feedback.toLowerCase()} successfully`,
            'Close',
            { duration: 3000 }
          );
          this.router.navigate(['travel/buhead/list']);
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open(
            'Failed to submit Bu Head decision',
            'Close',
            { duration: 4000 }
          );
        }
      });
    }

    confirmAction(
      action: 'APPROVED' | 'REJECTED' | 'RETURNED'
    ): void {
      const dialogRef = this.dialog.open(ApproveDialogComponent, {
        width: '420px',
        data: {
          title: 'Confirm Action',
          message: `Are you sure you want this travel request ${action.toLowerCase()} ?`,
          action: action === 'APPROVED'
            ? 'APPROVE'
            : action === 'REJECTED'
            ? 'REJECT'
            : 'RETURN'
        }
      });

      dialogRef.afterClosed().subscribe(confirmed => {
        if (confirmed) {
          this.submitDecision(action);
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
