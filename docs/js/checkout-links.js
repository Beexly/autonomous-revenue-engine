// Centralized checkout & booking configuration for Beexly Autonomous Revenue Engine.
// Set any Stripe Payment Link URL when live; null falls back cleanly to email + Zelle.
(function (global) {
  'use strict';

  var LINKS = {
    // Core Kits & Tools
    kit_one_pager: null,         // $350 flat
    kit_full_site: null,         // $900 flat
    workflow_lead_catcher: null, // $250 setup
    workflow_review_engine: null,// $300 setup
    workflow_booking_flow: null, // $200 setup
    signpreview_package: null,   // $150 flat
    tx_contractor_pack: null,    // $29 SKU-02
    meta_tracking_workbook: 'https://signalorigin.gumroad.com/l/meta-tracking-audit-workbook',

    // 7 Prospect Previews (Track 1C)
    jd_precision: null,          // $199
    jcar_diecast: null,          // $199
    bff_bikes: null,             // $299
    durangos_boutique: null,     // $249
    nacho_padres: null,          // $950 turnkey
    nacho_padres_pilot: null,    // $299 pilot
    ccc_houston: null,           // $1,450 build
    alpha_paving: null,          // $950 bid-room

    // Fallbacks
    fallbackEmail: 'hq@galaxysportsedge.com',
    fallbackZelle: '281-660-7639',
    fallbackInstagram: 'https://ig.me/m/gbeexly'
  };

  global.BEEXLY_CHECKOUT_LINKS = LINKS;

  global.getBeexlyMailtoUrl = function (subject, body) {
    var email = LINKS.fallbackEmail || 'hq@galaxysportsedge.com';
    var params = [];
    if (subject) params.push('subject=' + encodeURIComponent(subject));
    if (body) params.push('body=' + encodeURIComponent(body));
    return 'mailto:' + email + (params.length ? '?' + params.join('&') : '');
  };

  global.getBeexlyCheckoutUrl = function (key, subject, body) {
    var url = LINKS[key];
    if (url && typeof url === 'string' && url.trim().length > 0) {
      return url;
    }
    return global.getBeexlyMailtoUrl(
      subject || ('Order / Booking: ' + key),
      body || ('Hi Garrett,\n\nI would like to book/claim: ' + key + '.\nPlease send the invoice or confirm Zelle (' + LINKS.fallbackZelle + ').\n\nThank you!')
    );
  };

  // Auto-wire any elements with [data-checkout-key]
  function wireCheckoutElements() {
    var els = document.querySelectorAll('[data-checkout-key]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var key = el.getAttribute('data-checkout-key');
      var subject = el.getAttribute('data-checkout-subject') || '';
      var body = el.getAttribute('data-checkout-body') || '';
      var resolved = global.getBeexlyCheckoutUrl(key, subject, body);
      el.setAttribute('href', resolved);
      if (LINKS[key]) {
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener');
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireCheckoutElements);
  } else {
    wireCheckoutElements();
  }
})(window);
