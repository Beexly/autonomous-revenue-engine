// Bookings calendar logic — shared by the Shopify section and node tests.
// Client rule (Oct 28 meeting notes): min 40 guests or $2,500; 7th + 28th of
// next month are pre-blocked. Dates are YYYY-MM-DD in America/Chicago.
export const MIN_GUESTS = 40;
export const MIN_SPEND_CENTS = 250000; // $2,500
export const TZ = 'America/Chicago';

export function nextMonthBlocks(now = new Date()) {
  // 7th and 28th of the following month relative to now (Chicago day).
  const day = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit' }).format(now);
  const [y, m] = day.split('-').map(Number);
  const nm = m === 12 ? 1 : m + 1;
  const ny = m === 12 ? y + 1 : y;
  const p = (n) => String(n).padStart(2, '0');
  return [`${ny}-${p(nm)}-07`, `${ny}-${p(nm)}-28`];
}

export function parseManual(input) {
  if (!input) return [];
  return input.split(/[,\s]+/).map((s) => s.trim()).filter((s) => /^\d{4}-\d{2}-\d{2}$/.test(s));
}

export function isBlocked(ymd, busy, manual, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd || '')) return true;
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(now);
  if (ymd < today) return true;
  const all = new Set([...(busy || []), ...(manual || []), ...nextMonthBlocks(now)]);
  return all.has(ymd);
}

export function meetsMinimum(guests, totalCents) {
  const g = Number(guests);
  if (Number.isFinite(g) && g >= MIN_GUESTS) return true;
  if (Number.isFinite(totalCents) && totalCents >= MIN_SPEND_CENTS) return true;
  return false;
}

// The public Booked_Dates tab. The catering team adds a row from a phone and the storefront calendar
// reads it on the next page load, with no redeploy and no admin access.
export const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1qKKyW3Awrpy4nUKfbbG7Q0xFzbC1-hcqxVLtYkYivds/gviz/tq?tqx=out:csv&sheet=Booked_Dates';

export const BOOKED_CONFIRMED = ['2026-12-02', '2026-12-19', '2027-02-20', '2027-03-20', '2027-04-18'];

// Column A is the date, column D the status. Only BOOKED rows count.
export function parseSheetBookedCsv(text) {
  var out = {};
  var lines = (text || '').split(String.fromCharCode(10));
  for (var n = 0; n < lines.length; n++) {
    var line = lines[n];
    if (!line.trim()) continue;
    var cols = [], cur = '', q = false;
    for (var i = 0; i < line.length; i++) {
      var c = line[i];
      if (q) {
        if (c === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else { q = false; } }
        else { cur += c; }
      } else if (c === '"') { q = true; }
      else if (c === ',') { cols.push(cur); cur = ''; }
      else { cur += c; }
    }
    cols.push(cur);
    var ymd = (cols[0] || '').trim();
    var status = (cols[3] || '').trim().toUpperCase();
    if (ymd.length !== 10 || ymd[4] !== '-' || ymd[7] !== '-') continue;
    if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(ymd) !== true) continue;
    if (status !== 'BOOKED') continue;
    out[ymd] = true;
  }
  return Object.keys(out).sort();
}
