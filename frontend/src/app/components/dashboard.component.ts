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
    console.log('Dashboard component initialized');
    this.loadAlerts();
    this.loadCustomers();
  }

  loadAlerts(): void {
    console.log('Loading alerts...');
    this.apiService.getAlerts().subscribe(
      (data: any) => {
        console.log('Alerts loaded:', data);
        this.alerts = data;
        this.activeAlerts = data.length;
      },
      (error: any) => {
        console.error('Error loading alerts:', error);
      }
    );
  }

  loadCustomers(): void {
    console.log('Loading customers...');
    this.apiService.getCustomers().subscribe(
      (data: any) => {
        console.log('Customers loaded:', data);
        this.totalCustomers = data.total || data.length || 0;
      },
      (error: any) => {
        console.error('Error loading customers:', error);
      }
    );
  }
}
