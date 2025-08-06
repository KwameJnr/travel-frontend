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
    MatIcon
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
    // const isAdminUser = this.isAdminUser(); // Check if admin
    // return this.travel?.status === 'Pending BU Head Approval' && !isAdminUser;
    return this.travel?.status === 'Pending CFO Approval';
  }
  
  isAdminUser(): boolean {
    const email = localStorage.getItem('userRole') || '';
    return email.toLowerCase().includes('tr-admin');
  }

  ngOnInit(): void {
    // console.log('BuheadDetailComponent loaded');

    const id = this.route.snapshot.paramMap.get('id');
    this.travelService.getById(id!).subscribe({
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
  
  approve() {
    if (this.actionForm.invalid) return;
  
    const payload = {
      // excoHeadStatus: this.actionForm.value.excoHeadStatus,
      cfoStatus: 'Successful',
      cfoFeedback: this.actionForm.value.cfoFeedback,
      cfoFeedbackRemarks: this.actionForm.value.cfoFeedbackRemarks,
      status: 'CFO Approval Successful'
    };
  
    this.submitAction(payload, false);
  }
  
  reject() {
    if (this.actionForm.invalid) return;
  
    const payload = {
      cfoStatus: 'Successful',
      cfoFeedback: this.actionForm.value.cfoFeedback,
      cfoFeedbackRemarks: this.actionForm.value.cfoFeedbackRemarks,
      status: 'CFO Approval Rejected'
    };
  
    this.submitAction(payload, false);
  }  

  details() {
    this.dialog.open(EmployeeDetailComponent, {
      width: '600px',
      data: this.travel  // Pass full travel data here
    });

    // this.submitAction(payload, false);
  }

  private submitAction(payload: any, notifyCfo: boolean) {
    this.travelService.updateBuHeadFeedback(this.travel.travelId, payload).subscribe({
      next: () => {
        this.snackBar.open(`Request ${payload.status.toLowerCase()}`, 'Close', { duration: 3000 });
  
        // Notify CFO only if approved
        if (notifyCfo) {
          const cfoEmailPayload = {
            clientKey: 'Travel-Request-Manager-EmailerId-CFO',
            approvalRequestId: this.travel.travelId,
            fromEmail: 'Travel Request <travelrequest@firstnationalbank.com.gh>',
            toEmail: this.travel.cfoEmail,
            subject: `Travel Request Ready for Your Approval: ${this.travel.purpose}`,
            body: `
              <p>Dear ${this.travel.cfoName},</p>
              
              <p>A travel request by <strong>${this.travel.employeeName}</strong> has been forwarded for your approval.</p>
              
              <p>
                Purpose: ${this.travel.purpose}<br>
                Departure Date: ${this.travel.departureDate}<br>
                Return Date: ${this.travel.returnDate}
              </p>
              
              <p>Regards,<br>Travel Request Management System</p>
            `
          };
  
          this.travelService.sendApprovalEmailFrontEndWithAttachment(cfoEmailPayload).subscribe({
            next: () => console.log('Approval email sent to CFO'),
            error: (err) => console.error('Failed to send approval email to CFO', err)
          });
        }
  
        // Always notify requester
        const recipients = [
          {
            name: this.travel.employeeName,
            email: this.travel.employeeEmail
          },
          {
            name: this.travel.excoHeadName,
            email: this.travel.excoHeadEmail
          },
          {
            name: this.travel.cfoName,
            email: this.travel.cfoEmail
          }
        ];
    
        recipients.forEach((recipient) => {
          const personalizedEmailPayload = {
            clientKey: 'Travel-Request-Manager-EmailerId-Requester',
            fromEmail: 'Travel Request <travelrequest@firstnationalbank.com.gh>',
            toEmail: recipient.email,
            subject: `Your Travel Request Status Update`,
            body: `
              <p>Dear ${recipient.name},</p>
    
              <p>Travel request status for ${this.travel.employeeName} has been updated to: <strong>${payload.status}</strong>.</p>
    
              <p>
                Purpose: ${this.travel.purpose}<br>
                Departure Date: ${this.travel.departureDate}<br>
                Return Date: ${this.travel.returnDate}
              </p>
    
              <p>Regards,<br>Travel Request Management System</p>`
          };
    
          this.travelService.sendEmailMsg(personalizedEmailPayload).subscribe({
            next: () => console.log(`Notification email sent to ${recipient.name}`),
            error: (err) => console.error(`Failed to send notification email to ${recipient.name}`, err)
          });
        });
  
        this.router.navigate(['/travel/buhead/list']);
      },
      error: () => {
        this.snackBar.open('Failed to update status.', 'Close', { duration: 3000 });
      }
    });
  }

  goBack(): void {
    this.location.back();  // ✅ This works
  }
  
}


// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-cfo-detail',
//   imports: [],
//   templateUrl: './cfo-detail.component.html',
//   styleUrl: './cfo-detail.component.scss'
// })
// export class CfoDetailComponent {

// }
