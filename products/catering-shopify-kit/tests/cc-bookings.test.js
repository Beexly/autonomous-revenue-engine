import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MIN_GUESTS, MIN_SPEND_CENTS, nextMonthBlocks, parseManual, isBlocked, meetsMinimum, parseSheetBookedCsv, BOOKED_CONFIRMED } from '../assets/cc-bookings.js';

test('next month blocks are 7th and 28th', () => {
  assert.deepEqual(nextMonthBlocks(new Date('2026-11-08T12:00:00Z')), ['2026-12-07', '2026-12-28']);
  assert.deepEqual(nextMonthBlocks(new Date('2026-12-15T12:00:00Z')), ['2027-01-07', '2027-01-28']);
});

test('manual blocks parse comma-separated dates', () => {
  assert.deepEqual(parseManual('2026-12-07, 2026-12-28'), ['2026-12-07', '2026-12-28']);
  assert.deepEqual(parseManual(''), []);
});

test('blocked days: manual, api-busy, next-month defaults, past, bad format', () => {
  const now = new Date('2026-11-08T12:00:00Z');
  assert.equal(isBlocked('2026-12-07', [], [], now), true);
  assert.equal(isBlocked('2026-12-28', [], [], now), true);
  assert.equal(isBlocked('2026-11-20', ['2026-11-20'], [], now), true);
  assert.equal(isBlocked('2026-11-20', [], ['2026-11-20'], now), true);
  assert.equal(isBlocked('2026-12-09', [], [], now), false);
  assert.equal(isBlocked('2026-11-01', [], [], now), true); // past
  assert.equal(isBlocked('tomorrow', [], [], now), true);
});

test('minimum rule: 40 guests or $2,500', () => {
  assert.equal(MIN_GUESTS, 40);
  assert.equal(MIN_SPEND_CENTS, 250000);
  assert.equal(meetsMinimum(40, 0), true);
  assert.equal(meetsMinimum(39, 250000), true);
  assert.equal(meetsMinimum(39, 249999), false);
});

const NL = String.fromCharCode(10);
test('sheet rows marked BOOKED close the date, other statuses do not', () => {
  const csv = [
    '"Event Date (YYYY-MM-DD)","Display","Day","Availability Status"',
    '"2026-12-02","Dec 2, 2026","Wednesday","BOOKED"',
    '"2027-05-04","May 4, 2027","Tuesday","HOLD"',
  ].join(NL);
  assert.deepEqual(parseSheetBookedCsv(csv), ['2026-12-02']);
});

test('all five confirmed dates are carried by the widget fallback', () => {
  assert.equal(BOOKED_CONFIRMED.length, 5);
  for (const ymd of ['2026-12-02', '2026-12-19', '2027-02-20', '2027-03-20', '2027-04-18']) {
    assert.ok(BOOKED_CONFIRMED.includes(ymd), ymd + ' missing');
  }
});
