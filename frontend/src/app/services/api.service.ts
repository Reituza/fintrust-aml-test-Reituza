import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getCustomers(search?: string, page = 1, limit = 10): Observable<any> {
    let url = `${this.apiUrl}/customers?page=${page}&limit=${limit}`;
    if (search) url += `&search=${search}`;
    return this.http.get(url);
  }

  getCustomer(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/customers/${id}`);
  }

  getCustomerTransactions(customerId: number, page = 1, limit = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/customers/${customerId}/transactions?page=${page}&limit=${limit}`);
  }

  createTransaction(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/transactions`, data);
  }

  getAlerts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/alerts`);
  }
}
