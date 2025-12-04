import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  customers: any[] = [];
  private searchTimeout: any;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(search?: string): void {
    this.apiService.getCustomers(search).subscribe((data: any) => {
      this.customers = data.data || [];
    });
  }

  onSearch(event: any): void {
    clearTimeout(this.searchTimeout);
    const searchTerm = event.target.value;
    this.searchTimeout = setTimeout(() => {
      this.loadCustomers(searchTerm);
    }, 300);
  }
}
