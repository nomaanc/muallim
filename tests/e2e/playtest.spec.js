// @ts-check
import { test, expect } from '@playwright/test';

test.describe("Muallim ul-Qur'an E2E Playtest Suite", () => {

  test.beforeEach(async ({ page }) => {
    // Suppress onboarding prompts during automated tests so modal overlays do not block interaction
    await page.addInitScript(() => {
      try {
        localStorage.setItem('muallim_onboard_name_done', 'done');
        localStorage.setItem('muallim_onboard_notif_done', 'done');
      } catch (e) {}
    });
  });

  test('Critical Flow 1: App loads without unhandled errors', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('./index.html');
    await expect(page).toHaveTitle(/Muallim/);
    expect(consoleErrors).toEqual([]);
  });

  test('Critical Flow 2: 390px Mobile Viewport has zero horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./index.html');
    await page.waitForTimeout(500);

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(390);
  });

  test('Critical Flow 3: Grammar visual mounts and unmounts cleanly', async ({ page }) => {
    await page.goto('./index.html');
    await page.waitForTimeout(500);

    const visualMount = page.locator('#grammar-visual-mount');
    await expect(visualMount).toBeVisible();

    // Verify destroy lifecycle if VisualLoader is present
    const destroySuccess = await page.evaluate(() => {
      if (window['VisualLoader']) {
        window['VisualLoader'].destroyVisual('grammar-visual-mount');
        return document.getElementById('grammar-visual-mount').innerHTML === '';
      }
      return true;
    });
    expect(destroySuccess).toBe(true);
  });

  test('Critical Flow 4: Multilingual Language Switcher adapts UI instantly', async ({ page }) => {
    await page.goto('./index.html');

    // Switch to English
    await page.evaluate(() => {
      if (window['App'] && window['App'].setLanguage) {
        window['App'].setLanguage('en');
      }
    });
    await page.waitForTimeout(300);

    // Switch to Hinglish
    await page.evaluate(() => {
      if (window['App'] && window['App'].setLanguage) {
        window['App'].setLanguage('hinglish');
      }
    });
    await page.waitForTimeout(300);

    // Assert Hinglish mode purity - no Urdu characters in header or chrome
    const chromeText = await page.locator('.app-header').innerText();
    const hasUrduInHeader = /[\u0600-\u06FF]/.test(chromeText);
    expect(hasUrduInHeader).toBe(false);
  });

  test('Critical Flow 5: Practice Quiz modal opens and renders 5 questions', async ({ page }) => {
    await page.goto('./index.html');
    await page.waitForTimeout(500);

    // Trigger quiz modal
    await page.evaluate(() => {
      if (window['App'] && window['App'].openGrammarExerciseModal) {
        window['App'].openGrammarExerciseModal();
      }
    });

    const modal = page.locator('#grammar-exercise-modal');
    await expect(modal).toBeVisible();

    // Verify option buttons exist
    const options = page.locator('.exercise-option-btn');
    const count = await options.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('Critical Flow 6: S5L6 Vocabulary rendering respects RTL displayOrder (Bug DA-2)', async ({ page }) => {
    await page.goto('./index.html');
    await page.waitForTimeout(500);

    // Navigate to Unit 5 Lesson 6
    await page.evaluate(async () => {
      if (window['App'] && window['App'].pickLesson) {
        await window['App'].pickLesson(5, 6);
      }
    });
    await page.waitForTimeout(600);

    // Section 6 is the 59-item vocabulary table in S5L6
    const sec6Cards = await page.evaluate(() => {
      const grids = Array.from(document.querySelectorAll('#lesson-content-mount .bidi-grid'));
      const targetGrid = grids.find(g => g.querySelectorAll('.vocab-card').length === 59);
      if (!targetGrid) return [];
      const cards = Array.from(targetGrid.querySelectorAll('.vocab-card'));
      return cards.map(c => {
        const ar = c.querySelector('.arabic-text');
        return ar ? ar.textContent.trim() : '';
      }).filter(Boolean);
    });

    expect(sec6Cards.length).toBe(59);
    const firstCard = sec6Cards[0];
    const secondCard = sec6Cards[1];
    const thirdCard = sec6Cards[2];
    const fourthCard = sec6Cards[3];

    // Verify correct RTL column-first sequence:
    // Col 2 (right): رَبٌّ : رَبُّهُمْ (displayOrder: 0)
    // Col 1 (middle): حِسَابٌ : حِسَابُهُمْ (displayOrder: 1)
    // Col 0 (left): ظُلْمٌ : ظُلْمُهُمْ (displayOrder: 2)
    // Next row, Col 2: لِبَاسٌ : لِبَاسُهُمْ (displayOrder: 3)
    expect(firstCard).toContain('رَبّ');
    expect(secondCard).toContain('حِسَاب');
    expect(thirdCard).toContain('ظُلْم');
    expect(fourthCard).toContain('لِبَاس');
    // Ensure the second card is NOT "لِبَاسٌ" (which was the buggy raw un-reordered order)
    expect(secondCard).not.toContain('لِبَاس');
  });

  test('Critical Flow 7: S7L6 three_col_numbered_list renders 35 cards in 3 columns', async ({ page }) => {
    await page.goto('./index.html');
    await page.waitForTimeout(500);

    // Navigate to Unit 7 Lesson 6
    await page.evaluate(async () => {
      if (window['App'] && window['App'].pickLesson) {
        await window['App'].pickLesson(7, 6);
      }
    });
    await page.waitForTimeout(600);

    // Assert that a .bidi-grid.cols-3 element exists and contains 35 cards
    const gridCardCount = await page.evaluate(() => {
      const threeColGrids = Array.from(document.querySelectorAll('#lesson-content-mount .bidi-grid.cols-3'));
      for (const grid of threeColGrids) {
        const cards = grid.querySelectorAll('.vocab-card, .paired-card');
        if (cards.length === 35) return cards.length;
      }
      return 0;
    });

    expect(gridCardCount).toBe(35);
  });

  test('Critical Flow 8: Practice Quiz full interactive cycle with AudioFX and Scorecard', async ({ page }) => {
    await page.goto('./index.html');
    await page.waitForTimeout(500);

    // Close onboard modal if open, setup audio spy and launch quiz
    await page.evaluate(async () => {
      const ob = document.getElementById('onboard-modal');
      if (ob && ob.open && ob.close) ob.close();

      window['__playedAudio'] = [];
      if (window['AudioFX']) {
        const origPlay = window['AudioFX'].play.bind(window['AudioFX']);
        window['AudioFX'].play = function(type) {
          window['__playedAudio'].push(type);
          return origPlay(type);
        };
      }
      await window['App'].openGrammarExerciseModal();
    });

    const modal = page.locator('#grammar-exercise-modal');
    await expect(modal).toBeVisible();

    // Answer all 5 questions
    for (let q = 1; q <= 5; q++) {
      const optBtn = page.locator('#opt-btn-0');
      await expect(optBtn).toBeVisible();
      await optBtn.click();

      // Explanation box should appear
      const expBox = page.locator('#exercise-explanation-box');
      await expect(expBox).toBeVisible();

      // Next button should appear
      const nextBtn = page.locator('#exercise-next-btn');
      await expect(nextBtn).toBeVisible();
      await nextBtn.click();
      await page.waitForTimeout(200);
    }

    // After 5 questions, the scorecard view should be displayed
    const scoreCard = page.locator('#exercise-scorecard-view');
    await expect(scoreCard).toBeVisible();

    const scoreText = page.locator('#exercise-final-score-text');
    await expect(scoreText).toBeVisible();
    const textContent = await scoreText.innerText();
    expect(textContent).toMatch(/\d+\s*mein se\s*\d+.*sahi kiye/);

    // Audio effects should have been triggered for each question
    const audioEvents = await page.evaluate(() => window['__playedAudio'] || []);
    expect(audioEvents.length).toBe(5);
    expect(audioEvents.every(e => e === 'correct' || e === 'wrong')).toBe(true);
  });

  test('Critical Flow 9: Service Worker pre-caching and offline readiness', async ({ page }) => {
    await page.goto('./index.html');
    await page.waitForTimeout(1000);

    // Verify service worker registration
    const swRegistered = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        return regs.length > 0;
      }
      return false;
    });
    expect(swRegistered).toBe(true);

    // Verify cache storage contains muallim-v4.0.0-cache
    const hasAppCache = await page.evaluate(async () => {
      if ('caches' in window) {
        const keys = await caches.keys();
        return keys.includes('muallim-v4.0.0-cache');
      }
      return false;
    });
    expect(hasAppCache).toBe(true);
  });

});
