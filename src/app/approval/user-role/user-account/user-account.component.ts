import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss']
})
export class UserAccountComponent {

  user = {
    name: localStorage.getItem('userName'),
    title: localStorage.getItem('userTitle'),
    email: localStorage.getItem('loggedInEmail'),
    role: localStorage.getItem('userRole'),
    fnumber: localStorage.getItem('userFnumber'),
    mobile: localStorage.getItem('userMobile')
  };

  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}

