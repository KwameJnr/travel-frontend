import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-buhead-feedback-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatCardModule, MatIcon],
 templateUrl: './buhead-feedback-dialog.component.html',
  styleUrl: './buhead-feedback-dialog.component.scss'
})
export class BuheadFeedbackDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<BuheadFeedbackDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm() { this.dialogRef.close(true); }
  onCancel() { this.dialogRef.close(false); }
}
