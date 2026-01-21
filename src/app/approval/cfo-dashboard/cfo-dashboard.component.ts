import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

import { TravelService } from 'src/app/core/services/travel.service';

@Component({
  selector: 'app-cfo-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,

    NgChartsModule
  ],
  templateUrl: './cfo-dashboard.component.html',
  styleUrls: ['./cfo-dashboard.component.scss']
})
export class CfoDashboardComponent implements OnInit {

  /* ---------------- FILTERS ---------------- */
  years: number[] = [];
  months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  selectedYear: number | null = null;
  selectedMonth: number | null = null;

  /* ---------------- METRICS ---------------- */
  metrics: any = {};
  departmentRanking: any[] = [];

  displayedColumns = ['department', 'code', 'requests'];

  /* ---------------- CHARTS ---------------- */

  approvalChartType: ChartType = 'doughnut';
  approvalChartData: ChartConfiguration['data'] = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#16a34a', '#ca8a04', '#dc2626']
    }]
  };

  approvalChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  departmentChartType: ChartType = 'bar';
  departmentChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [{
      label: 'Travel Requests',
      data: [],
      backgroundColor: '#159e97'
    }]
  };

  departmentChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  constructor(private travelService: TravelService) {}

  /* ---------------- INIT ---------------- */
  ngOnInit(): void {
    this.initYears();
    this.applyFilters(); // load initial (All)
  }

  private initYears(): void {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 6 }, (_, i) => currentYear - i);
  }

  /* ---------------- ACTIONS ---------------- */
  applyFilters(): void {
    this.loadMetrics(this.selectedYear ?? undefined, this.selectedMonth ?? undefined);
    this.loadDepartmentRanking(this.selectedYear ?? undefined, this.selectedMonth ?? undefined);
  }

  /* ---------------- API CALLS ---------------- */

  loadMetrics(year?: number, month?: number): void {
    this.travelService.getCfoDashboardMetrics(year, month).subscribe(res => {
      const data = res?.data?.[0];
      if (!data) return;

      this.metrics = data;

      this.approvalChartData = {
        ...this.approvalChartData,
        datasets: [{
          ...this.approvalChartData.datasets[0],
          data: [
            data.approvedRequests,
            data.pendingRequests,
            data.rejectedRequests
          ]
        }]
      };
    });
  }

  loadDepartmentRanking(year?: number, month?: number): void {
    this.travelService.getDepartmentRanking(year, month).subscribe(res => {
      const data = res?.data || [];
      this.departmentRanking = data;

      this.departmentChartData = {
        ...this.departmentChartData,
        labels: data.map((d: any) => d.departmentCode),
        datasets: [{
          ...this.departmentChartData.datasets[0],
          data: data.map((d: any) => d.requestCount)
        }]
      };
    });
  }
}
