export const CARTS = {
  italian: {
    label: 'Italian Grazing Cart',
    tier: 'Sophisticated',
    declaredSelections: 16,
    priceCents: 1800,
    variantTitles: ['Italian Grazing Cart', 'Italian Grazing CART'],
    groups: [
      { key: 'cheeses', label: 'Cheeses', mode: 'included', items: ['Mozzarella', 'Provolone', 'Parmesan', 'Fontina', 'Fresh Mozzarella', 'Colby Jack'] },
      { key: 'meats', label: 'Meats', mode: 'included', items: ['Hard Salami', 'Pepperoni', 'Mortadella', 'Sopressata', 'Black Forest Ham'] },
      { key: 'crackers', label: 'Crackers', mode: 'included', items: ['Buttery Baguette', 'Pretzels', 'Water Crackers'] },
      { key: 'fruitVeg', label: 'Fruit / Veg', mode: 'choose', exact: 2, items: ['Roasted Vegetables', 'Cucumbers', 'Grapes', 'Strawberries'] },
      { key: 'nuts', label: 'Nuts', mode: 'included', items: ['Cashews'] },
      { key: 'supplements', label: 'Supplements', mode: 'choose', exact: 1, items: ['Calvestrano Olives', 'Artichoke Hearts'] },
      { key: 'spreads', label: 'Spreads', mode: 'included', items: ['Roasted Garlic Hummus', 'Everything Bagel Cream Cheese'] },
    ],
  },
  continental: {
    label: 'Continental Graze Cart',
    tier: 'Express',
    declaredSelections: 12,
    priceCents: 1600,
    variantTitles: ['Continental Graze Cart', 'Continental Graze CART'],
    groups: [
      { key: 'cheeses', label: 'Cheeses', mode: 'choose', exact: 4, items: ['Provolone', 'Smoked Cheddar', 'Swiss', 'Gruyere', 'Fontina'] },
      { key: 'meats', label: 'Meats', mode: 'included', items: ['Salami', 'Curry Turkey', 'Salami', 'Sopressata'] },
      { key: 'crackers', label: 'Crackers', mode: 'included', items: ['Water Crackers', 'Butter Crackers'] },
      { key: 'fruitVeg', label: 'Fruit / Veg', mode: 'included', items: ['Grapes', 'Strawberries', 'Cucumbers', 'Celery'] },
      { key: 'nuts', label: 'Nuts', mode: 'included', items: ['Almonds'] },
      { key: 'supplements', label: 'Supplements', mode: 'choose', exact: 1, items: ['Hummus (choice)', 'Giardinera'] },
      { key: 'dips', label: 'Dips', mode: 'included', items: ['Cold Spinach Dip', 'Marinated Mushrooms'] },
    ],
  },
  munch: {
    label: 'Munch Graze Cart',
    tier: 'Sophisticated',
    declaredSelections: 16,
    priceCents: 1500,
    variantTitles: ['Munch Graze Cart'],
    groups: [
      { key: 'cheeses', label: 'Cheeses', mode: 'included', items: ['Provolone', 'Mozzarella', 'Swiss', 'Colby Jack'] },
      { key: 'meats', label: 'Meats', mode: 'included', items: ['Pepperoni', 'Maple Glazed Ham', 'Tuscan Turkey', 'Salami'] },
      { key: 'crackers', label: 'Crackers', mode: 'included', items: ['Water Crackers', 'Pretzels'] },
      { key: 'fruitVeg', label: 'Fruit / Veg', mode: 'choose', exact: 1, items: ['Grapes', 'Strawberries', 'Roasted Vegetables', 'Celery'] },
      { key: 'nuts', label: 'Nuts', mode: 'included', items: ['Pecans'] },
      { key: 'supplements', label: 'Supplements', mode: 'included', items: ['Hummus (choice)', 'Sweet Tomatoes'] },
      { key: 'dips', label: 'Dips', mode: 'included', items: ['BLT Dip', 'Spinach and Vidalia Onion Dip'] },
    ],
  },
  european: {
    label: 'The European',
    tier: 'Choice',
    declaredSelections: 14,
    priceCents: 1300,
    variantTitles: ['The European', 'the european'],
    groups: [
      { key: 'cheeses', label: 'Cheeses', mode: 'included', items: ['Swiss', 'Gouda', 'Fontina', 'Smoked Provolone', 'Havarti Dill or Havarti'] },
      { key: 'meats', label: 'Meats', mode: 'included', items: ['Pepperoni', 'Curry Chicken', 'Blackened Chicken'] },
      { key: 'crackers', label: 'Crackers', mode: 'included', items: ['Club Crackers', 'Pita Crisps'] },
      { key: 'fruitVeg', label: 'Fruit / Veg', mode: 'choose', exact: 2, items: ['Grapes', 'Strawberries', 'Carrots', 'Celery'] },
      { key: 'nuts', label: 'Nuts', mode: 'included', items: ['Garlic Almonds'] },
      { key: 'supplements', label: 'Supplements', mode: 'included', items: ['Marinated Mushrooms', 'Gherkin Pickles'] },
      { key: 'dips', label: 'Dip', mode: 'included', items: ['Sweet Chili Hummus', 'Bacon and Caramelized Onion Cream Cheese'] },
    ],
  },
  texas: {
    label: 'The Texas Graze',
    tier: 'Sophisticated',
    declaredSelections: 16,
    priceCents: 1900,
    variantTitles: ['The Texas Graze', 'the Texas Graze'],
    groups: [
      { key: 'cheeses', label: 'Cheeses', mode: 'included', items: ['Pepper Jack', 'Smoked Cheddar', 'Smoked Gouda', 'Jalapeño Jack', 'Colby Jack'] },
      { key: 'meats', label: 'Meats', mode: 'included', items: ['Blackened Turkey', 'Hickory Smoked Ham', 'Honey Cured Ham', 'Cajun Turkey', 'Smoked Summer Sausage'] },
      { key: 'crackers', label: 'Crackers', mode: 'included', items: ['Tortilla Chips', 'Cajun Pita Crisps', 'Pretzels'] },
      { key: 'fruitVeg', label: 'Fruit / Veg', mode: 'choose', exact: 2, items: ['Tajin Mango', 'Grapes', 'Cucumbers', 'Peppers'] },
      { key: 'nuts', label: 'Nuts', mode: 'included', items: ['Maple Mesquite Walnuts'] },
      { key: 'supplements', label: 'Supplements', mode: 'included', items: ['Pico', 'Fiesta Shrimp Cocktail'] },
      { key: 'dips', label: 'Dips', mode: 'choose', exact: 1, items: ['Texas Trash', 'Guacamole'] },
    ],
  },
  cajun: {
    label: 'The Cajun Graze',
    tier: 'Sophisticated',
    declaredSelections: 16,
    priceCents: 1850,
    variantTitles: ['The Cajun Graze', 'the Cajun Graze'],
    groups: [
      { key: 'meats', label: 'Meats', mode: 'included', items: ['Blackened Turkey', 'Cracked Pepper Turkey', 'Peppered Salami', 'Blackened Ham', 'Chipotle Chicken Breast'] },
      { key: 'cheeses', label: 'Cheeses', mode: 'included', items: ['Cajun Herbed Goat Cheese', 'Smoked Gouda', 'Onion Cheddar', 'Gorgonzola', 'Havarti'] },
      { key: 'crackers', label: 'Crackers', mode: 'included', items: ['Blackened Tortilla Chips', 'Cajun Pita Crisps'] },
      { key: 'fruitVeg', label: 'Fruit', mode: 'choose', exact: 1, items: ['Tajin Melon', 'Grapes', 'Cucumber'] },
      { key: 'nuts', label: 'Nuts', mode: 'included', items: ['Cajun Peanuts'] },
      { key: 'supplements', label: 'Supplements', mode: 'choose', exact: 1, items: ['Giardinera', 'Jalapeño Cheddar Sausage'] },
      { key: 'dips', label: 'Dips', mode: 'included', items: ['Cold Crab Dip', 'Blackened Bacon & Vidalia Onion Cream Cheese'] },
    ],
  },
  spirited: {
    label: 'The Spirited Cart',
    tier: 'Express',
    declaredSelections: 12,
    priceCents: 1100,
    variantTitles: ['The Spirited Cart'],
    groups: [
      { key: 'meats', label: 'Meats', mode: 'included', items: ['Black Forest Ham', 'Peppered Turkey', 'Pepperoni'] },
      { key: 'cheeses', label: 'Cheeses', mode: 'included', items: ['Provolone', 'Fontina', 'Gouda', 'Havarti'] },
      { key: 'crackers', label: 'Crackers', mode: 'included', items: ['Butter Crackers', 'Tortilla Chips'] },
      { key: 'fruitVeg', label: 'Fruit', mode: 'included', items: ['Grapes'] },
      { key: 'nuts', label: 'Nuts', mode: 'included', items: ['Almonds'] },
      { key: 'supplements', label: 'Supplement', mode: 'included', items: ['Tajin Cucumber Slices'] },
      { key: 'dips', label: 'Dip', mode: 'included', items: ["House Roasted Corn Dip"] },
    ],
  },
  pancakeWaffle: {
    label: 'Pancake or Waffle Cart',
    tier: 'Express',
    declaredSelections: 12,
    priceCents: 2450,
    variantTitles: ['Pancake or Waffle Cart', 'the pancake or waffle cart'],
    baconAddon: true,
    groups: [
      { key: 'base', label: 'Choose Your Base', mode: 'choose', exact: 1, control: 'radio', items: ['Small Pancakes', '1/4 Waffles'] },
      { key: 'toppings', label: 'Toppings', mode: 'included', items: ['Sliced Bananas', 'Chocolate Chips'] },
      { key: 'sweetToppings', label: 'Sweet Toppings', mode: 'included', items: ['Nutella', 'Whipped Cream'] },
      { key: 'cookies', label: 'Cookie Topping', mode: 'included', items: ['Biscoff and Cookies'] },
      { key: 'fruit', label: 'Fruit', mode: 'included', items: ['Grapes', 'Strawberries'] },
      { key: 'spreads', label: 'Spreads / Dips', mode: 'included', items: ['Berry Compote', 'Strawberry Yogurt', 'Cream Cheese Fruit Dip'] },
      { key: 'finishing', label: 'Finishing', mode: 'included', items: ['Soft Butter', 'Maple Syrup'] },
    ],
  },
  brunch: {
    label: 'Brunch Spread',
    tier: 'Choice',
    declaredSelections: 14,
    priceCents: 2850,
    variantTitles: ['Brunch Spread'],
    groups: [
      { key: 'main', label: 'Main Items', mode: 'included', items: ['Canadian Bacon', 'Bagels and Mini Croissants', 'Fresh Thick-Cut Bacon'] },
      { key: 'eggStyle', label: 'Egg Style', mode: 'choose', exact: 1, control: 'radio', items: ['Mini Vegetable Frittatas', 'Hard-Boiled Eggs', 'Egg Salad'] },
      { key: 'extras', label: 'Extras', mode: 'included', items: ['Berry Compote', 'Candied Pecans'] },
      { key: 'fresh', label: 'Fresh Items', mode: 'included', items: ['Strawberries', 'Cucumber Sticks'] },
      { key: 'bakery', label: 'Bakery', mode: 'included', items: ['Biscuits', 'Mini Berry Muffins'] },
      { key: 'spreads', label: 'Spreads', mode: 'included', items: ['Soft Butter', 'Grape Jelly', 'Honey Almond Cream Cheese', 'Vegetable Cream Cheese'] },
    ],
  },
  enchilada: {
    label: 'The Whole Enchilada',
    tier: 'Choice',
    declaredSelections: 14,
    priceCents: 2850,
    variantTitles: ['The Whole Enchilada', 'The whole enchilada'],
    groups: [
      { key: 'tortillas', label: 'Tortillas', mode: 'included', items: ['Mini Tortillas'] },
      { key: 'proteins', label: 'Proteins', mode: 'included', items: ['Carnitas', 'Seasoned Ground Beef', 'Seasoned Ground Turkey'] },
      { key: 'sides', label: 'Sides', mode: 'included', items: ['Mexican Rice', 'Charro Beans'] },
      { key: 'fruitVeg', label: 'Fruit / Veg', mode: 'included', items: ['Strawberries', 'Mango with Tajin', 'Roasted Veggies'] },
      { key: 'condiments', label: 'Condiments', mode: 'included', items: ['Pico', 'Salsa', 'Sour Cream'] },
      { key: 'toppings', label: 'Toppings', mode: 'included', items: ['Shredded Cheese', 'Diced Tomatoes'] },
    ],
  },
};

