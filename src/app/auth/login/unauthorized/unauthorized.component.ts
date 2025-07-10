import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule,MatToolbarModule,MatIconModule,
    MatMenuModule,
    RouterModule],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss'
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/travel']);
  }
  
}


// @Component({
//   selector: 'app-unauthorized',
//   imports: [],
//   templateUrl: './unauthorized.component.html',
//   styleUrl: './unauthorized.component.scss'
// })
// export class UnauthorizedComponent {

// }
