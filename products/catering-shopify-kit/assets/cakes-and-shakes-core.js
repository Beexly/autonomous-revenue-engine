(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.CakesShakesCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var PACKAGE_RULES = {
    'Package 1': { shakes: 2, cakes: 3 },
    'Package 2': { shakes: 3, cakes: 4 },
    'Package 3': { shakes: 3, cakes: 5 }
  };

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
  }

  function getPackageRules(packageName) {
    var rules = PACKAGE_RULES[packageName];
    return rules ? { shakes: rules.shakes, cakes: rules.cakes } : null;
  }

  function uniqueComplete(values, required) {
    if (!Array.isArray(values) || values.length !== required) return false;
    var cleaned = values.map(function (value) { return String(value || '').trim(); });
    if (cleaned.some(function (value) { return !value; })) return false;
    return new Set(cleaned.map(normalize)).size === required;
  }

  function isGlutenFreeEligible(choice) {
    return Boolean(choice && (choice.category === 'cheesecake' || choice.category === 'pie'));
  }

  function findVariant(variants, packageName, size) {
    var packageKey = normalize(packageName);
    var sizeKey = normalize(size);
    return (variants || []).find(function (variant) {
      var options = (variant.options || []).map(normalize);
      return options.indexOf(packageKey) !== -1 && options.indexOf(sizeKey) !== -1;
    }) || null;
  }

  function calculateTotals(input) {
    var quantity = Math.max(1, Number(input.quantity) || 1);
    var baseSubtotal = (Number(input.basePrice) || 0) * quantity;
    var glutenFreeSubtotal = (Number(input.glutenFreeCount) || 0) *
      (Number(input.glutenFreeUnitPrice) || 0) * quantity;
    var dessertSubtotal = (Number(input.dessertPrice) || 0) * quantity;
    return {
      baseSubtotal: baseSubtotal,
      glutenFreeSubtotal: glutenFreeSubtotal,
      dessertSubtotal: dessertSubtotal,
      total: baseSubtotal + glutenFreeSubtotal + dessertSubtotal
    };
  }

  function validateConfiguration(config) {
    var errors = [];
    var rules = getPackageRules(config.packageName);
    if (!rules) errors.push('Please select a package.');
    if (!config.size) errors.push('Please select a cup size.');
    if (rules && !uniqueComplete(config.shakes, rules.shakes)) {
      errors.push('Please select ' + rules.shakes + ' different Signature Shakes.');
    }
    if (rules && !uniqueComplete(config.cakes, rules.cakes)) {
      errors.push('Please select ' + rules.cakes + ' different cake or pie choices.');
    }
    if (!config.variant) errors.push('The selected package and cup size are unavailable.');
    return { valid: errors.length === 0, errors: errors };
  }

  return {
    PACKAGE_RULES: PACKAGE_RULES,
    normalize: normalize,
    getPackageRules: getPackageRules,
    uniqueComplete: uniqueComplete,
    isGlutenFreeEligible: isGlutenFreeEligible,
    findVariant: findVariant,
    calculateTotals: calculateTotals,
    validateConfiguration: validateConfiguration
  };
});
