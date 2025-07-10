// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-employee-detail',
//   imports: [],
//   templateUrl: './employee-detail.component.html',
//   styleUrl: './employee-detail.component.scss'
// })
// export class EmployeeDetailComponent {

// }

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatCardModule, MatIcon],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.scss'
})
export class EmployeeDetailComponent  {
  constructor(
    public dialogRef: MatDialogRef<EmployeeDetailComponent >,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm() { this.dialogRef.close(true); }
  onCancel() { this.dialogRef.close(false); }
}