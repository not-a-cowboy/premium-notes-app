import { test, expect } from '@playwright/test';

test('splash screen and home page interaction', async ({ page }) => {
    // 1. Visit page
    await page.goto('/');

    // 2. Splash screen should appear
    // Using explicit wait often better for long animations or just verify presence
    // Text "Jot It Down" is on splash
    await expect(page.getByText('Jot It Down')).toBeVisible();

    // 3. Wait for Notes to appear (Splash finishes)
    // Splash has ~3s delay + animation.
    await expect(page.getByText('Notes', { exact: true })).toBeVisible({ timeout: 15000 });

    // 4. Create new note
    await page.getByRole('button', { name: 'Add new note' }).click();

    // 5. Verify Editor URL
    await expect(page).toHaveURL(/\/new/);

    // 6. Type content
    await page.getByPlaceholder('Note Title').fill('E2E Test Note');
    await page.getByPlaceholder('Start writing...').fill('This is an E2E test.');

    // 7. Click Save & Close
    await page.getByRole('button', { name: 'Save & Close' }).click();

    // 8. Verify back on home
    await expect(page.getByText('Notes', { exact: true })).toBeVisible();

    // 9. Verify note is in list
    await expect(page.getByText('E2E Test Note')).toBeVisible();
});
