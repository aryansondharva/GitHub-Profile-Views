import assert from 'node:assert/strict';
import test from 'node:test';

import {
  BadgeImageRendererService,
  formatNumber,
  normalizeBadgeStyle
} from '../src/badgeImageRendererService.js';
import { Count } from '../src/count.js';
import { Username } from '../src/username.js';

test('normalizes valid GitHub usernames', () => {
  assert.equal(new Username('Aryan-Sondharva').toString(), 'aryan-sondharva');
});

test('rejects invalid GitHub usernames', () => {
  assert.throws(() => new Username('-aryan'), /cannot begin or end/);
  assert.throws(() => new Username('aryan--sondharva'), /single hyphens/);
});

test('formats full and abbreviated counts', () => {
  assert.equal(formatNumber(1234567890n, false), '1,234,567,890');
  assert.equal(formatNumber(12345n, true), '12.3K');
});

test('adds base counts', () => {
  assert.equal(new Count(40n).plus(Count.ofString('2')).toString(), '42');
});

test('falls back to flat style for unknown badge styles', () => {
  assert.equal(normalizeBadgeStyle('unknown'), 'flat');
});

test('renders escaped SVG text', () => {
  const renderer = new BadgeImageRendererService();
  const svg = renderer.renderBadgeWithError('A&B', '<bad>', 'flat');

  assert.match(svg, /A&amp;B/);
  assert.match(svg, /&lt;bad&gt;/);
});
