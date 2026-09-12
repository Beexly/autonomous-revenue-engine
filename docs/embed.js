// SignPreview B2B Embed Widget
// Usage: <script src="embed.js" async></script>
// Or load via iframe with query params: shop, logo, color, leadto

(function () {
  'use strict';

  // Read query params from iframe URL or data attributes
  var params = {};
  try {
    var url = new URL(window.location.href);
    params.shop = url.searchParams.get('shop') || '';
    params.logo = url.searchParams.get('logo') || '';
    params.color = url.searchParams.get('color') || '#c2410c';
    params.leadto = url.searchParams.get('leadto') || '';
  } catch (e) {
    params.shop = '';
    params.logo = '';
    params.color = '#c2410c';
    params.leadto = '';
  }

  // If data attributes are set (for inline embedding), override query params
  var scriptEl = document.currentScript || document.querySelector('script[src*="embed.js"]');
  if (scriptEl) {
    if (scriptEl.getAttribute('data-shop')) params.shop = scriptEl.getAttribute('data-shop');
    if (scriptEl.getAttribute('data-logo')) params.logo = scriptEl.getAttribute('data-logo');
    if (scriptEl.getAttribute('data-color')) params.color = scriptEl.getAttribute('data-color');
    if (scriptEl.getAttribute('data-leadto')) params.leadto = scriptEl.getAttribute('data-leadto');
  }

  // Inject widget styles
  var style = document.createElement('style');
  style.textContent = `
    :root { --accent: ${params.color}; --accent-dark: ${params.color}dd; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1d130b; background: #f6efe0; line-height: 1.5; }
    .widget-wrap { max-width: 100%; padding: 16px; background: #fff; border-radius: 16px; box-shadow: 0 4px 20px rgba(29,19,11,.08); }
    .widget-head { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
    .widget-logo { width: 36px; height: 36px; border-radius: 8px; object-fit: contain; background: #fff; border: 1px solid #e2d3b4; padding: 2px; }
    .widget-shop { font-family: Georgia, serif; font-size: 16px; font-weight: 700; color: #1d130b; }
    .widget-field { margin-bottom: 12px; }
    .widget-field label { display: block; font-size: 11px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: #8a755a; margin-bottom: 6px; }
    .widget-field input[type=text] { width: 100%; font-size: 15px; padding: 10px 14px; border: 2px solid #e2d3b4; border-radius: 10px; font-family: Georgia, serif; background: #fdf6ec; color: #1d130b; outline: none; transition: border-color .2s; }
    .widget-field input[type=text]:focus { border-color: var(--accent); }
    .widget-pills { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
    .pill { border: 2px solid #e2d3b4; background: #fff; border-radius: 999px; padding: 7px 14px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all .18s; color: #6b5a44; }
    .pill:hover { border-color: var(--accent); }
    .pill.on { background: var(--accent); border-color: var(--accent); color: #fff; }
    .widget-go { margin: 12px 0; text-align: center; }
    .widget-go button { font-size: 15px; padding: 12px 28px; border: 0; border-radius: 999px; font-weight: 800; cursor: pointer; background: var(--accent); color: #fff; transition: transform .15s; }
    .widget-go button:active { transform: scale(.96); }
    .widget-result { display: none; text-align: center; margin-top: 14px; }
    .widget-result.show { display: block; }
    .widget-mock { border-radius: 12px; overflow: hidden; border: 1px solid #e2d3b4; background: #efe3cb; aspect-ratio: 4/3; display: flex; align-items: center; justify-content: center; min-height: 180px; position: relative; }
    .widget-mock canvas { width: 100%; height: 100%; }
    .widget-mock .loading { display: flex; flex-direction: column; gap: 8px; align-items: center; color: #8a755a; font-size: 13px; }
    .widget-mock .shimmer { width: 70%; height: 10px; border-radius: 999px; background: linear-gradient(90deg, #e2d3b4 25%, #fdf6ec 50%, #e2d3b4 75%); background-size: 200% 100%; animation: shim 1.4s linear infinite; }
    @keyframes shim { to { background-position: -200% 0; } }
    .widget-actions { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-top: 10px; }
    .widget-btn { display: inline-block; text-decoration: none; font-weight: 800; border-radius: 999px; padding: 10px 20px; font-size: 13px; border: 0; cursor: pointer; transition: transform .15s; }
    .widget-btn:active { transform: scale(.96); }
    .widget-btn-primary { background: var(--accent); color: #fff; }
    .widget-btn-ghost { background: transparent; border: 2px solid #e2d3b4; color: #1d130b; }
    .widget-note { margin-top: 10px; font-size: 12px; color: #8a755a; }
    .widget-lead-form { display: none; margin-top: 14px; padding: 14px; background: #fdf6ec; border-radius: 12px; border: 1px solid #e2d3b4; }
    .widget-lead-form.show { display: block; }
    .widget-lead-form input { width: 100%; font-size: 14px; padding: 10px 12px; border: 2px solid #e2d3b4; border-radius: 8px; margin-bottom: 8px; font-family: inherit; outline: none; }
    .widget-lead-form input:focus { border-color: var(--accent); }
    .widget-lead-form button { width: 100%; font-size: 14px; padding: 12px; border: 0; border-radius: 999px; font-weight: 800; cursor: pointer; background: var(--accent); color: #fff; }
    .widget-confirm { display: none; margin-top: 10px; color: #2d5a3c; font-weight: 700; font-size: 14px; text-align: center; }
    .widget-confirm.show { display: block; }
    @media (max-width: 360px) {
      .widget-wrap { padding: 10px; }
      .widget-shop { font-size: 14px; }
      .widget-mock { min-height: 140px; }
    }
  `;
  document.head.appendChild(style);

  // Render widget HTML
  var widgetHTML = `
    <div class="widget-wrap">
      <div class="widget-head">
        ${params.logo ? '<img class="widget-logo" src="' + params.logo + '" alt="' + params.shop + ' logo">' : ''}
        <span class="widget-shop">${params.shop || 'Sign Preview'}</span>
      </div>
      <div class="widget-field">
        <label for="widgetBiz">Business name</label>
        <input type="text" id="widgetBiz" placeholder="e.g. Atascocita Auto Spa" maxlength="40">
      </div>
      <div class="widget-pills" id="widgetPills">
        <button class="pill on" data-v="storefront">Storefront</button>
        <button class="pill" data-v="monument">Monument</button>
        <button class="pill" data-v="banner">Banner</button>
      </div>
      <div class="widget-go">
        <button id="widgetGen">Generate mockup</button>
      </div>
      <div class="widget-result" id="widgetResult">
        <div class="widget-mock" id="widgetMock">
          <div class="loading"><div class="shimmer"></div><span>Generating…</span></div>
          <canvas id="widgetCanvas" width="640" height="480" role="img" aria-label="Your sign mockup"></canvas>
        </div>
        <div class="widget-actions">
          <button class="widget-btn widget-btn-primary" id="widgetLead">Request this sign</button>
          <button class="widget-btn widget-btn-ghost" id="widgetAgain">Try another</button>
        </div>
        <p class="widget-note">Free mockup · $150 flat for the full design package</p>
      </div>
      <div class="widget-lead-form" id="widgetLeadForm">
        <input type="text" id="widgetLeadName" placeholder="Your name" required>
        <input type="text" id="widgetLeadEmail" placeholder="Email or phone" required>
        <button id="widgetLeadSubmit">Send request</button>
        <div class="widget-confirm" id="widgetConfirm">Thanks — we'll be in touch shortly.</div>
      </div>
    </div>
  `;

  document.body.innerHTML = widgetHTML;

  // Widget state
  var type = 'storefront';
  var canvas = document.getElementById('widgetCanvas');
  var ctx = canvas.getContext('2d');
  var mockEl = document.getElementById('widgetMock');
  var resultEl = document.getElementById('widgetResult');
  var leadFormEl = document.getElementById('widgetLeadForm');
  var confirmEl = document.getElementById('widgetConfirm');

  // Pill selection
  document.getElementById('widgetPills').addEventListener('click', function (e) {
    var b = e.target.closest('.pill');
    if (!b) return;
    document.querySelectorAll('#widgetPills .pill').forEach(function (p) { p.classList.remove('on'); });
    b.classList.add('on');
    type = b.dataset.v;
  });

  // Generate
  document.getElementById('widgetGen').addEventListener('click', generate);
  document.getElementById('widgetAgain').addEventListener('click', function () {
    resultEl.classList.remove('show');
    leadFormEl.classList.remove('show');
    confirmEl.classList.remove('show');
    mockEl.querySelector('.loading').style.display = '';
    mockEl.querySelector('canvas').style.display = 'none';
  });

  // Lead form
  document.getElementById('widgetLead').addEventListener('click', function () {
    leadFormEl.classList.toggle('show');
  });

  document.getElementById('widgetLeadSubmit').addEventListener('click', function (e) {
    e.preventDefault();
    var name = document.getElementById('widgetLeadName').value.trim();
    var email = document.getElementById('widgetLeadEmail').value.trim();
    var biz = document.getElementById('widgetBiz').value.trim();

    if (!name || !email || !biz) return;

    // POST to leadto endpoint or open mailto
    if (params.leadto) {
      fetch(params.leadto, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, contact: email, business_name: biz, source: 'embed' }),
      }).then(function () {
        showConfirm();
      }).catch(function () {
        openMailto(name, email, biz);
      });
    } else {
      openMailto(name, email, biz);
    }
  });

  function openMailto(name, email, biz) {
    var subject = 'Sign request: ' + biz;
    var body = 'Name: ' + name + '\nEmail: ' + email + '\nBusiness: ' + biz + '\n\nPlease send me a mockup for my business sign.';
    window.open('mailto:?' + encodeURIComponent('subject=' + subject + '&body=' + body), '_blank');
  }

  function showConfirm() {
    leadFormEl.classList.remove('show');
    confirmEl.classList.add('show');
    setTimeout(function () { confirmEl.classList.remove('show'); }, 3000);
  }

  // Generate mockup (simplified v2 approach)
  function generate() {
    var name = document.getElementById('widgetBiz').value.trim();
    if (!name) {
      document.getElementById('widgetBiz').focus();
      document.getElementById('widgetBiz').style.borderColor = '#c2410c';
      setTimeout(function () { document.getElementById('widgetBiz').style.borderColor = ''; }, 1600);
      return;
    }

    resultEl.classList.add('show');
    mockEl.querySelector('.loading').style.display = '';
    canvas.style.display = 'none';

    // Simple deterministic scene using canvas
    var W = canvas.width;
    var H = canvas.height;

    // Background gradient
    var grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#1a5c38');
    grad.addColorStop(1, '#0f3d25');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Sign panel
    var panelW = W * 0.6;
    var panelH = H * 0.3;
    var px = (W - panelW) / 2;
    var py = H * 0.35;

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = '#f2efe8';
    roundRect(ctx, px, py, panelW, panelH, 8);
    ctx.fill();
    ctx.restore();

    // Text
    ctx.fillStyle = '#1d130b';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold ' + Math.max(14, Math.min(32, panelW * 0.08)) + 'px Georgia, serif';
    ctx.fillText(name.toUpperCase(), W / 2, py + panelH / 2);

    mockEl.querySelector('.loading').style.display = 'none';
    canvas.style.display = 'block';
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // Expose params for debugging
  window.widgetParams = params;
})();
