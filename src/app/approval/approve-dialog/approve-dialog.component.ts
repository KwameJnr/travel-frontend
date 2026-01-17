import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ApproveDialogData {
  title: string;
  message: string;
  action: 'APPROVE' | 'REJECT' | 'RETURN';
}

@Component({
  selector: 'app-approve-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './approve-dialog.component.html',
  styleUrls: ['./approve-dialog.component.scss']
})
export class ApproveDialogComponent {
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ApproveDialogData
  ) {}

  get actionColor(): 'primary' | 'warn' | 'accent' {
    switch (this.data.action) {
      case 'APPROVE':
        return 'primary';
      case 'REJECT':
        return 'warn';
      case 'RETURN':
        return 'accent';
      default:
        return 'primary';
    }
  }

  get actionIcon(): string {
    switch (this.data.action) {
      case 'APPROVE':
        return 'check_circle';
      case 'REJECT':
        return 'cancel';
      case 'RETURN':
        return 'reply';
      default:
        return 'help';
    }
  }
}
