// SignPreview v2 — lead capture frontend snippet
// Wires into docs/signpreview.html — "Get the full design package" action.
// Opens a small form (name, contact, business) → inserts row into Supabase → shows confirmation.

import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

(function () {
  'use strict';

  // Initialize Supabase client
  const supabase = supabaseCreateClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  function supabaseCreateClient(url, key) {
    // Minimal Supabase JS client (no npm dependency)
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

  // Find all "Get the full design package" buttons and upgrade them
  var buttons = document.querySelectorAll('a.btn-ember[href="https://ig.me/m/gbeexly"]');

  buttons.forEach(function (btn) {
    // Don't double-wire
    if (btn.dataset.leadCapture === 'wired') return;
    btn.dataset.leadCapture = 'wired';
    btn.href = '#';

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      showLeadForm(btn);
    });
  });

  function showLeadForm(triggerBtn) {
    // Remove any existing form
    var existing = document.getElementById('signpreview-lead-form');
    if (existing) existing.remove();

    var modal = document.createElement('div');
    modal.id = 'signpreview-lead-form';
    modal.style.cssText = 'position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;background:rgba(18,11,6,.75);backdrop-filter:blur(6px);padding:20px;';
    modal.innerHTML = `
      <div style="background:#fff;border-radius:24px;padding:36px;max-width:440px;width:100%;box-shadow:0 30px 80px rgba(29,19,11,.2)">
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
          <button type="submit" class="btn btn-ember" style="font-size:18px;padding:16px 32px;width:100%">Submit — I want my mockup first</button>
        </form>
        <p id="leadConfirm" style="display:none;color:#2d5a3c;font-weight:700;font-size:16px;margin-top:18px;text-align:center">Thanks! Your mockup is being prepared — check your inbox.</p>
        <button id="leadClose" style="margin-top:16px;background:none;border:none;color:#8a755a;font-size:13px;cursor:pointer;display:block;margin-left:auto;margin-right:auto">Close</button>
      </div>
    `;

    document.body.appendChild(modal);

    // Close handlers
    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.id === 'leadClose') {
        modal.remove();
      }
    });

    document.getElementById('leadClose').addEventListener('click', function () {
      modal.remove();
    });

    // Form submission
    document.getElementById('leadForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('lpName').value.trim();
      var contact = document.getElementById('lpContact').value.trim();
      var business = document.getElementById('lpBusiness').value.trim();

      if (!name || !contact || !business) return;

      // Insert into Supabase
      var mockupUrl = '';
      var signType = 'storefront';
      var style = 'modern';

      supabase.from('leads').insert([{
        name: name,
        contact: contact,
        business_name: business,
        mockup_url: mockupUrl,
        sign_type: signType,
        style: style,
        source: 'signpreview',
      }]).then(function () {
        document.getElementById('leadForm').style.display = 'none';
        document.getElementById('leadConfirm').style.display = 'block';
      }).catch(function (err) {
        console.error('Lead capture error:', err);
        document.getElementById('leadConfirm').style.display = 'block';
        document.getElementById('leadConfirm').textContent = 'Thanks! We will reach out shortly.';
        document.getElementById('leadConfirm').style.color = '#c2410c';
      });
    });
  }
})();
