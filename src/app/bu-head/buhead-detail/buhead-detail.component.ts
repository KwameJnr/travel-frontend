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
    MatSnackBarModule
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
    private router: Router
  ) {}

  ngOnInit(): void {
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
      feedback: ['', Validators.required]
    });
  }

  approve() {
    if (this.actionForm.invalid) return;
    const payload = {
      status: 'Approved',
      feedback: this.actionForm.value.feedback
    };
    this.submitAction(payload);
  }

  reject() {
    if (this.actionForm.invalid) return;
    const payload = {
      status: 'Rejected',
      feedback: this.actionForm.value.feedback
    };
    this.submitAction(payload);
  }

  private submitAction(payload: any) {
    this.travelService.updateBuHeadFeedback(this.travel.travelId, payload).subscribe({
      next: () => {
        this.snackBar.open(`Request ${payload.status.toLowerCase()}`, 'Close', { duration: 3000 });
        this.router.navigate(['/travel/buhead/list']);
      },
      error: () => {
        this.snackBar.open('Failed to update status.', 'Close', { duration: 3000 });
      }
    });
  }
}
