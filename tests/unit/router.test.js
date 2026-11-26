import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { parseRoute, formatRouteHash } from '../../js/core/router.js';

describe('router.js — parseRoute() v7.0 routes', () => {
  it('parses lesson hash and query deep-links (#u5/l6, ?u=5&l=6, #u5/l6@itemKey)', () => {
    assert.deepEqual(parseRoute('#u5/l6'), { view: 'lesson', unit: 5, lesson: 6 });
    assert.deepEqual(parseRoute('', '?u=5&l=6'), { view: 'lesson', unit: 5, lesson: 6 });
    assert.deepEqual(
      parseRoute('#u5/l6@S5L6_num_s5l6_w_1'),
      { view: 'lesson', unit: 5, lesson: 6, itemKey: 'S5L6_num_s5l6_w_1' }
    );
    assert.deepEqual(
      parseRoute('#u5/l6@S5L6_num_s5l6%3A1'),
      { view: 'lesson', unit: 5, lesson: 6, itemKey: 'S5L6_num_s5l6:1' }
    );
    assert.equal(formatRouteHash(5, 6, 'S5L6_num_1'), '#u5/l6@S5L6_num_1');

    // Unit bounds clamped to [1, 7]
    assert.deepEqual(parseRoute('#u9/l2'), { view: 'lesson', unit: 7, lesson: 2 });
  });

  it('parses Model Exam routes (#exam/vol1, #exam/u4, #exam/u5, #exam/u7)', () => {
    assert.deepEqual(parseRoute('#exam/vol1'), { view: 'exam', examId: 'vol1' });
    assert.deepEqual(parseRoute('#exam/u4'), { view: 'exam', examId: 'u4' });
    assert.deepEqual(parseRoute('#exam/u5'), { view: 'exam', examId: 'u5' });
    assert.deepEqual(parseRoute('#exam/u7'), { view: 'exam', examId: 'u7' });
    assert.equal(parseRoute('#exam/unknown'), null);
  });

  it('parses Mushaf Showcase (#mushaf-check) and Spiral Explorer (#spiral, #spiral/p3, #spiral/root/...)', () => {
    assert.deepEqual(parseRoute('#mushaf-check'), { view: 'mushaf-check' });
    assert.deepEqual(parseRoute('#spiral'), { view: 'spiral' });
    assert.deepEqual(parseRoute('#spiral/p3'), { view: 'spiral', pillar: 3 });
    assert.deepEqual(
      parseRoute('#spiral/root/%D8%B9%20%D8%A8%20%D8%AF'),
      { view: 'spiral', root: 'ع ب د' }
    );
  });

  it('parses modal shortcuts (#bookmarks, #favourites) and returns null for unknown routes', () => {
    assert.deepEqual(parseRoute('#bookmarks'), { view: 'bookmarks' });
    assert.deepEqual(parseRoute('#favourites'), { view: 'favourites' });
    assert.deepEqual(parseRoute('#favorites'), { view: 'favourites' });
    assert.equal(parseRoute(''), null);
    assert.equal(parseRoute('#nonexistent'), null);
  });
});
