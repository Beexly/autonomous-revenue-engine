export const BUSINESS = {
  name: 'Atelier Catering Demo',
  phone: '555-0100',
  email: 'hello@example.com',
  instagram: '@ateliercateringdemo',
  address: '100 Market Street, Suite 200, Metro City, TX 78701',
};

export const asset = (name: string) => `${import.meta.env.BASE_URL}img/${name}`;

export const pick = (id: string) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('choose-table', { detail: id }));
  }
};

export const TABLES = [
  { id: 'holy', name: 'Holy Grail of Grazing', rateLabel: '$2,000 / 75 guests · $3,500 / 150 guests', description: 'The wedding table. Two sliders (50 of each), five cheeses, five meats, two salads, three dips, two hummus, two nuts, guacamole, pico de gallo, seasonal fruit and chips.' },
  { id: 'grand', name: 'Grand Graze', rate: 38, rateLabel: '$38 / person', description: 'Five sliders, four salads, three dips, two hummus, two nuts, chips and mini pudding cups: Oreo, butterscotch or banana.' },
  { id: 'super', name: 'Super Graze', rate: 30, rateLabel: '$30 / person', description: 'Three sliders (25 of each), three salads, three dips, two hummus, nuts, chips and a full vegetable spread.' },
  { id: 'standard', name: 'Grazing Standard', rate: 26, rateLabel: '$26 / person', description: 'The Graze Me spread, plus a second hummus, two dips, pasta salad, potato, sweet-potato and tortilla chips.' },
  { id: 'graze', name: 'Graze Me, Craze Me', rate: 24, rateLabel: '$24 / person', description: 'Two sliders (30 of each), meat and cheese, seasonal fruit, hummus, almonds, two salads, roasted and raw vegetables, and one dip.' },
] as const;

export const ADD_ONS = [
  { name: 'Taco Cart', price: '$26.95', unit: 'person' },
  { name: 'Charcuterie Carts', price: '$24.50', unit: 'person' },
  { name: 'Slider Menu · 11 choices', price: '$2.95', unit: 'each' },
  { name: 'Cakes and Shakes', price: '$9.50', unit: 'serving' },
  { name: 'Candy Bar Chick', price: '$5.00', unit: 'serving' },
  { name: 'Zeppole Beignet Chick', price: '$4.50', unit: 'serving' },
  { name: 'Bloody Mary Chick', price: '$6.50', unit: 'drink' },
  { name: 'Mimosa Chick', price: '$4.00', unit: 'drink' },
];

export const FAQ = [
  ['What are the grazing table terms?', 'Per-person grazing tables have a 50-guest minimum and include 90 minutes of service. Setup is $229. The estimate applies 18% tax to food plus setup. Extra time is $3 per person per 30 minutes. Holy Grail packages are published for 75 or 150 guests.'],
  ['Do you serve parties under 50 guests?', 'Yes. Ask about charcuterie carts, the taco cart, boards, sliders, sweets and sips. Carts arrive built; Our team confirms the service details and final quote.'],
  ['Where do you travel?', 'Downtown, Northside, Westlake and Metro Area. The cart travels up to 100 miles; ask our team about your venue and any travel charges.'],
  ['Does an enquiry hold my date?', 'No. An estimate or enquiry does not book an event or reserve a date. Our team confirms availability, menu and the final quote with you.'],
] as const;

export type Quote =
  | { kind: 'priced'; foodCents: number; setupCents: number; taxCents: number; totalCents: number }
  | { kind: 'custom'; note: string }
  | { kind: 'error'; error: string };

export const money = (cents: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);

export function computeQuote(tableId: string, guests: number): Quote {
  if (!Number.isSafeInteger(guests) || guests < 1 || guests > 1000) {
    return { kind: 'error', error: 'Enter a whole guest count between 1 and 1,000.' };
  }
  if (tableId === 'custom') {
    return { kind: 'custom', note: 'Boards, carts, sweets and sips are quoted to suit your gathering.' };
  }
  const table = TABLES.find(t => t.id === tableId);
  if (!table) return { kind: 'error', error: 'Choose a table or request a custom quote.' };
  if (tableId === 'holy' && guests !== 75 && guests !== 150) {
    return { kind: 'error', error: 'Holy Grail is published for 75 or 150 guests. Ask our team about custom sizing.' };
  }
  if (tableId !== 'holy' && guests < 50) {
    return { kind: 'error', error: 'Per-person grazing tables have a 50-guest minimum. Ask about a cart or boards for fewer guests.' };
  }
  const foodCents = table.id === 'holy' ? (guests === 75 ? 200000 : 350000) : table.rate * guests * 100;
  const setupCents = 22900;
  // Integer cents: round only the tax once, not each displayed dollar amount.
  const taxCents = Math.round((foodCents + setupCents) * 18 / 100);
  return { kind: 'priced', foodCents, setupCents, taxCents, totalCents: foodCents + setupCents + taxCents };
}

export type EnquiryDetails = {
  tableId: string; guests: number; name: string; occasion: string; date: string; venue: string; notes: string;
};

export function buildEnquiry(details: EnquiryDetails, quote: Quote): string {
  const table = TABLES.find(t => t.id === details.tableId)?.name ?? 'Carts, boards, sweets or sips';
  const lines = [
    'Hi there, I would like to plan a gathering with Atelier Catering Demo.',
    `Name: ${details.name.trim() || 'Not provided'}`,
    `Occasion: ${details.occasion}`,
    `Menu: ${table}`,
    `Guests requested: ${details.guests}`,
    `Date: ${details.date || 'To be decided'}`,
    `Venue: ${details.venue.trim() || 'To be decided'}`,
  ];
  if (details.notes.trim()) lines.push(`Notes / dietary requests: ${details.notes.trim()}`);
  if (quote.kind === 'priced') {
    lines.push(
      '',
      'Published estimate · 90 minutes of service:',
      `Food: ${money(quote.foodCents)}`,
      `Setup: ${money(quote.setupCents)}`,
      `Estimated tax (18% on food + setup): ${money(quote.taxCents)}`,
      `Total estimate: ${money(quote.totalCents)}`,
      'Extra time ($3/person per 30 minutes), add-ons and any travel charges are not included.',
    );
  } else {
    lines.push('', 'Please send a custom quote.', quote.kind === 'error' ? quote.error : quote.note);
  }
  lines.push('', 'Please confirm availability, menu, tax treatment and the final quote. This is an enquiry, not a booking or a date hold.');
  return lines.join('\n');
}