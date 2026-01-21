import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { TravelService } from 'src/app/core/services/travel.service';
import { Travel } from 'src/app/shared/models/travel/travel.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-travel-detail',
  templateUrl: './travel-detail.component.html',
  styleUrls: ['./travel-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule
  ]
})
export class TravelDetailComponent implements OnInit {
  travel?: Travel;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private travelService: TravelService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.travelService.getMyTravelRequestsById(id).subscribe({
      next: (travel: Travel) => {
        this.travel = travel; // assign the first travel
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching travel details', err);
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  async exportAsPDF(): Promise<void> {
    const element = document.getElementById('pdfContent');
    if (!element) {
      console.error('PDF export failed: #pdfContent not found.');
      return;
    }

    // 🔥 Lazy-load the library ONLY when needed
    const html2pdf = (await import('html2pdf.js')).default;

    const options: any = {
      margin: 0.5,
      filename: `travel-request-${this.travel?.employeeName || 'export'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(options).from(element).save();
  }
}
