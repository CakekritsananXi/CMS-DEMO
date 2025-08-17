import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display main navigation', async ({ page }) => {
    // Check if navigation is visible
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Check if logo/brand is present
    await expect(page.locator('text=ContentFlow')).toBeVisible();
  });

  test('should navigate to all main pages', async ({ page }) => {
    const navigationItems = [
      { text: 'Dashboard', url: '/' },
      { text: 'Calendar', url: '/calendar' },
      { text: 'Ideation', url: '/ideation' },
      { text: 'Strategy', url: '/strategy' },
      { text: 'Library', url: '/library' },
      { text: 'Analytics', url: '/analytics' },
      { text: 'Team', url: '/collaboration' },
    ];

    for (const item of navigationItems) {
      await page.click(`text=${item.text}`);
      await expect(page).toHaveURL(item.url);
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Check if page content is loaded
      await expect(page.locator('h1')).toBeVisible();
    }
  });

  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if mobile menu button is visible
    const mobileMenuButton = page.locator('button[aria-label="Menu"]').or(
      page.locator('button:has-text("Menu")')
    ).or(
      page.locator('svg').first()
    );
    
    // If mobile menu exists, test it
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      
      // Check if navigation items are visible after clicking menu
      await expect(page.locator('text=Dashboard')).toBeVisible();
      await expect(page.locator('text=Calendar')).toBeVisible();
    }
  });

  test('should highlight active navigation item', async ({ page }) => {
    // Go to calendar page
    await page.click('text=Calendar');
    
    // Check if calendar nav item has active styling
    const calendarNav = page.locator('a[href="/calendar"]');
    await expect(calendarNav).toHaveClass(/active|bg-sage/);
  });
});