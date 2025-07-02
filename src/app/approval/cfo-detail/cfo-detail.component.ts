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
    MatSnackBarModule
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
    private router: Router
  ) {}

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
  
    this.submitAction(payload);
  }
  
  reject() {
    if (this.actionForm.invalid) return;
  
    const payload = {
      cfoStatus: 'Successful',
      cfoFeedback: this.actionForm.value.cfoFeedback,
      cfoFeedbackRemarks: this.actionForm.value.cfoFeedbackRemarks,
      status: 'CFO Approval Successful'
    };
  
    this.submitAction(payload);
  }  

  private submitAction(payload: any) {
    this.travelService.updateCfoFeedback(this.travel.travelId, payload).subscribe({
      next: () => {
        this.snackBar.open(`Request ${payload.status.toLowerCase()}`, 'Close', { duration: 3000 });
        this.router.navigate(['/travel/cfo/list']);
      },
      error: () => {
        this.snackBar.open('Failed to update status.', 'Close', { duration: 3000 });
      }
    });
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
