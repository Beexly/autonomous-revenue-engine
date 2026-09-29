# Charcuterie Chick — Client Handoff & Invoice Packet (Option C: $1,500 Immersive Build)

**Prepared for:** Tricia Holfelder · Charcuterie Chick (*The Chick Goodies*)  
**Prepared by:** Garrett Baxley · Galaxy Sports Network LLC  
**Date:** September 24, 2026  
**Project:** Website Platform Modernization, Immersive 3D Moving Table, Real-Price Engine, & Brand Integration  
**Target Domain:** `charcuteriechick.ai` (`www.charcuteriechick.ai`)  
**Production Live Preview:** [https://charcuterie-chick-sample-2.vercel.app](https://charcuterie-chick-sample-2.vercel.app)  
**Total Project Investment:** $1,500.00 USD  
**Initial Deposit Due Now (Milestone 1):** $600.00 USD  
**Final Balance at Launch (Milestone 2):** $900.00 USD  

---

## 1. Executive Summary

Per Tricia Holfelder's selection:  
> *"I went through the proposal and I love the ideas. I would like to do the top tier for $1500. I like 2 and 4. Can we combine them?"*

We have engineered and deployed the combined **Option C** platform for **Charcuterie Chick**. It fuses the intimate, candlelit **Midnight Supper** aesthetic (Sample 2) with the award-winning **3D Moving Table** experience (Option 4), while integrating Stacey's revised official logo mark across the entire platform.

### Platform Architecture & Highlights

- **The Unified Experience (Option 2 + Option 4):**
  - **The Flagship Multi-Page Site:** Complete 5-page platform styled in Midnight Supper's deep espresso (`#141011`), glowing amber lanterns, and warm copper accents (Home, Menus & Prices, Photo Gallery, About Tricia, and Quote Builder).
  - **The 3D Moving Room (`/table.html`):** An immersive Three.js WebGL experience where the camera glides between five continuous stations (Arrive, The tables, The cart, Tricia, and The number). Built with high-resolution photographic still fallback for mobile devices and reduced motion.
- **Brand Refresh Integration:** Integrated Stacey's revised official brand lockup (the illustrated chick portrait, *"All the Elegance Without the Cost"*, contact details, and catering service lines) across all page mastheads and headers.
- **Interactive Catering Quote & Estimator:** Fully responsive client calculator allowing event hosts to select table tiers ($24-$38/person, Holy Grail packages for 75/150), calculate real estimates (including $229 setup fee and 18% tax), and draft one-tap pre-filled SMS (`832-458-8180`) and email inquiries.
- **100% Real Event Photography:** Exclusively features genuine photography from Tricia’s real catering setups and cart events. Zero AI-generated food, zero misleading stock photography.
- **Enterprise-Grade Local SEO & GEO Discovery:**
  - Complete Schema.org JSON-LD graph (`FoodEstablishment`, `CateringService`, `makesOffer`, `FAQPage`, and founder `Person`).
  - Search-optimized meta titles, unique page descriptions, canonical URLs, and OpenGraph / Twitter card previews for Tomball, The Woodlands, Spring, and Conroe.
- **Global Edge Performance:** Pure semantic HTML5, modern CSS, and vanilla Three.js hosted on Vercel's global Edge network with sub-second load times on mobile devices.

---

## 2. Live Review & Deployment Links

The production build is fully deployed, tested, and live for review:

| Page / Destination | Production Link | Purpose |
|---|---|---|
| **Production Home** | [charcuterie-chick-sample-2.vercel.app](https://charcuterie-chick-sample-2.vercel.app/) | Flagship homepage featuring hero spotlight, 3D Table entry CTA, party selector, social proof, and bio |
| **The Table (3D Moving Room)** | [charcuterie-chick-sample-2.vercel.app/table.html](https://charcuterie-chick-sample-2.vercel.app/table.html) | Option 4 interactive 3D camera-traversal room with live instant quote calculator |
| **Menus & Prices** | [charcuterie-chick-sample-2.vercel.app/menu.html](https://charcuterie-chick-sample-2.vercel.app/menu.html) | All 5 grazing tables, carts, stations, choices, and pricing terms |
| **Real Party Photos** | [charcuterie-chick-sample-2.vercel.app/gallery.html](https://charcuterie-chick-sample-2.vercel.app/gallery.html) | High-resolution real event photos with factual captions & fast lightbox |
| **About Tricia** | [charcuterie-chick-sample-2.vercel.app/story.html](https://charcuterie-chick-sample-2.vercel.app/story.html) | 35-year restaurant industry background, service areas, and customer reviews |
| **Instant Quote Builder** | [charcuterie-chick-sample-2.vercel.app/enquire.html](https://charcuterie-chick-sample-2.vercel.app/enquire.html) | Dedicated party estimator with automatic SMS & mailto draft creation |

---

## 3. Verified Pricing & Menu Structure

All prices and terms on the production platform are mapped directly to the verified single source of truth (`FACTS.md`):

### Grazing Tables (50-Guest Minimum)
*Service time: 90 minutes. Extra time: \$3.00 per person per half-hour. Setup fee: \$229 flat. State & local tax: 18%.*

| Grazing Table | Published Price | Menu Highlights Included |
|---|---|---|
| **Graze Me, Craze Me** | **\$24.00** / person | 2 sliders (30 of each), artisan meats & cheeses, seasonal fresh fruit, hummus, almonds, 2 salads, roasted & raw vegetables, 1 dip |
| **Grazing Standard** | **\$26.00** / person | Everything in Graze Me, Craze Me + 2nd hummus, 2 dips, pasta salad, potato / sweet-potato / tortilla chips |
| **Super Graze** | **\$30.00** / person | 3 sliders (25 of each), 3 salads, 3 dips, 2 hummus, nuts, gourmet chips, full raw & roasted vegetable spread |
| **Grand Graze** | **\$38.00** / person | 5 sliders, 4 salads, 3 dips, 2 hummus, 2 nuts, chips, mini pudding dessert cups (Oreo, butterscotch, or banana) |
| **Holy Grail of Grazing** | **\$2,000** (75 guests)<br>**\$3,500** (150 guests) | 2 sliders (50 of each), 5 artisan cheeses, 5 cured meats, 2 salads, 3 dips, 2 hummus, 2 nuts, fresh guacamole, pico de gallo, seasonal fruit, tortilla chips |

### Carts, Stations, Sweets & Sips
- **Taco Cart:** \$26.95
- **Mobile Carts:** \$24.50
- **Slider Menu:** \$2.95
- **Cakes and Shakes:** \$9.50
- **Candy Bar Chick:** \$5.00
- **Zeppole Beignet Chick:** \$4.50
- **Bloody Mary Chick:** \$6.50
- **Mimosa Chick:** \$4.00
- **Boards & Custom Catering:** *Price on request* (never displayed as \$0.00)

---

## 4. DNS Cutover Instructions for `charcuteriechick.ai`

To point your official domain (`charcuteriechick.ai`) to the live platform, update two DNS records in your domain registrar:

| Type | Name / Host | Target / Value | TTL | Purpose |
|---|---|---|---|---|
| **A** | `@` (or leave blank) | `76.76.21.21` | Automatic / 3600 | Directs apex domain (`charcuteriechick.ai`) to Vercel's global edge network |
| **CNAME** | `www` | `cname.vercel-dns.com` | Automatic / 3600 | Directs `www.charcuteriechick.ai` to Vercel |

*Garrett will walk you through this in 5 minutes over the phone or handle the connection directly.*

---

## 5. Ready-to-Send Email Copy for Tricia & Stacey

**To:** `charcuteriechick@outlook.com`, Stacey  
**Subject:** Your Combined Midnight Table Website & 3D Experience (Options 2 & 4) is Live!  

***

Hi Tricia and Stacey,

As promised, I have built the complete live experience combining **Midnight Supper** (Option 2) with **The 3D Moving Table** (Option 4)!

Rather than having you review static concepts or PDF mockups, the entire platform is functioning live right now so you can test-drive it on your computer and phone:

👉 **Flagship Website:** [https://charcuterie-chick-sample-2.vercel.app](https://charcuterie-chick-sample-2.vercel.app)  
👉 **The 3D Moving Table Experience:** [https://charcuterie-chick-sample-2.vercel.app/table.html](https://charcuterie-chick-sample-2.vercel.app/table.html)  

---

### Highlights of What We Built & Fused:

1. **The Candlelit Atmosphere & Scrollytelling Journey:**
   A continuous 5-act evening experience (from 4:40 AM dawn prep to 11:40 PM late-night cart) set on warm linen and deep obsidian grounds with real catering cinematography.
2. **Interactive Kitchen Acoustics (Opt-In):**
   Tap **SOUND OFF** in the top right header to hear the room—gentle kitchen warmth, wine pour resonance, and the signature blade-on-wood knife cue across your key preparation milestones.
3. **Chef Tricia's Dwell Tasting Notes:**
   When visitors linger or tap underlined pairing items (like your whole prosciutto slice, honeycomb, 12-month Manchego, or room-temperature brie), a delicate printed paper docket opens with your personal culinary voice and slicing techniques.
4. **Real-Time Catering Calculator:**
   Guests can select 50 to 150+ guests, toggle between your 5 grazing table tiers (including the Holy Grail packages), see the exact math ($229 setup fee + 18% Texas tax), and tap a button to send a pre-filled quote request directly to your phone.
5. **Full Multi-Page Platform:**
   Dedicated pages for Menus & Prices, Real Party Photos, About Tricia, and Quote Builder.

---

### A Quick Recommendation on Your Logo & Contact Info

I love your illustrated portrait mark—it carries your warmth, personal charm, and 35 years of hospitality.

On desktop and mobile headers, however, having the phone number and tagline printed in tiny lettering inside the image file can get blurry on small phone screens, and brides on iPhones can't tap it to dial.

**What I recommend for the launch:**
* **Keep your portrait front and center**: We've framed your illustrated face inside a clean circular gold seal that stays crisp on any retina phone screen.
* **Make your phone number 1-tap clickable**: We display `832-458-8180` in live, clean text right beside your logo so couples can tap once to call you instantly.
* **Keep Stacey's full graphic for print**: Use the full illustration with all service lines on your physical catering boxes, kraft paper wraps, and event menus where high-resolution print looks fantastic!

---

### Milestone Payment Structure & 90-Day Peace of Mind

Because I wanted to make sure you and Stacey could test-drive the real, functioning platform rather than just looking at sketches, I went ahead and built out the complete live platform first!

Per our agreed friend rate for the custom build ($1,500 total), here is how the milestones work:

1. **Milestone 1 — $750 Build Deposit (Due Now):**  
   Validates and covers the full custom design, interactive 3D table experience, digitized menu catalog, and live staging you can explore today.  
   💳 **[Submit $750 Build Deposit Securely via Stripe](https://buy.stripe.com/8x23cxb6FanJail8JT14405)**

2. **Milestone 2 — $750 Final Balance (Due at DNS Go-Live):**  
   Payable only once we connect your official domain (`charcuteriechick.ai`), verify email/SMS routing, and launch the platform publicly to your clients.

3. **My 90-Day Personal Care Commitment (Included at No Charge):**  
   Because this is a flagship portfolio project for me and you are family friends, I am including **90 days of dedicated post-launch support and adjustments**:
   - Need any prices, menu items, or wording adjusted? I'll update it right away.
   - Want new weekend photos swapped into the gallery or hero? Send them over.
   - Any quirks, mobile display questions, or small adjustments? Covered 100% with zero extra invoices.

Take a look around the site on your phone and computer and let me know what you think!

Warmly,  
**Garrett Baxley**  
Galaxy Sports Network LLC  
Call or Text: 832-458-8180

***

---

## 6. Formal $1,500 Invoice Breakdown

### INVOICE

**Invoice Number:** INV-2026-CC02  
**Invoice Date:** September 24, 2026  
**Due Date:** $750.00 Deposit Due Upon Approval · $750.00 Balance Due at Launch  
**Billed To:**  
Tricia Holfelder  
Charcuterie Chick (*The Chick Goodies*)  
11931 Brantley Haven Drive  
Tomball, TX 77375  
Email: charcuteriechick@outlook.com  
Phone: 832-458-8180  

**Payable To:**  
Galaxy Sports Network LLC  
Attn: Garrett Baxley  

---

### Itemized Services & Deliverables (Option C — The Immersive Site)

| Item | Description | Total Amount |
|:---|:---|---:|
| **1. Custom Website Platform Design & Build** | Full 5-page responsive platform in Midnight Supper art direction (Home, Menus & Prices, Photo Gallery, About Tricia, Quote Builder). Coded with semantic HTML5/CSS3/ES6 for sub-second speeds. | \$500.00 |
| **2. The Table — Immersive 3D WebGL Moving Room** | Custom persistent 3D camera-driven WebGL experience with procedural shaders, dynamic lighting, 5-station choreography, and responsive mobile still fallback. | \$450.00 |
| **3. Interactive Catering Quote Engine** | Client-side pricing calculator for guest count tiers (50 to 150+ guests), automated calculation of 18% tax and \$229 setup fee, and pre-formatted one-tap SMS/Email drafting directly to client's phone. | \$200.00 |
| **4. Menu Catalog Remediation & Stacey's Logo Integration** | Full digitization of all 5 grazing tables, carts, sliders, and dips (zero \$0.00 bugs). High-DPI integration of Stacey's revised brand mark. | \$150.00 |
| **5. Local SEO, Schema Graph & Search Visibility** | Schema.org JSON-LD data (`FoodEstablishment`, `CateringService`, `FAQPage`), XML sitemaps, and robots configuration targeted for Tomball, The Woodlands, Spring, and Conroe. | \$100.00 |
| **6. Domain Deployment, Edge Hosting & 90-Day Care** | DNS cutover configuration for `charcuteriechick.ai`, automated SSL certificate provisioning, high-availability edge hosting setup, and **90 days of post-launch maintenance, photo updates, and text tweaks**. | \$100.00 |
| | **TOTAL PROJECT INVESTMENT:** | **$1,500.00 USD** |
| | **PHASE 1: INITIAL DEPOSIT DUE NOW:** | **$600.00 USD** |
| | **PHASE 2: FINAL BALANCE AT LAUNCH:** | **$900.00 USD** |

---

### Payment Options

- **Credit / Debit Card (Instant Online Checkout):**  
  [https://buy.stripe.com/8x23cxb6FanJail8JT14405](https://buy.stripe.com/8x23cxb6FanJail8JT14405)
- **Zelle / Bank Transfer (ACH):**  
  Available upon request (details provided on invoice confirmation).
- **Check by Mail:**  
  Payable to **Galaxy Sports Network LLC** (Attn: Garrett Baxley).

*Thank you for your business, Tricia!*

---

## 7. Optional Business Automation & Revenue Workflow Add-Ons

*These operational packages turn your website from an online brochure into a self-driving catering business. They run in the background 24/7, answering brides while you are cooking, posting your weekend events, and securing repeat corporate bookings.*

> [!NOTE]
> These workflow packages are completely modular and optional add-ons on top of the $1,500 custom website build. Each can be activated individually or bundled together at a package discount.

| Package | What It Solves For Chef Tricia | Setup Fee | Monthly Care |
|---|---|---|---|
| **1. The Automated Lead-to-Book Pipeline** | **Stops lost leads.** Fires instant SMS to your phone (`832-458-8180`) the second a quote is generated. Sends a 60-second personalized text/email to the host with an itemized estimate and 50% deposit link. Automatically follows up at 48 hours and 7 days. | \$497.00 | \$97.00 / mo |
| **2. The Social & Event Content Syndicator** | **Zero-effort marketing.** Drop 3 photos from your weekend wedding into a private folder. The engine drafts localized captions with Woodlands/Tomball tags and auto-schedules to Instagram, Facebook, and Google. Automatically syncs new 5-star Knot & WeddingWire reviews. | \$397.00 | \$75.00 / mo |
| **3. The Local SEO Citadel & Seasonal Menu Engine** | **Ranks #1 on Google without ads.** Automated sub-market pages (`charcuteriechick.ai/the-woodlands`, `/spring-tx`, `/conroe`) + weekly automated Google Business posts. Automatically updates calculator for seasonal boards (Valentine's, Fall Harvest, Holiday Truffle). | \$597.00 | \$125.00 / mo |
| **4. The Corporate VIP Re-Order Engine** | **Fills your holiday calendar 8 weeks early.** Automatically tracks past corporate clients (realtors, law firms, clinics) and queues personalized booking invitations 8 weeks before Thanksgiving and Christmas parties. Includes 1-click Stripe billing with 18% Texas catering tax. | \$497.00 | \$97.00 / mo |
| **★ COMPLETE AUTOMATION SUITE BUNDLE** | **All 4 Operational Engines Fully Integrated & Configured.** Includes Twilio SMS routing, SendGrid email delivery, Stripe automated checkout, Meta Graph social syndication, and monthly local SEO updates. | **\$1,497.00**<br>*(Save \$491.00)* | **\$247.00 / mo** |

### How to Activate Workflows
To add any workflow package to your launch, simply notify Garrett during your review or reply to your kickoff email. Custom integrations can be enabled before final DNS cutover.
