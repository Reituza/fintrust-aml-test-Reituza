import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent {
  transaction = { customer_id: null, amount: null, destination_suburb: '' };
  successMessage = '';
  errorMessage = '';

  constructor(private apiService: ApiService) {}

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    this.apiService.createTransaction(this.transaction).subscribe(
      () => {
        this.successMessage = 'Transaction created successfully!';
        this.transaction = { customer_id: null, amount: null, destination_suburb: '' };
      },
      (error: any) => {
        this.errorMessage = error.error?.error || 'Failed to create transaction';
      }
    );
  }
}
