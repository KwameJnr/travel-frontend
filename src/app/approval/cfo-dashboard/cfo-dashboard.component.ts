import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TravelService } from 'src/app/core/services/travel.service';
import { CfoDashboardMetrics } from 'src/app/shared/models/cfo/CfoDashboadMetrics';
import { NgChartsModule } from 'ng2-charts';
import { ChartData } from 'chart.js';
import { FormsModule } from '@angular/forms';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cfo-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, NgChartsModule, FormsModule],
  templateUrl: './cfo-dashboard.component.html',
  styleUrl: './cfo-dashboard.component.scss'
})
export class CfoDashboardComponent implements OnInit {
  metrics!: CfoDashboardMetrics;

  approvalChartData: ChartData<'doughnut', number[], string> = {
    labels: [],
    datasets: []
  };

  monthlyCostChartData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: []
  };

  constructor(private travelService: TravelService,private router: Router) {}

  selectedYear = new Date().getFullYear();
selectedMonth: number | null = null;

topDepartmentsChartData: ChartData<'bar', number[], string> = {
  labels: [],
  datasets: []
};

fetchTopDepartments() {
  this.travelService.getTopDepartments(this.selectedYear, this.selectedMonth ?? undefined)
    .subscribe(deptData => {
      this.topDepartmentsChartData = {
        labels: deptData.map(item => item.department),
        datasets: [
          {
            label: 'Estimated Cost by Department (GHS)',
            data: deptData.map(item => item.cost),
            backgroundColor: '#9c27b0'
          }
        ]
      };
    });
}

  ngOnInit(): void {
    const userRole = localStorage.getItem('userRole');

  if (userRole !== 'CFO' && userRole !== 'ADMIN') {
    this.router.navigate(['/unauthorized']);  // Redirect unauthorized users
    return;
  }
    // Approval Summary
    this.travelService.getMetrics().subscribe(data => {
      this.metrics = data;
      this.approvalChartData = {
        labels: ['Approved', 'Pending', 'Rejected'],
        datasets: [
          {
            data: [data.approvedRequests, data.pendingRequests, data.rejectedRequests],
            backgroundColor: ['#4caf50', '#ff9800', '#f44336']
          }
        ]
      };
    });

    // Monthly Estimated Cost Breakdown
    this.travelService.getMonthlyCosts(2025).subscribe(monthlyData => {
      this.monthlyCostChartData = {
        labels: monthlyData.map(item => item.month),
        datasets: [
          {
            label: 'Monthly Estimated Cost (GHS)',
            data: monthlyData.map(item => item.cost),
            backgroundColor: '#2196f3'
          }
        ]
      };
    });
    this.fetchTopDepartments();
  }

  exportToExcel(): void {
    const dashboardMetrics = [
      { Metric: 'Total Requests', Value: this.metrics.totalRequests },
      { Metric: 'Approved Requests', Value: this.metrics.approvedRequests },
      { Metric: 'Pending Requests', Value: this.metrics.pendingRequests },
      { Metric: 'Rejected Requests', Value: this.metrics.rejectedRequests },
      { Metric: 'Total Estimated Cost', Value: this.metrics.totalEstimatedCost },
      { Metric: 'Total Per Diem Cost', Value: this.metrics.totalApprovedCost }
    ];
  
    const approvalChart = this.approvalChartData.labels!.map((label, i) => ({
      Status: label,
      Count: this.approvalChartData.datasets[0].data[i]
    }));
  
    const monthlyCosts = this.monthlyCostChartData.labels!.map((month, i) => ({
      Month: month,
      Cost: this.monthlyCostChartData.datasets[0].data[i]
    }));
  
    const topDepartments = this.topDepartmentsChartData.labels!.map((dept, i) => ({
      Department: dept,
      Cost: this.topDepartmentsChartData.datasets[0].data[i]
    }));
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dashboardMetrics), 'Dashboard Metrics');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(approvalChart), 'Approval Status');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(monthlyCosts), 'Monthly Costs');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(topDepartments), 'Top Departments');
  
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer]), 'CFO_Dashboard_Data.xlsx');
  }

  exportToPdf(): void {
    const doc = new jsPDF();
  
    doc.text('CFO Dashboard Metrics', 14, 10);
  
    autoTable(doc, {
      startY: 20,
      head: [['Metric', 'Value']],
      body: [
        ['Total Requests', this.metrics.totalRequests],
        ['Approved Requests', this.metrics.approvedRequests],
        ['Pending Requests', this.metrics.pendingRequests],
        ['Rejected Requests', this.metrics.rejectedRequests],
        ['Total Estimated Cost', this.metrics.totalEstimatedCost],
        ['Total Per Diem Cost', this.metrics.totalApprovedCost]
      ]
    });
  
    const finalY1 = (doc as any).lastAutoTable.finalY;
  
    autoTable(doc, {
      startY: finalY1 + 10,
      head: [['Status', 'Count']],
      body: this.approvalChartData.labels!.map((label, i) => [
        label,
        this.approvalChartData.datasets[0].data[i]
      ])
    });
  
    const finalY2 = (doc as any).lastAutoTable.finalY;
  
    autoTable(doc, {
      startY: finalY2 + 10,
      head: [['Month', 'Cost']],
      body: this.monthlyCostChartData.labels!.map((month, i) => [
        month,
        this.monthlyCostChartData.datasets[0].data[i]
      ])
    });
  
    const finalY3 = (doc as any).lastAutoTable.finalY;
  
    autoTable(doc, {
      startY: finalY3 + 10,
      head: [['Department', 'Cost']],
      body: this.topDepartmentsChartData.labels!.map((dept, i) => [
        dept,
        this.topDepartmentsChartData.datasets[0].data[i]
      ])
    });
  
    doc.save('CFO_Dashboard_Data.pdf');
  }
}
