import { expect, test } from '@playwright/test';

test('park an item, see the countdown, and it persists', async ({ page }) => {
  await page.goto('/');
  const heading = page.getByRole('heading', { name: 'Sleep On It' });
  await expect(heading).toBeVisible();

  await page.getByLabel('What do you want to buy?').fill('Standing desk');
  await page.getByLabel('Price').fill('300');
  await page.getByRole('button', { name: 'Sleep on it' }).click();
  await expect(page.getByText('Standing desk')).toBeVisible();
  await expect(page.getByText(/sit with it/)).toBeVisible();

  await page.reload();
  await expect(page.getByText('Standing desk')).toBeVisible();
});

test('a ripe item can be let go (seeded over the hold)', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const past = Date.now() - 30 * 3600 * 1000;
    localStorage.setItem(
      'soi-v1',
      JSON.stringify({
        version: 1,
        settings: { holdHrs: 24, currency: '$', theme: 'calm', accent: '#4f9d8c' },
        items: [{ id: 'x', name: 'Gadget', price: 50, why: 'shiny', at: past }],
        kept: 0,
      }),
    );
  });
  await page.reload();
  await expect(page.getByText(/wait.?s over/)).toBeVisible();
  await page.getByRole('button', { name: 'Let it go' }).click();
  await expect(page.getByText(/50 not spent/)).toBeVisible();
});
