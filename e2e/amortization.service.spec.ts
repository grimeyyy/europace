import { test, expect } from '@playwright/test';

test.describe('Amortization Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/calculator');
  });

  test('should generate a payment plan and display results', async ({ page }) => {
    await page.fill('input[name="loanAmount"]', '100000');
    await page.fill('input[name="interestRate"]', '2.12');
    await page.fill('input[name="initialRepayment"]', '2');
    await page.fill('input[name="fixedInterestYears"]', '10');

    await page.click('button.generate-plan');

    // Wait for rows to appear
    const rows = page.locator('.payment-plan-row');
    await expect(rows.first()).toBeVisible();

    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(1);

    // Optionally check values in first row
    const firstRowRestDebt = rows.nth(0).locator('.rest-debt');
    await expect(firstRowRestDebt).toBeVisible();

    // Check total summary row
    const totalRow = page.locator('.total-summary-row');
    const totalInterest = totalRow.locator('.total-interest');
    await expect(totalInterest).toBeVisible();
    const interestText = await totalInterest.textContent();
    expect(Number(interestText?.replace(/[^\d,.-]/g, '').replace(',', '.'))).toBeGreaterThan(0);
  });
});
