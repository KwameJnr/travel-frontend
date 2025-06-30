import { CommonModule } from '@angular/common';
// import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { TravelService } from 'src/app/core/services/travel.service';
import { Travel } from 'src/app/shared/models/travel/travel.model';

@Component({
  selector: 'app-travel-detail',
  templateUrl: './travel-detail.component.html',
  styleUrls: ['./travel-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    // HttpClientModule,
    MatProgressSpinnerModule
  ]
})
export class TravelDetailComponent implements OnInit {
  travel?: Travel;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private travelService: TravelService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.travelService.getById(id).subscribe({
        next: (data) => {
          this.travel = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching travel details', err);
          this.loading = false;
        }
      });
    }
  }
}
