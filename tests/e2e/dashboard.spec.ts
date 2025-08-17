import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display dashboard content', async ({ page }) => {
    // Check main heading
    await expect(page.locator('h1')).toContainText('Good morning');
    
    // Check if stats cards are visible
    const statsCards = page.locator('[class*="grid"] > div').filter({
      has: page.locator('[class*="font-bold"]')
    });
    await expect(statsCards).toHaveCount(4);
    
    // Verify stats have numbers
    await expect(page.locator('text=23')).toBeVisible(); // Content Planned
    await expect(page.locator('text=47')).toBeVisible(); // Ideas Captured
    await expect(page.locator('text=89%')).toBeVisible(); // Goal Progress
    await expect(page.locator('text=+12%')).toBeVisible(); // Engagement
  });

  test('should display quick actions', async ({ page }) => {
    // Check Quick Actions section
    await expect(page.locator('text=Quick Actions')).toBeVisible();
    
    // Check if action buttons are present
    await expect(page.locator('text=New Content Idea')).toBeVisible();
    await expect(page.locator('text=Schedule Content')).toBeVisible();
    await expect(page.locator('text=Create Brief')).toBeVisible();
    await expect(page.locator('text=View Analytics')).toBeVisible();
  });

  test('should navigate from quick actions', async ({ page }) => {
    // Click on "Schedule Content" quick action
    await page.click('text=Schedule Content');
    
    // Should navigate to calendar page
    await expect(page).toHaveURL('/calendar');
    await expect(page.locator('h1')).toContainText('Editorial Calendar');
  });

  test('should display content pillars', async ({ page }) => {
    // Check Content Pillars section
    await expect(page.locator('text=Content Pillars')).toBeVisible();
    
    // Check if pillars are displayed with progress
    await expect(page.locator('text=Thought Leadership')).toBeVisible();
    await expect(page.locator('text=Product Education')).toBeVisible();
    await expect(page.locator('text=Industry Insights')).toBeVisible();
    await expect(page.locator('text=Community Building')).toBeVisible();
  });

  test('should display upcoming deadlines', async ({ page }) => {
    // Check Upcoming Deadlines section
    await expect(page.locator('text=Upcoming Deadlines')).toBeVisible();
    
    // Check if deadline items are present
    await expect(page.locator('text=LinkedIn Article')).toBeVisible();
    await expect(page.locator('text=Blog Post')).toBeVisible();
  });

  test('should display recent activity', async ({ page }) => {
    // Check Recent Activity section
    await expect(page.locator('text=Recent Activity')).toBeVisible();
    
    // Check if activity items are present
    await expect(page.locator('text=Created content brief')).toBeVisible();
    await expect(page.locator('text=Added new idea')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if content is still visible and properly arranged
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Quick Actions')).toBeVisible();
    
    // Stats should be in a mobile-friendly grid
    const statsCards = page.locator('[class*="grid"] > div').first();
    await expect(statsCards).toBeVisible();
  });

  test('should handle loading states', async ({ page }) => {
    // Intercept API calls to simulate loading
    await page.route('**/api/**', route => {
      // Delay the response to test loading states
      setTimeout(() => route.continue(), 1000);
    });
    
    await page.goto('/');
    
    // Check if page loads without errors
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  });
});