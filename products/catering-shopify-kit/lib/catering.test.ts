import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildEnquiry, computeQuote } from './catering.ts';

test('Holy Grail 75: cent-accurate estimate, including tax on setup', () => {
  assert.deepEqual(computeQuote('holy', 75), { kind: 'priced', foodCents: 200000, setupCents: 22900, taxCents: 40122, totalCents: 263022 });
});
test('Holy Grail 150: the second published package', () => {
  assert.deepEqual(computeQuote('holy', 150), { kind: 'priced', foodCents: 350000, setupCents: 22900, taxCents: 67122, totalCents: 440022 });
});
for (const [id, rate] of [['graze', 24], ['standard', 26], ['super', 30], ['grand', 38]] as const) {
  test(`${id}: 50-guest minimum, every priced field agrees`, () => {
    assert.equal(computeQuote(id, 49).kind, 'error');
    const q = computeQuote(id, 50);
    assert.equal(q.kind, 'priced');
    if (q.kind === 'priced') {
      assert.equal(q.foodCents, rate * 50 * 100);
      assert.equal(q.taxCents, Math.round((q.foodCents + q.setupCents) * .18));
      assert.equal(q.totalCents, q.foodCents + q.setupCents + q.taxCents);
    }
  });
}
for (const n of [0, -1, 50.5, NaN, Infinity, 1001]) {
  test(`invalid numeric headcount ${n} is rejected`, () => assert.equal(computeQuote('super', n).kind, 'error'));
}
test('non-published Holy Grail sizes do not fabricate a price', () => {
  for (const n of [50, 74, 76, 80, 149, 151]) assert.equal(computeQuote('holy', n).kind, 'error');
});
test('unknown package is not silently treated as custom', () => assert.equal(computeQuote('unknown', 75).kind, 'error'));
test('carts and boards under fifty are a custom enquiry, not a zero-dollar item', () => assert.equal(computeQuote('custom', 20).kind, 'custom'));
test('enquiry includes current selections and cent-accurate receipt without claiming a booking', () => {
  const message = buildEnquiry({ tableId: 'holy', guests: 75, name: 'Alex', occasion: 'Wedding', date: '2026-12-05', venue: 'Spring', notes: 'Vegetarian options' }, computeQuote('holy', 75));
  for (const term of ['Alex', 'Wedding', '2026-12-05', 'Spring', 'Vegetarian options', '$401.22', '$2,630.22', 'not a booking']) assert.ok(message.includes(term));
});
test('Graze Me for 50 produces the approved $1,686.22 total', () => {
  assert.deepEqual(computeQuote('graze', 50), { kind: 'priced', foodCents: 120000, setupCents: 22900, taxCents: 25722, totalCents: 168622 });
});
test('every per-person package stays cent-accurate through the supported headcount range', () => {
  for (const [id, rate] of [['graze', 24], ['standard', 26], ['super', 30], ['grand', 38]] as const) {
    for (const guests of [51, 75, 100, 150, 333, 1000]) {
      const q = computeQuote(id, guests);
      assert.equal(q.kind, 'priced');
      if (q.kind === 'priced') assert.equal(q.totalCents, Math.round((rate * guests * 100 + 22900) * 118 / 100));
    }
  }
});
test('custom enquiries carry the requested date and guests without inventing a total', () => {
  const message = buildEnquiry({ tableId: 'custom', guests: 20, name: '', occasion: 'Celebration', date: '2026-12-20', venue: 'The Woodlands', notes: '' }, computeQuote('custom', 20));
  for (const term of ['Guests requested: 20', '2026-12-20', 'The Woodlands', 'custom quote']) assert.ok(message.includes(term));
  assert.equal(message.includes('Total estimate:'), false);
});