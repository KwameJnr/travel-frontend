

// @Component({
//   selector: 'app-perdiem-detail',
//   imports: [],
//   templateUrl: './perdiem-detail.component.html',
//   styleUrl: './perdiem-detail.component.scss'
// })
// export class PerdiemDetailComponent {

// }

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { TravelService } from 'src/app/core/services/travel.service';
import { Travel } from 'src/app/shared/models/travel/travel.model';
import { Location } from '@angular/common';
import { PerdiemService } from 'src/app/core/services/perdiem.service';
import { PerDiem } from 'src/app/shared/models/perdiem/perdiem.model';
import { MatDividerModule } from '@angular/material/divider';


@Component({
  selector: 'app-perdiem-detail',
  templateUrl: './perdiem-detail.component.html',
  styleUrl: './perdiem-detail.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDividerModule
  ]
})
export class PerdiemDetailComponent implements OnInit {
  perdiem?: PerDiem;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private perdiemService: PerdiemService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.loading = false;
      return;
    }

    this.perdiemService.getById(id).subscribe({
      next: (data) => {
        this.perdiem = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching perdiem details', err);
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
