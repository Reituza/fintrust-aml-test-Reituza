import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  alerts: any[] = [];
  totalCustomers = 0;
  activeAlerts = 0;
  totalTransactions = 0;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadAlerts();
    this.loadCustomers();
  }

  loadAlerts(): void {
    this.apiService.getAlerts().subscribe(
      (data: any) => {
        this.alerts = data;
        this.activeAlerts = data.length;
      },
      (error: any) => {
        console.error('Error loading alerts:', error);
      }
    );
  }

  loadCustomers(): void {
    this.apiService.getCustomers().subscribe(
      (data: any) => {
        this.totalCustomers = data.total || data.length || 0;
      },
      (error: any) => {
        console.error('Error loading customers:', error);
      }
    );
  }
}
