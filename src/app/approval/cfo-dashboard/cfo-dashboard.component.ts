import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { NgChartsModule } from 'ng2-charts';
import { ChartType, ChartConfiguration } from 'chart.js';
import { TravelService } from 'src/app/core/services/travel.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cfo-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    NgChartsModule,
    RouterModule
  ],
  templateUrl: './cfo-dashboard.component.html',
  styleUrls: ['./cfo-dashboard.component.scss']
})
export class CfoDashboardComponent implements OnInit {

  metrics: any = {};
  departmentRanking: any[] = [];

  displayedColumns = ['department', 'code', 'requests'];

  /* -------- DONUT CHART (APPROVAL STATUS) -------- */
  approvalChartType: ChartType = 'doughnut';
  approvalChartData: ChartConfiguration['data'] = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#16a34a', '#ca8a04', '#dc2626'] // bright colors
    }]
  };
  approvalChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  /* -------- BAR CHART (DEPARTMENT RANKING) -------- */
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
      legend: {
        display: false
      }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  constructor(private travelService: TravelService) {}

  ngOnInit(): void {
    this.loadMetrics();
    this.loadDepartmentRanking();
  }

  private loadMetrics(): void {
    this.travelService.getCfoDashboardMetrics().subscribe(res => {
      const data = res?.data?.[0];
      if (!data) return;

      this.metrics = data;

      // Update chart immutably to trigger re-render
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

  private loadDepartmentRanking(): void {
    this.travelService.getDepartmentRanking().subscribe(res => {
      const data = res?.data || [];
      this.departmentRanking = data;

      // Update chart immutably to trigger re-render
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
