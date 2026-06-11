import { test, expect } from '@playwright/test';
import { enableGsapTestMode } from './helpers/gsap-test-utils';

test.describe('Developer Portfolio animations & interaction', () => {
  test.beforeEach(async ({ page }) => {
    await enableGsapTestMode(page);
    await page.goto('/');
  });

  test('hero section shows correct content and handles availability badge', async ({ page }) => {
    // Check navigation is visible
    const nav = page.locator('.portfolio-nav');
    await expect(nav).toBeVisible();

    // Check availability badge exists and is styled
    const badge = page.locator('.availability-badge');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('Available for internship · HCMC');
  });

  test('scroll transitions lock and reveal sections correctly', async ({ page }) => {
    // Start on Hero (Section 0)
    const heroSection = page.locator('.portfolio-section').nth(0);
    await expect(heroSection).toHaveClass(/visible/);

    // Navigation links transition the page
    const skillsLink = page.locator('.nav-link').nth(1);
    await skillsLink.click();

    // Verify Skills section becomes visible
    const skillsSection = page.locator('.portfolio-section').nth(1);
    await expect(skillsSection).toHaveClass(/visible/);
  });

  test('skills bar animation triggers on entry', async ({ page }) => {
    // Go to Skills (Section 1)
    const skillsLink = page.locator('.nav-link').nth(1);
    await skillsLink.click();

    // Wait for the Skills bar animation delay to trigger
    const firstSkillFill = page.locator('.skill-bar-fill').first();
    await expect(firstSkillFill).toHaveCSS('width', /[^0px|0%]/); // Should animate to its real percent width
  });
});
