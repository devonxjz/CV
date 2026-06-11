import { Page } from '@playwright/test';

/**
 * Inject GSAP test mode flag before page loads.
 * This disables lag smoothing and locks FPS for deterministic animation.
 */
export async function enableGsapTestMode(page: Page) {
  await page.addInitScript(() => {
    (window as typeof window & { __GSAP_TEST_MODE__?: boolean }).__GSAP_TEST_MODE__ = true;
  });
}

/**
 * Scroll to a specific Y position and wait for GSAP ticker to process.
 *
 * Why not page.mouse.wheel()? Because GSAP ScrollTrigger listens to
 * scroll events, not wheel events. scrollTo() fires the scroll event
 * that ScrollTrigger.update() needs.
 */
export async function scrollToPosition(page: Page, y: number) {
  await page.evaluate((scrollY) => {
    window.scrollTo({ top: scrollY, behavior: 'instant' });
  }, y);

  // 1. Ensure scroll alignment is reached first (so ScrollTrigger has events to process)
  await page.waitForFunction((targetY) => Math.abs(window.scrollY - targetY) < 2, y);

  // 2. Wait for GSAP ticker to process the scroll events in its next tick (prevents race condition)
  await page.evaluate(() => new Promise<void>(resolve => {
    const win = window as typeof window & { gsap?: { ticker: { add: (cb: () => void) => void; remove: (cb: () => void) => void } } };
    if (typeof win.gsap !== 'undefined') {
      const gsap = win.gsap;
      gsap.ticker.add(function once() {
        gsap.ticker.remove(once);
        resolve();
      });
    } else {
      requestAnimationFrame(() => resolve());
    }
  }));

  // 3. Ensure document readyState is complete
  await page.waitForFunction(() => document.readyState === 'complete');
}

/**
 * Get computed transform matrix from an element.
 * Returns 'none' or 'matrix(...)' string.
 */
export async function getTransform(page: Page, selector: string): Promise<string> {
  return page.locator(selector).evaluate(el => getComputedStyle(el).transform);
}
