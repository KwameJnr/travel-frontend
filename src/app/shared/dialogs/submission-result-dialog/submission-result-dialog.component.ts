import { NgClass } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-submission-result-dialog',
  templateUrl: './submission-result-dialog.component.html',
  styleUrls: ['./submission-result-dialog.component.scss'],
  standalone: true,
  imports: [
    MatIcon,
    NgClass
  ],
})
export class SubmissionResultDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SubmissionResultDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { success: boolean; message: string }
  ) {}
}
