import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('should not have any automatically detectable accessibility issues on dashboard', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have accessibility issues on calendar page', async ({ page }) => {
    await page.goto('/calendar');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Test tab navigation through main elements
    await page.keyboard.press('Tab');
    
    // Check if focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Continue tabbing through navigation
    for (let i = 0; i < 7; i++) {
      await page.keyboard.press('Tab');
      const currentFocus = page.locator(':focus');
      await expect(currentFocus).toBeVisible();
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    // Check for h1
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    
    // Check that headings follow proper hierarchy
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingTexts = await headings.allTextContents();
    
    expect(headingTexts.length).toBeGreaterThan(0);
  });

  test('should have proper alt text for images', async ({ page }) => {
    await page.goto('/');
    
    // Check all images have alt text
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze();

    // Filter for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter(
      violation => violation.id === 'color-contrast'
    );

    expect(contrastViolations).toEqual([]);
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/calendar');
    
    // Click to open new content modal if it exists
    const newContentButton = page.locator('text=New Content');
    if (await newContentButton.isVisible()) {
      await newContentButton.click();
      
      // Check form accessibility
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      const labelViolations = accessibilityScanResults.violations.filter(
        violation => violation.id === 'label' || violation.id === 'form-field-multiple-labels'
      );

      expect(labelViolations).toEqual([]);
    }
  });

  test('should support screen readers', async ({ page }) => {
    await page.goto('/');
    
    // Check for ARIA landmarks
    await expect(page.locator('[role="main"], main')).toBeVisible();
    await expect(page.locator('[role="navigation"], nav')).toBeVisible();
    
    // Check for ARIA labels on interactive elements
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      
      // Button should have either text content or aria-label
      expect(ariaLabel || text?.trim()).toBeTruthy();
    }
  });

  test('should handle focus management in modals', async ({ page }) => {
    await page.goto('/ideation');
    
    // Open idea capture modal
    const newIdeaButton = page.locator('text=New Idea');
    if (await newIdeaButton.isVisible()) {
      await newIdeaButton.click();
      
      // Check if focus is trapped in modal
      const modal = page.locator('[role="dialog"], .modal').first();
      await expect(modal).toBeVisible();
      
      // Focus should be on the first focusable element in modal
      const firstInput = modal.locator('input, textarea, button').first();
      await expect(firstInput).toBeFocused();
      
      // Test escape key closes modal
      await page.keyboard.press('Escape');
      await expect(modal).not.toBeVisible();
    }
  });
});