// @ts-check
import { test, expect } from '@playwright/test';

test.describe("Muallim ul-Qur'an v6.0 E2E Playtest Suite", () => {

  test('Flow 1: App loads offline-ready with exact 5 dialogs and zero console errors', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('./index.html');
    await expect(page).toHaveTitle(/Muallim/);
    await expect(page.locator('.lesson-banner-title')).toBeVisible();
    await expect(page.locator('dialog')).toHaveCount(5);
    expect(consoleErrors).toEqual([]);
  });

  test('Flow 2: 390px Mobile Viewport has zero horizontal overflow and bottom bar visible', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./index.html#u5/l6');
    await expect(page.locator('.lesson-banner-title')).toBeVisible();

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(390);
    await expect(page.locator('.mobile-bottom-bar')).toBeVisible();
  });

  test('Flow 3: Deep links (#u5/l6 and ?u=5&l=6) and S5L6 RTL order', async ({ page }) => {
    await page.goto('./index.html?u=5&l=6');
    await expect(page.locator('#current-lesson-label')).toHaveText(/Unit 5.*Lesson 6/);

    const firstCards = await page.evaluate(() => {
      const grids = Array.from(document.querySelectorAll('#lesson-content-mount .bidi-grid'));
      const g59 = grids.find(g => g.querySelectorAll('.vocab-card').length === 59);
      return g59 ? Array.from(g59.querySelectorAll('.vocab-card .arabic-text')).slice(0, 4).map(el => el.textContent.trim()) : [];
    });
    expect(firstCards.length).toBe(4);
    expect(firstCards[0]).toContain('رَبّ');
    expect(firstCards[1]).toContain('حِسَاب');
    expect(firstCards[2]).toContain('ظُلْم');
    expect(firstCards[3]).toContain('لِبَاس');
  });

  test('Flow 4: S7L6 3-column grid renders 35 cards', async ({ page }) => {
    await page.goto('./index.html#u7/l6');
    await expect(page.locator('#lesson-content-mount .bidi-grid.cols-3 .vocab-card')).toHaveCount(35);
  });

  test('Flow 5: 3 reading themes & 4 languages with Urdu RTL', async ({ page }) => {
    await page.goto('./index.html#u5/l6');
    await page.locator('#btn-open-settings').click();
    await expect(page.locator('#settings-dialog')).toBeVisible();

    for (const theme of ['night', 'sepia', 'parchment']) {
      await page.locator(`[data-set-theme="${theme}"]`).click();
      const active = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      expect(active).toBe(theme);
    }

    const langOpts = await page.locator('#setting-lang-select option').evaluateAll(o => o.map(x => x.value));
    expect(langOpts).toEqual(['hinglish', 'en', 'ur', 'hi']);
    await page.locator('#setting-lang-select').selectOption('ur');
    const dir = await page.locator('#lesson-content-mount .gloss-text').first().getAttribute('dir');
    expect(dir).toBe('rtl');
    await page.locator('[data-close-dialog="settings-dialog"]').click();
  });

  test('Flow 6: Student Mode tap-to-peek, streak & completion persist across reload', async ({ page }) => {
    await page.goto('./index.html#u5/l6');
    await page.locator('#btn-header-mode').click();
    const firstGloss = page.locator('#lesson-content-mount .gloss-box').first();
    await firstGloss.click();
    await expect(firstGloss).toHaveClass(/is-peeked/);

    await page.locator('#btn-toggle-complete').click();
    await expect(page.locator('#streak-count-val')).toHaveText('1d');
    await page.reload();
    await expect(page.locator('#streak-count-val')).toHaveText('1d');
    await expect(page.locator('#btn-toggle-complete')).toHaveAttribute('aria-pressed', 'true');
  });

  test('Flow 7: Practice Quiz scorecard & Morphology Builder on Unit 5', async ({ page }) => {
    await page.goto('./index.html#u5/l6');
    await page.locator('#btn-open-practice').click();
    await expect(page.locator('#practice-dialog')).toBeVisible();

    for (let i = 0; i < 5; i++) {
      await page.locator('.quiz-option-btn').first().click();
      await page.locator('#quiz-next-btn').click();
    }
    await expect(page.locator('#quiz-scorecard-view')).toBeVisible();

    await page.locator('#tab-practice-morph').click();
    await expect(page.locator('.morph-stage')).toBeVisible();
    await page.locator('#morph-check-btn').click();
    await expect(page.locator('.quiz-explanation')).toBeVisible();
  });

  test('Flow 8: Service Worker caches app shell in muallim-v6.0.0-cache', async ({ page }) => {
    await page.goto('./index.html');
    await page.waitForTimeout(800);
    const hasCache = await page.evaluate(async () => {
      if (!('caches' in window)) return false;
      const keys = await caches.keys();
      return keys.includes('muallim-v6.0.0-cache');
    });
    expect(hasCache).toBe(true);
  });

});
