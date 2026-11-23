// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Attach console error and uncaught pageerror collectors to a Playwright page.
 * @param {import('@playwright/test').Page} page
 */
function trackPageErrors(page) {
  /** @type {string[]} */
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`);
  });
  page.on('pageerror', (err) => {
    errors.push(`pageerror: ${err.message}`);
  });
  return errors;
}

test.describe("Muallim ul-Qur'an v6.0 E2E Playtest Suite", () => {

  test('Flow 1: App boot & all 7 units load cleanly (RTL grids + grammar visual mount)', async ({ page }) => {
    const errors = trackPageErrors(page);

    await page.goto('./index.html');
    await expect(page).toHaveTitle(/Muallim/);
    await expect(page.locator('.lesson-banner-title')).toBeVisible();
    await expect(page.locator('dialog')).toHaveCount(5);

    // Verify all 7 units load cleanly with bidi grids and visual mount
    const unitChecks = [
      { hash: '#u1/l1', label: /Unit 1.*Lesson 1/ },
      { hash: '#u2/l1', label: /Unit 2.*Lesson 1/ },
      { hash: '#u3/l1', label: /Unit 3.*Lesson 1/ },
      { hash: '#u4/l1', label: /Unit 4.*Lesson 1/ },
      { hash: '#u5/l6', label: /Unit 5.*Lesson 6/ },
      { hash: '#u6/l1', label: /Unit 6.*Lesson 1/ },
      { hash: '#u7/l6', label: /Unit 7.*Lesson 6/ },
    ];

    for (const check of unitChecks) {
      await page.goto(`./index.html${check.hash}`);
      await expect(page.locator('#current-lesson-label')).toHaveText(check.label);
      await expect(page.locator('#lesson-content-mount .bidi-grid').first()).toBeVisible();
      await expect(page.locator('#grammar-visual-mount')).toBeAttached();
    }

    // Verify S7L6 3-column grid renders all 89 cards (35 original + 54 backfilled)
    await expect(page.locator('#lesson-content-mount .bidi-grid.cols-3 .vocab-card')).toHaveCount(89);

    // Verify S5L6 RTL order (first 4 cards)
    await page.goto('./index.html#u5/l6');
    await expect(page.locator('#current-lesson-label')).toHaveText(/Unit 5.*Lesson 6/);
    const firstCards = await page.evaluate(() => {
      const grids = Array.from(document.querySelectorAll('#lesson-content-mount .bidi-grid'));
      const g59 = grids.find((g) => g.querySelectorAll('.vocab-card').length === 59);
      return g59
        ? Array.from(g59.querySelectorAll('.vocab-card .arabic-text'))
            .slice(0, 4)
            .map((el) => (el.textContent || '').trim())
        : [];
    });
    expect(firstCards.length).toBe(4);
    expect(firstCards[0]).toContain('رَبّ');
    expect(firstCards[1]).toContain('حِسَاب');
    expect(firstCards[2]).toContain('ظُلْم');
    expect(firstCards[3]).toContain('لِبَاس');

    // Verify grammar visual actually mounts content on Unit 1 Lesson 12 (Harf-e-Atf)
    await page.goto('./index.html#u1/l12');
    await expect(page.locator('#grammar-visual-mount')).not.toBeEmpty();

    expect(errors).toEqual([]);
  });

  test('Flow 2: URL deep-linking (#u5/l6, ?u=5&l=6), back/forward history & Resume banner', async ({ page }) => {
    const errors = trackPageErrors(page);

    // Query param deep link normalizes to hash
    await page.goto('./index.html?u=5&l=6');
    await expect(page.locator('#current-lesson-label')).toHaveText(/Unit 5.*Lesson 6/);
    await expect.poll(() => page.evaluate(() => window.location.hash)).toBe('#u5/l6');

    // Navigate via next lesson button so history pushes #u5/l7
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#current-lesson-label')).toHaveText(/Unit 5.*Lesson 7/);
    await expect.poll(() => page.evaluate(() => window.location.hash)).toBe('#u5/l7');

    // Browser Back -> #u5/l6, Forward -> #u5/l7
    await page.goBack();
    await expect(page.locator('#current-lesson-label')).toHaveText(/Unit 5.*Lesson 6/);
    await page.goForward();
    await expect(page.locator('#current-lesson-label')).toHaveText(/Unit 5.*Lesson 7/);

    // Landing on bare URL shows Resume Where You Left Off banner for Unit 5 Lesson 7
    await page.goto('./index.html');
    const banner = page.locator('.resume-banner');
    await expect(banner).toBeVisible();
    await expect(banner).toContainText(/Unit 5.*Lesson 7/);

    // Clicking Resume jumps back to Unit 5 Lesson 7 and clears banner
    await page.locator('#btn-resume-go').click();
    await expect(page.locator('#current-lesson-label')).toHaveText(/Unit 5.*Lesson 7/);
    await expect(banner).toHaveCount(0);

    expect(errors).toEqual([]);
  });

  test('Flow 3: 3 calibrated reading themes (parchment, night, sepia) + legacy light/dark migration', async ({ page }) => {
    const errors = trackPageErrors(page);

    // Legacy 'dark' migrates to 'night' on boot
    await page.addInitScript(() => {
      if (!sessionStorage.getItem('theme_seeded')) {
        localStorage.setItem('muallim_theme', 'dark');
        sessionStorage.setItem('theme_seeded', '1');
      }
    });
    await page.goto('./index.html#u1/l1');
    await expect.poll(() => page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe('night');

    // Legacy 'light' migrates to 'parchment'
    await page.evaluate(() => localStorage.setItem('muallim_theme', 'light'));
    await page.reload();
    await expect.poll(() => page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe('parchment');

    // Switch through all 3 themes via Settings dialog
    await page.locator('#btn-open-settings').click();
    await expect(page.locator('#settings-dialog')).toBeVisible();

    for (const theme of ['night', 'sepia', 'parchment']) {
      await page.locator(`[data-set-theme="${theme}"]`).click();
      const active = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      expect(active).toBe(theme);
    }

    await page.locator('[data-close-dialog="settings-dialog"]').click();
    expect(errors).toEqual([]);
  });

  test('Flow 4: All 4 languages (hinglish, en, ur with dir="rtl", hi)', async ({ page }) => {
    const errors = trackPageErrors(page);

    await page.goto('./index.html#u5/l6');
    await expect(page.locator('.lesson-banner-title')).toBeVisible();

    await page.locator('#btn-open-settings').click();
    await expect(page.locator('#settings-dialog')).toBeVisible();

    const langOpts = await page.locator('#setting-lang-select option').evaluateAll((o) =>
      o.map((x) => /** @type {HTMLOptionElement} */ (x).value)
    );
    expect(langOpts).toEqual(['hinglish', 'en', 'ur', 'hi']);

    const firstGloss = page.locator('#lesson-content-mount .gloss-text').first();

    await page.locator('#setting-lang-select').selectOption('en');
    await expect(firstGloss).toHaveAttribute('dir', 'ltr');
    const enText = (await firstGloss.textContent()) || '';
    expect(enText.trim().length).toBeGreaterThan(0);

    await page.locator('#setting-lang-select').selectOption('ur');
    await expect(firstGloss).toHaveAttribute('dir', 'rtl');
    const urText = (await firstGloss.textContent()) || '';
    expect(/[\u0600-\u06FF]/.test(urText)).toBe(true);

    await page.locator('#setting-lang-select').selectOption('hi');
    await expect(firstGloss).toHaveAttribute('dir', 'ltr');
    const hiText = (await firstGloss.textContent()) || '';
    expect(/[\u0900-\u097F]/.test(hiText)).toBe(true);

    await page.locator('#setting-lang-select').selectOption('hinglish');
    await expect(firstGloss).toHaveAttribute('dir', 'ltr');

    await page.locator('[data-close-dialog="settings-dialog"]').click();
    expect(errors).toEqual([]);
  });

  test('Flow 5: Student Mode tap-to-peek & Space reveal with zero layout shift (CLS < 0.05)', async ({ page }) => {
    const errors = trackPageErrors(page);

    await page.goto('./index.html#u5/l6');
    await expect(page.locator('.lesson-banner-title')).toBeVisible();

    // Install PerformanceObserver for layout-shift before toggling Student Mode
    await page.evaluate(() => {
      /** @type {any} */ (window).__clsTotal = 0;
      if ('PerformanceObserver' in window) {
        const obs = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const ls = /** @type {any} */ (entry);
            if (!ls.hadRecentInput) {
              /** @type {any} */ (window).__clsTotal += ls.value || 0;
            }
          }
        });
        obs.observe({ type: 'layout-shift', buffered: false });
      }
    });

    await page.locator('#btn-header-mode').click();
    await expect.poll(() => page.evaluate(() => document.documentElement.getAttribute('data-mode'))).toBe('student');

    // Measure first card height before & after tap-to-peek
    const firstGloss = page.locator('#lesson-content-mount .gloss-box').first();
    const boxBefore = await firstGloss.boundingBox();
    await firstGloss.click();
    await expect(firstGloss).toHaveClass(/is-peeked/);
    const boxAfter = await firstGloss.boundingBox();
    expect(boxBefore && boxAfter ? Math.abs(boxAfter.height - boxBefore.height) : 0).toBeLessThanOrEqual(1);

    // Space reveals all glosses, second Space hides them
    await page.keyboard.press('Space');
    const allPeeked = await page.evaluate(() => {
      const boxes = Array.from(document.querySelectorAll('#lesson-content-mount .gloss-box'));
      return boxes.length > 0 && boxes.every((b) => b.classList.contains('is-peeked'));
    });
    expect(allPeeked).toBe(true);

    await page.keyboard.press('Space');
    const nonePeeked = await page.evaluate(() => {
      const boxes = Array.from(document.querySelectorAll('#lesson-content-mount .gloss-box'));
      return boxes.length > 0 && boxes.every((b) => !b.classList.contains('is-peeked'));
    });
    expect(nonePeeked).toBe(true);

    const cls = await page.evaluate(() => /** @type {any} */ (window).__clsTotal || 0);
    expect(cls).toBeLessThan(0.05);
    expect(errors).toEqual([]);
  });

  test('Flow 6: Daily study streak, lesson completion & unit mastery ring persist across reload', async ({ page }) => {
    const errors = trackPageErrors(page);

    await page.goto('./index.html#u5/l6');
    await expect(page.locator('#btn-toggle-complete')).toBeVisible();

    await page.locator('#btn-toggle-complete').click();
    await expect(page.locator('#streak-count-val')).toHaveText('1d');
    await expect(page.locator('#btn-toggle-complete')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.mastery-ring-sub').first()).toHaveText('1/23');

    await page.reload();
    await expect(page.locator('#streak-count-val')).toHaveText('1d');
    await expect(page.locator('#btn-toggle-complete')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.mastery-ring-sub').first()).toHaveText('1/23');

    expect(errors).toEqual([]);
  });

  test('Flow 7: Leitner 5-box SRS flashcard drill (flip + rating updates box counts)', async ({ page }) => {
    const errors = trackPageErrors(page);

    await page.goto('./index.html#u1/l1');
    await expect(page.locator('.lesson-banner-title')).toBeVisible();

    await page.locator('#btn-header-drill').click();
    await expect(page.locator('#drill-dialog')).toBeVisible();
    await expect(page.locator('.srs-box-cell')).toHaveCount(5);

    // Start Smart SRS Review
    await page.locator('#btn-start-srs').click();
    await expect(page.locator('#drill-card-surface')).toBeVisible();

    // Flip card using Reveal button / Space and rate 'Good' (+1 Box -> Box 2)
    await page.locator('#drill-reveal-btn').click();
    await expect(page.locator('.drill-gloss')).toBeVisible();
    await page.locator('[data-rate="good"]').click();

    // Return to Decks and verify Box 2 count is now 1
    await page.locator('#drill-end-btn').click();
    const boxCounts = await page.locator('.srs-box-num').allTextContents();
    expect(boxCounts.length).toBe(5);
    expect(Number(boxCounts[1])).toBeGreaterThanOrEqual(1);

    await page.locator('[data-close-dialog="drill-dialog"]').click();
    expect(errors).toEqual([]);
  });

  test('Flow 8: Units 5-7 interactive Root-and-Affix Morphology Builder drill', async ({ page }) => {
    const errors = trackPageErrors(page);

    for (const hash of ['#u5/l6', '#u6/l1', '#u7/l1']) {
      await page.goto(`./index.html${hash}`);
      await expect(page.locator('#btn-open-morph')).toBeVisible();
      await page.locator('#btn-open-morph').click();
      await expect(page.locator('#practice-dialog')).toBeVisible();
      await expect(page.locator('.morph-stage')).toBeVisible();
      await page.locator('#morph-check-btn').click();
      await expect(page.locator('.quiz-explanation')).toBeVisible();
      await page.locator('[data-close-dialog="practice-dialog"]').click();
    }

    expect(errors).toEqual([]);
  });

  test('Flow 9: Practice Quiz flow & scorecard rendering', async ({ page }) => {
    const errors = trackPageErrors(page);

    await page.goto('./index.html#u5/l6');
    await page.locator('#btn-open-practice').click();
    await expect(page.locator('#practice-dialog')).toBeVisible();

    for (let i = 0; i < 5; i++) {
      await page.locator('.quiz-option-btn').first().click();
      await page.locator('#quiz-next-btn').click();
    }
    await expect(page.locator('#quiz-scorecard-view')).toBeVisible();
    await expect(page.locator('#quiz-scorecard-view .scorecard-ring')).toBeVisible();

    await page.locator('[data-close-dialog="practice-dialog"]').click();
    expect(errors).toEqual([]);
  });

  test('Flow 10: Quick Search (/ shortcut + Esc close) & keyboard lesson navigation (ArrowLeft/ArrowRight)', async ({ page }) => {
    const errors = trackPageErrors(page);

    await page.goto('./index.html#u1/l2');
    await expect(page.locator('#current-lesson-label')).toHaveText(/Unit 1.*Lesson 2/);

    // '/' opens Quick Search
    await page.keyboard.press('/');
    await expect(page.locator('#search-dialog')).toBeVisible();
    await page.locator('#search-input').fill('kitab');
    await expect(page.locator('#search-results-mount .search-result-item').first()).toBeVisible();

    // Esc closes Quick Search
    await page.keyboard.press('Escape');
    await expect(page.locator('#search-dialog')).not.toBeVisible();

    // ArrowRight -> Unit 1 Lesson 3, ArrowLeft -> Unit 1 Lesson 2
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#current-lesson-label')).toHaveText(/Unit 1.*Lesson 3/);
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('#current-lesson-label')).toHaveText(/Unit 1.*Lesson 2/);

    expect(errors).toEqual([]);
  });

  test('Flow 11: Surah:Ayah citation badge + Qari audio request (everyayah.com) + offline Web Speech TTS fallback', async ({ page }) => {
    const errors = trackPageErrors(page);

    /** @type {string[]} */
    const qariUrls = [];
    // Intercept everyayah.com audio stream with an empty 200 so no browser net::ERR_FAILED is logged,
    // while Audio element decode error triggers the automatic Web Speech TTS fallback cleanly.
    await page.route('https://everyayah.com/**', async (route) => {
      qariUrls.push(route.request().url());
      await route.fulfill({
        status: 200,
        contentType: 'audio/mpeg',
        body: Buffer.alloc(0),
      });
    });

    // Spy on speechSynthesis.speak so we can verify TTS fallback without OS audio hardware
    await page.addInitScript(() => {
      /** @type {any} */ (window).__ttsCalls = [];
      if ('speechSynthesis' in window) {
        window.speechSynthesis.speak = (utterance) => {
          /** @type {any} */ (window).__ttsCalls.push({
            text: utterance.text,
            lang: utterance.lang,
          });
        };
      }
    });

    await page.goto('./index.html#u5/l1');
    const refBadge = page.locator('#lesson-content-mount .ref-badge-btn').first();
    await expect(refBadge).toBeVisible();
    await expect(refBadge).toHaveText(/\d+:\d+/);

    // 1. Clicking the normal speaker icon (🔊) uses browser Arabic TTS directly (does NOT call everyayah.com)
    const speakerBtn = refBadge.locator('xpath=ancestor::article').locator('[data-action="play-tts"]').first();
    await speakerBtn.click();
    await expect.poll(() => page.evaluate(() => /** @type {any} */ (window).__ttsCalls.length)).toBeGreaterThanOrEqual(1);
    expect(qariUrls.length).toBe(0);

    // 2. Clicking the Surah:Ayah citation badge requests Qari Mishary Alafasy MP3 from everyayah.com
    await refBadge.click();
    await expect.poll(() => qariUrls.length).toBeGreaterThanOrEqual(1);
    expect(qariUrls[0]).toMatch(/^https:\/\/everyayah\.com\/data\/Alafasy_128kbps\/\d{6}\.mp3$/);

    const ttsCall = await page.evaluate(() => /** @type {any} */ (window).__ttsCalls[0]);
    expect(ttsCall.lang).toBe('ar-SA');
    expect(ttsCall.text.length).toBeGreaterThan(0);

    expect(errors).toEqual([]);
  });

  test('Flow 12: Mobile 390x844 viewport has zero horizontal overflow & thumb-friendly bottom bar visible', async ({ page }) => {
    const errors = trackPageErrors(page);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./index.html#u5/l6');
    await expect(page.locator('.lesson-banner-title')).toBeVisible();

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.innerWidth);
    await expect(page.locator('.mobile-bottom-bar')).toBeVisible();
    await expect(page.locator('#mbar-prev')).toBeVisible();
    await expect(page.locator('#mbar-next')).toBeVisible();

    expect(errors).toEqual([]);
  });

  test('Flow 13: Service Worker muallim-v6.x cache registration & offline asset serving', async ({ page, context }) => {
    const errors = trackPageErrors(page);

    await page.goto('./index.html#u1/l1');
    await expect(page.locator('.lesson-banner-title')).toBeVisible();

    // Wait for SW registration & app-shell cache population
    await expect.poll(async () => {
      return await page.evaluate(async () => {
        if (!('serviceWorker' in navigator) || !('caches' in window)) return false;
        await navigator.serviceWorker.ready;
        const keys = await caches.keys();
        const v6Key = keys.find(k => /^muallim-v6\.\d+\.\d+-cache$/.test(k));
        if (!v6Key) return false;
        const cache = await caches.open(v6Key);
        const cachedIndex = await cache.match('./index.html');
        return Boolean(cachedIndex);
      });
    }, { timeout: 10000 }).toBe(true);

    // Reload once so the active SW controls the page and caches ./data/unit1.json on fetch
    await page.reload();
    await expect(page.locator('.lesson-banner-title')).toBeVisible();
    await expect.poll(async () => {
      return await page.evaluate(async () => {
        const keys = await caches.keys();
        const v6Key = keys.find(k => /^muallim-v6\.\d+\.\d+-cache$/.test(k));
        if (!v6Key) return false;
        const cache = await caches.open(v6Key);
        return Boolean(await cache.match('./data/unit1.json'));
      });
    }, { timeout: 10000 }).toBe(true);

    // Go offline and verify lesson & assets still render cleanly from SW cache
    await context.setOffline(true);
    await page.reload();
    await expect(page.locator('.lesson-banner-title')).toBeVisible();
    await expect(page.locator('#lesson-content-mount .vocab-card').first()).toBeVisible();
    await context.setOffline(false);

    expect(errors).toEqual([]);
  });

  test('Flow 15: U5L15 & U5L16 render hero markup and concept SVG without raw HTML + mobile SVG lightbox', async ({ page }) => {
    const errors = trackPageErrors(page);
    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto('./index.html#u5/l15');
    await expect(page.locator('.hero-arabic')).toBeVisible();
    const heroText = await page.locator('.hero-arabic').textContent();
    expect(heroText || '').not.toContain('<span');
    expect(await page.locator('.hero-arabic .arabic-root').count()).toBeGreaterThan(0);

    const ruleText = await page.locator('.rule-card').first().textContent();
    expect(ruleText || '').not.toContain('<svg');
    await expect(page.locator('.concept-svg-card svg').first()).toBeVisible();

    // Expand SVG lightbox and close cleanly
    await page.locator('[data-action="expand-svg"]').first().click();
    await expect(page.locator('#svg-lightbox-overlay svg')).toBeVisible();
    await page.locator('.svg-lightbox-close').click();
    await expect(page.locator('#svg-lightbox-overlay')).toHaveCount(0);

    // Zero horizontal page overflow at 390px
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
    expect(errors).toEqual([]);
  });

  test('Flow 14: Zero teacher/admin/ustaad/broadcast UI elements present', async ({ page }) => {
    const errors = trackPageErrors(page);

    await page.goto('./index.html#u1/l1');
    await expect(page.locator('.lesson-banner-title')).toBeVisible();

    const leaked = await page.evaluate(() => {
      const html = document.documentElement.innerHTML;
      const checks = [
        { name: 'teacher.html', hit: /teacher\.html/i.test(html) },
        { name: 'admin.html', hit: /admin\.html/i.test(html) },
        { name: 'ustaad', hit: /\bustaad\b/i.test(html) },
        { name: 'broadcast', hit: /\bbroadcast\b/i.test(html) },
        { name: 'grammar-visuals.js', hit: /grammar-visuals\.js/i.test(html) },
      ];
      return checks.filter((c) => c.hit).map((c) => c.name);
    });
    expect(leaked).toEqual([]);
    expect(errors).toEqual([]);
  });

});
