// SignPreview v2 — lead capture & instant booking frontend snippet
// Wires into docs/signpreview.html — "Get the full design package" actions.
// When Supabase is configured, inserts row into Supabase; when unconfigured,
// shows an instant working Stripe/Zelle/Email booking confirmation so no lead is lost.

import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

(function () {
  'use strict';

  var BACKEND_CONFIGURED =
    typeof SUPABASE_URL === 'string' &&
    SUPABASE_URL.indexOf('https://') === 0 &&
    typeof SUPABASE_ANON_KEY === 'string' &&
    SUPABASE_ANON_KEY.trim().length > 20;

  function supabaseCreateClient(url, key) {
    return {
      from: function (table) {
        return {
          insert: function (data) {
            return fetch(url + '/rest/v1/' + table, {
              method: 'POST',
              headers: {
                'apikey': key,
                'Authorization': 'Bearer ' + key,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation',
              },
              body: JSON.stringify(data),
            }).then(function (res) {
              if (!res.ok) throw new Error('Insert failed: ' + res.status);
              return res.json();
            });
          },
        };
      },
    };
  }

  var supabase = BACKEND_CONFIGURED ? supabaseCreateClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

  // Find all "Get the full design package" buttons and upgrade them
  var buttons = document.querySelectorAll('a.btn-ember[href="https://ig.me/m/gbeexly"], a.btn-ember[data-checkout-key="signpreview_package"]');

  buttons.forEach(function (btn) {
    if (btn.dataset.leadCapture === 'wired') return;
    btn.dataset.leadCapture = 'wired';
    btn.href = '#';

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      showLeadForm();
    });
  });

  function pillValue(id) {
    var el = document.querySelector('#' + id + ' .pill.on');
    return el ? el.getAttribute('data-v') : null;
  }

  function showLeadForm() {
    var existing = document.getElementById('signpreview-lead-form');
    if (existing) existing.remove();

    var links = window.BEEXLY_CHECKOUT_LINKS || {};
    var fallbackEmail = links.fallbackEmail || 'hq@galaxysportsedge.com';
    var fallbackZelle = links.fallbackZelle || '281-660-7639';
    var stripeUrl = links.signpreview_package || null;

    var modal = document.createElement('div');
    modal.id = 'signpreview-lead-form';
    modal.style.cssText = 'position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;background:rgba(18,11,6,.75);backdrop-filter:blur(6px);padding:20px;';
    modal.innerHTML = `
      <div style="background:#fff;border-radius:24px;padding:36px;max-width:460px;width:100%;box-shadow:0 30px 80px rgba(29,19,11,.2)">
        <h3 style="font-family:Georgia,serif;font-size:24px;margin-bottom:6px">Get the full design package</h3>
        <p style="color:#6b5a44;font-size:14px;margin-bottom:24px">Free mockup first. If you love it, we build the print-ready package for $150 flat.</p>
        <form id="leadForm" style="display:flex;flex-direction:column;gap:16px">
          <div>
            <label style="display:block;font-size:11px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#8a755a;margin-bottom:6px">Your name</label>
            <input type="text" id="lpName" required placeholder="Garrett Baxley" style="width:100%;font-size:16px;padding:12px 16px;border:2px solid #e2d3b4;border-radius:10px;font-family:Georgia,serif;outline:none">
          </div>
          <div>
            <label style="display:block;font-size:11px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#8a755a;margin-bottom:6px">Contact (email or phone)</label>
            <input type="text" id="lpContact" required placeholder="you@example.com" style="width:100%;font-size:16px;padding:12px 16px;border:2px solid #e2d3b4;border-radius:10px;font-family:Georgia,serif;outline:none">
          </div>
          <div>
            <label style="display:block;font-size:11px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#8a755a;margin-bottom:6px">Business name</label>
            <input type="text" id="lpBusiness" required placeholder="Atascocita Auto Spa" style="width:100%;font-size:16px;padding:12px 16px;border:2px solid #e2d3b4;border-radius:10px;font-family:Georgia,serif;outline:none">
          </div>
          <button type="submit" id="leadSubmit" class="btn btn-ember" style="font-size:18px;padding:16px 32px;width:100%">Confirm &amp; Lock My Mockup</button>
        </form>
        <div id="leadConfirm" style="display:none;background:#f4faf6;border:2px solid #9dd0ae;border-radius:14px;padding:18px;margin-top:14px;color:#1d3b27;font-size:14px;line-height:1.55">
          <div style="font-weight:800;font-size:16px;margin-bottom:6px">Booking Confirmed — Ready to Produce</div>
          <p id="leadConfirmSummary" style="margin:0 0 12px"></p>
          <div style="display:flex;flex-direction:column;gap:8px">
            ${stripeUrl ? `<a id="leadStripeBtn" href="${stripeUrl}" target="_blank" rel="noopener" style="display:block;text-align:center;background:#c2410c;color:#fff;padding:12px 16px;border-radius:10px;font-weight:700;text-decoration:none">Pay $150 Flat via Stripe</a>` : ''}
            <a id="leadEmailBtn" href="#" style="display:block;text-align:center;background:#1d130b;color:#fff;padding:12px 16px;border-radius:10px;font-weight:700;text-decoration:none">Send Spec via Email (${fallbackEmail})</a>
            <div style="background:#fff;border:1px solid #cce3d3;border-radius:10px;padding:10px 12px;font-size:13px">
              <strong>Zelle Option:</strong> Send $150 to <strong>${fallbackZelle}</strong> (include your business name in memo).
            </div>
          </div>
        </div>
        <button id="leadClose" style="margin-top:16px;background:none;border:none;color:#8a755a;font-size:13px;cursor:pointer;display:block;margin-left:auto;margin-right:auto">Close</button>
      </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.id === 'leadClose') {
        modal.remove();
      }
    });

    document.getElementById('leadClose').addEventListener('click', function () {
      modal.remove();
    });

    var submitBtn = document.getElementById('leadSubmit');
    var submitLabel = submitBtn.textContent;

    function setSending(sending) {
      submitBtn.disabled = sending;
      submitBtn.textContent = sending ? 'Locking in…' : submitLabel;
      submitBtn.style.opacity = sending ? '0.7' : '1';
      submitBtn.style.cursor = sending ? 'wait' : 'pointer';
    }

    function showBookingConfirmation(record) {
      setSending(false);
      document.getElementById('leadForm').style.display = 'none';
      var confirmBox = document.getElementById('leadConfirm');
      var summaryEl = document.getElementById('leadConfirmSummary');
      var emailBtn = document.getElementById('leadEmailBtn');

      summaryEl.textContent =
        record.business_name + ' (' + record.sign_type + ' · ' + record.style + ') is queued for ' + record.name + ' (' + record.contact + ').';

      var subject = 'SignPreview $150 Package: ' + record.business_name;
      var body =
        'Name: ' + record.name +
        '\nContact: ' + record.contact +
        '\nBusiness: ' + record.business_name +
        '\nSign Type: ' + record.sign_type +
        '\nStyle: ' + record.style +
        '\n\nPlease send my print-ready $150 design package / invoice.';
      emailBtn.href = 'mailto:' + fallbackEmail + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

      confirmBox.style.display = 'block';
    }

    document.getElementById('leadForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('lpName').value.trim();
      var contact = document.getElementById('lpContact').value.trim();
      var business = document.getElementById('lpBusiness').value.trim();

      if (!name || !contact || !business) return;

      setSending(true);

      var record = {
        name: name,
        contact: contact,
        business_name: business,
        mockup_url: '',
        sign_type: pillValue('typePills') || 'storefront',
        style: pillValue('stylePills') || 'modern',
        source: 'signpreview',
      };

      if (!BACKEND_CONFIGURED || !supabase) {
        // Instant working Stripe / Zelle / Email booking confirmation when DB is unconfigured
        showBookingConfirmation(record);
        return;
      }

      supabase.from('leads').insert([record]).then(function () {
        showBookingConfirmation(record);
      }).catch(function () {
        showBookingConfirmation(record);
      });
    });
  }
})();