export function normalizeTitle(value = '') {
  return String(value).trim().toLowerCase().replace(/\s+/g, ' ');
}

export function findVariantForCart(cartKey, variants = []) {
  const cart = CARTS[cartKey];
  if (!cart) return null;
  const aliases = new Set(cart.variantTitles.map(normalizeTitle));
  return variants.find((variant) => aliases.has(normalizeTitle(variant.title))) || null;
}

export function findVariantByTitle(title, variants = []) {
  const target = normalizeTitle(title);
  return variants.find((variant) => normalizeTitle(variant.title) === target) || null;
}

export function calculateTotalCents({ basePriceCents, guests, baconPriceCents = 0, baconSelected = false }) {
  const qty = Math.max(0, Number.parseInt(guests, 10) || 0);
  const base = Math.max(0, Number(basePriceCents) || 0) * qty;
  const addon = baconSelected ? Math.max(0, Number(baconPriceCents) || 0) * qty : 0;
  return base + addon;
}

export function validateSelections(cart, selections = {}) {
  const errors = {};
  if (!cart) return { valid: false, errors: { cart: 'Choose a cart package.' } };

  cart.groups.filter((group) => group.mode === 'choose').forEach((group) => {
    const chosen = Array.isArray(selections[group.key]) ? selections[group.key] : [];
    if (chosen.length !== group.exact) {
      errors[group.key] = group.exact === 1 ? 'Choose 1 option.' : `Choose exactly ${group.exact}.`;
    }
  });

  return { valid: Object.keys(errors).length === 0, errors };
}

