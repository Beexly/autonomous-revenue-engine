# Midnight Supper — production bible

## Identity lock
Use ../../FACTS.md (relative to samples: client FACTS.md) and local facts.json for published menu names, descriptions, prices, phone and email. Owner: Tricia Holfelder. Markets: Tomball, The Woodlands, Spring, Conroe. More than 35 years in restaurants. No invented availability, reviews, opening hours or food. Enquiry only, never booking or auto-send.

## Art direction
Near-black stage, oxblood curtain, warm cream paper-mounted owner artwork, copper rules, huge condensed poster typography, numbered admission-ticket navigation and a spotlight that follows the guest without obscuring the photographs.

## Shot list
All local real client images, provenance ../../ASSETS.md; native dimensions measured during generation. Home: knot-hero.jpg, cart-640.jpg. Menu: knot-hero.jpg, knot-2.jpg, knot-3.jpg, table-01.jpg, wide-640.jpg; illustrative event photos, not promises of exact package contents. Gallery: knot-4.jpg, graze-01.jpg, table-02.jpg, sips-01.jpg, board-02.jpg, sweets-01.jpg. Story: tricia-662.jpg and catering-1000.jpg. Only img/brand.webp in header/footer, mounted at 190px desktop and 155px mobile minimum. No photos enlarged beyond native CSS width; no photo color filters.

## Constraints and interaction
Five standalone, fully readable HTML routes; local CSS/JS and local font; zero paid services, tracking, sound or backend. Content first, motion last. Native scroll with scroll-progress stage curtain, pointer spotlight (CSS radial gradients, not a claimed fluid simulation). Pause via visible control, prefers-reduced-motion, hidden/offscreen event gating. Menu stage enhances an already complete five-menu document. Gallery is a native horizontal filmstrip with buttons and native dialog lightbox. Planner calculates published cost assumptions in cents; tax base explicitly unconfirmed. Form fields are never persisted or sent. Draft reviewed in place; separate explicit mailto action only.

## QA gates
Python Playwright Chromium: 360/390/768/1440 layouts, five routes, local links and assets, one h1, title/description, image native ceilings, keyboard skip/nav, menu selections, gallery dialog/Escape, planner boundaries, reduced motion, explicit motion toggle, disabled JavaScript fallback. Save machine-readable output and screenshots locally. No deployment or commit. Screenshots are evidence, not visual approval unless independently reviewed.
