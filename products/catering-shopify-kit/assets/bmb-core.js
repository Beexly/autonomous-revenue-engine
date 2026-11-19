(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.BMB = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function integer(value, fallback) {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : (fallback || 0);
  }

  function validateGuestCount(guestCount, minimum) {
    const guests = integer(guestCount);
    const min = integer(minimum);
    return guests >= min
      ? { valid: true, message: '' }
      : { valid: false, message: `Minimum ${min} guests are required for this tier.` };
  }

  function validateSelectionCount(label, selectedCount, requiredCount) {
    const selected = integer(selectedCount);
    const required = integer(requiredCount);
    return selected === required
      ? { valid: true, message: '' }
      : { valid: false, message: `Please select exactly ${required} ${label}.` };
  }

  function baseTotal(priceCents, guestCount) {
    return integer(priceCents) * integer(guestCount);
  }

  function addonQuantity(addon, guestCount) {
    if (!addon) return 0;
    const guests = integer(guestCount);
    if (addon.mode === 'per_guest') return guests;
    if (addon.mode === 'percentage') {
      return Math.ceil(guests * (Number(addon.percentage) || 0) / 100);
    }
    return Math.max(1, integer(addon.manualQuantity, 1));
  }

  function grandTotal(priceCents, guestCount, addons) {
    return baseTotal(priceCents, guestCount) + (addons || []).reduce((total, addon) => {
      if (!addon.selected) return total;
      return total + integer(addon.priceCents) * integer(addon.quantity);
    }, 0);
  }

  function groupId(prefix, timestamp, randomValue) {
    const safePrefix = String(prefix || 'builder').replace(/[^a-z0-9-]/gi, '-').toLowerCase();
    const random = String(Math.floor(Number(randomValue) * 100000)).padStart(5, '0');
    return `${safePrefix}-${integer(timestamp)}-${random}`;
  }

  function setButtonLoading(button, isLoading) {
    if (!button) return;
    const normal = button.querySelector('span:first-child');
    const loading = button.querySelector('[data-submit-loading]');
    button.disabled = Boolean(isLoading);
    if (normal) normal.hidden = Boolean(isLoading);
    if (loading) loading.hidden = !isLoading;
  }

  function renderCartOrRedirect(cartUi, result, cartUrl, locationObject) {
    const targetLocation = locationObject || (typeof window !== 'undefined' ? window.location : null);
    try {
      if (!cartUi || typeof cartUi.renderContents !== 'function' || !result || !result.sections) {
        throw new Error('Compatible Dawn cart renderer is unavailable.');
      }
      cartUi.renderContents(result);
    } catch (error) {
      if (targetLocation && typeof targetLocation.assign === 'function') {
        targetLocation.assign(cartUrl);
      }
    }
  }

  return {
    integer,
    validateGuestCount,
    validateSelectionCount,
    baseTotal,
    addonQuantity,
    grandTotal,
    groupId,
    setButtonLoading,
    renderCartOrRedirect
  };
});
