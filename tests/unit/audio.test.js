import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { parseRefAudioList, parseRefAudio } from '../../js/core/audio.js';

describe('audio.js — parseRefAudioList()', () => {
  it('parses a single Surah:Ayah reference (2:255)', () => {
    const list = parseRefAudioList('2:255');
    assert.deepEqual(list, [
      {
        surah: 2,
        ayah: 255,
        label: '2:255',
        url: 'https://everyayah.com/data/Alafasy_128kbps/002255.mp3'
      }
    ]);
    assert.equal(parseRefAudio('2:255')?.url, 'https://everyayah.com/data/Alafasy_128kbps/002255.mp3');
  });

  it('expands ayah range references (50:12-13) and preserves range label on parseRefAudio', () => {
    const list = parseRefAudioList('50:12-13');
    assert.deepEqual(list, [
      {
        surah: 50,
        ayah: 12,
        label: '50:12',
        url: 'https://everyayah.com/data/Alafasy_128kbps/050012.mp3'
      },
      {
        surah: 50,
        ayah: 13,
        label: '50:13',
        url: 'https://everyayah.com/data/Alafasy_128kbps/050013.mp3'
      }
    ]);

    // En-dash range support
    const enDash = parseRefAudioList('19:1–3');
    assert.equal(enDash.length, 3);
    assert.equal(enDash[2].url, 'https://everyayah.com/data/Alafasy_128kbps/019003.mp3');

    const single = parseRefAudio('50:12-13');
    assert.equal(single?.label, '50:12-13');
    assert.equal(single?.url, 'https://everyayah.com/data/Alafasy_128kbps/050012.mp3');
  });

  it('parses semicolon multi-refs (2:39; 2:82) and mixed range+single lists', () => {
    const multi = parseRefAudioList('2:39; 2:82');
    assert.deepEqual(multi, [
      {
        surah: 2,
        ayah: 39,
        label: '2:39',
        url: 'https://everyayah.com/data/Alafasy_128kbps/002039.mp3'
      },
      {
        surah: 2,
        ayah: 82,
        label: '2:82',
        url: 'https://everyayah.com/data/Alafasy_128kbps/002082.mp3'
      }
    ]);

    const mixed = parseRefAudioList('1:1-2; 112:1');
    assert.equal(mixed.length, 3);
    assert.equal(mixed[0].label, '1:1');
    assert.equal(mixed[1].label, '1:2');
    assert.equal(mixed[2].url, 'https://everyayah.com/data/Alafasy_128kbps/112001.mp3');
  });

  it('rejects invalid, empty, or out-of-range surah references', () => {
    assert.deepEqual(parseRefAudioList(null), []);
    assert.deepEqual(parseRefAudioList(''), []);
    assert.deepEqual(parseRefAudioList('0:1'), []);
    assert.deepEqual(parseRefAudioList('115:1'), []);
    assert.deepEqual(parseRefAudioList('not-a-ref'), []);
  });
});
