import { Injectable } from '@angular/core';
import {PaymentEntry} from '../interfaces/payment-entry.interface';
import {TranslateService} from '@ngx-translate/core';


@Injectable({
  providedIn: 'root',
})
export class AmortizationService {
  constructor(private translate: TranslateService) {
  }

  generatePlan(loanAmount: number, interestRate: number, initialRepayment: number, fixedInterestYears: number): PaymentEntry[] {
    const paymentPlan: PaymentEntry[] = [];

    // Convert annual interest and repayment rates from percentages to decimals
    const annualInterest = interestRate / 100;
    const annualRepayment = initialRepayment / 100;

    // Calculate monthly interest and repayment rates
    const monthlyInterestRate = annualInterest / 12;
    const monthlyRepaymentRate = annualRepayment / 12;

    // Calculate total monthly rate (interest + repayment)
    const monthlyRate = loanAmount * (monthlyInterestRate + monthlyRepaymentRate);

    // Calculate the total number of months in the fixed interest period
    const totalMonths = fixedInterestYears * 12;

    // Initialize the remaining debt with the full loan amount
    let remainingDebt = loanAmount;

    // Set the starting date to the end of the current month
    let currentDate = this.getEndOfMonth(new Date());

    // Push initial entry (starting point, with no payments made yet)
    paymentPlan.push({
      date: this.formatDate(currentDate),
      restDebt: loanAmount,
      interest: 0,
      repayment: Math.min(0, -loanAmount),
      rate: Math.min(0, -loanAmount),
    });

    // Generate a payment entry for each month in the fixed interest period
    for (let i = 1; i <= totalMonths && remainingDebt > 0; i++) {
      // Move to the end of the next month
      currentDate = this.getEndOfMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

      // Calculate interest for the current month
      const interest = remainingDebt * monthlyInterestRate;

      // The rest of the monthly payment goes toward repayment
      const repayment = monthlyRate - interest;

      // Subtract repayment from the remaining debt
      remainingDebt -= repayment;

      // Add the payment details for the current month to the plan
      paymentPlan.push({
        date: this.formatDate(currentDate),
        restDebt: Math.max(0, remainingDebt), // Ensure debt doesn't go below 0
        interest,
        repayment,
        rate: monthlyRate,
      });
    }
    // Calculate totals (skip first entry which is just initial state)
    const totals = paymentPlan.slice(1).reduce(
      (acc, entry) => {
        acc.interest += entry.interest;
        acc.repayment += entry.repayment;
        acc.rate += entry.rate;
        return acc;
      },
      {interest: 0, repayment: 0, rate: 0}
    );

    // Get the last remaining debt value
    const lastEntry = paymentPlan[paymentPlan.length - 1];

    // Add final summary row
    paymentPlan.push({
      date: this.translate.instant('TABLE.END_OF_RATE_FIXATION'),
      restDebt: lastEntry.restDebt,
      interest: totals.interest,
      repayment: totals.repayment,
      rate: totals.rate
    });

    return paymentPlan;
  }

  private getEndOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('de-DE');
  }
}
