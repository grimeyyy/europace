import {Component} from '@angular/core';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InfiniteScrollDirective} from 'ngx-infinite-scroll';
import {TranslateModule, TranslatePipe, TranslateService} from '@ngx-translate/core';
import {PaymentEntry} from '../interfaces/payment-entry.interface';
import {LoanFormValue} from '../interfaces/loan-form-value.interface';
import {AmortizationService} from '../services/amortization.service';


@Component({
  selector: 'app-calculator',
  imports: [NgIf, NgForOf, ReactiveFormsModule, InfiniteScrollDirective, TranslatePipe, NgStyle, TranslateModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent {
  loanForm: FormGroup;
  paymentPlan: PaymentEntry[] = [];

  visibleEntries: PaymentEntry[] = [];
  itemsPerLoad = 20;
  loadIndex = 0;

  constructor(private fb: FormBuilder, private amortizationService: AmortizationService) {
    // initialize the form with some example values
    this.loanForm = this.fb.nonNullable.group<LoanFormValue>({
      loanAmount: 100000,
      interestRate: 2.12,
      initialRepayment: 2,
      fixedInterestYears: 10
    });
  }

  generatePlan(): void {
    const {loanAmount, interestRate, initialRepayment, fixedInterestYears} = this.loanForm.value;

    // Call the AmortizationService to generate the plan
    this.paymentPlan = this.amortizationService.generatePlan(
      loanAmount,
      interestRate,
      initialRepayment,
      fixedInterestYears
    );

    this.resetVisibleEntries();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  }

  /**
   *  infinite scroll stuff
   */

  resetVisibleEntries(): void {
    this.visibleEntries = [];
    this.loadIndex = 0;
    this.loadMore();
  }

  loadMore(): void {
    const nextChunk = this.paymentPlan.slice(
      this.loadIndex,
      this.loadIndex + this.itemsPerLoad
    );
    this.visibleEntries = [...this.visibleEntries, ...nextChunk];
    this.loadIndex += this.itemsPerLoad;
  }
}