export function getRequiredChoiceTotal(cart) {
  if (!cart) return 0;
  return cart.groups.reduce((sum, group) => sum + (group.mode === 'choose' ? group.exact : 0), 0);
}

export function getCompletedChoiceTotal(cart, selections = {}) {
  if (!cart) return 0;
  return cart.groups.reduce((sum, group) => {
    if (group.mode !== 'choose') return sum;
    const chosen = Array.isArray(selections[group.key]) ? selections[group.key] : [];
    return sum + Math.min(chosen.length, group.exact);
  }, 0);
}

export function buildMainProperties(cart, guests, selections = {}, builderGroup = '') {
  const properties = {
    'Cart Package': cart.label,
    'Tier': cart.tier,
    'Guest Count': String(guests),
    'Package Selection Count': String(cart.declaredSelections),
  };

  cart.groups.forEach((group) => {
    const values = group.mode === 'choose' ? (selections[group.key] || []) : group.items;
    if (values.length) properties[group.label] = values.join(', ');
  });

  if (builderGroup) properties['_Builder group'] = builderGroup;
  return properties;
}

export function buildCartItems({ mainVariantId, addonVariantId = null, guests, mainProperties = {}, baconSelected = false, addonProperties = {} }) {
  const quantity = Math.max(1, Number.parseInt(guests, 10) || 1);
  const items = [{ id: Number(mainVariantId), quantity, properties: mainProperties }];
  if (baconSelected && addonVariantId) {
    items.push({ id: Number(addonVariantId), quantity, properties: addonProperties });
  }
  return items;
}

export function formatMoney(cents, currency = 'USD', locale = 'en-US') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format((Number(cents) || 0) / 100);
}

if (typeof window !== 'undefined') {
  window.GrazeCartsCore = {
    CARTS,
    normalizeTitle,
    findVariantForCart,
    findVariantByTitle,
    calculateTotalCents,
    validateSelections,
    getRequiredChoiceTotal,
    getCompletedChoiceTotal,
    buildMainProperties,
    buildCartItems,
    formatMoney,
  };
}
