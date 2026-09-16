# The Gathering — replacement art direction

Owner rejected the editorial sample. This is a structural replacement, not a reskin. Current owner direction supersedes earlier cream/olive, no-WebGL and revised-lockup constraints. Original logo stays unchanged. No artificial food photography, copied third-party artwork, invented prices or promised conversion results.

## Creative decision
A surreal, sunlit table in blush and oxblood. The camera looks across ceramic place settings, then tilts toward the table as the visitor scrolls. Real client photographs float into the composition as physical-looking prints. Huge warm typography reads GOOD FOOD / GREAT COMPANY. The website is an invitation to join, not an agency portfolio.

Original logo: use supplied The Chick Goodies (1).jpg, crop only empty border, preserve artwork/colors/aspect. Keep source file byte-for-byte. IMG_7724 (1).jpeg is a screenshot of a promotional card and chat: local OCR identifies matching logo, full-service catering, boards/carts/grazing tables and event types; never publish the chat screenshot. OCR is not visual inspection.

Reference extraction: fresh live Chromium computed styles from unseen.co and casadisolare.com in references.json. Unseen: persistent 1440×1000 canvas, Neue Montreal 14.4/21.6; navigation mixes 90px serif/sans. Solare: warm brown #563e3b, compact 13.5/18.9 sans over oversized display. Borrow hierarchy, camera continuity and immediate interaction; do not copy assets or assume every pasted technical claim is true.

## Components
1. Persistent utility header: original logo, menu anchor, plan CTA, accessible motion toggle. No enter gate, audio, fake loading.
2. Scroll-driven hero stage: local Three.js, procedural ceramics/glass/cutlery and cloth, not simulated food; DOM headline and real photo prints. Native scrolling. User can skip directly to menu/planner. Reduced-motion/WebGL unavailable gets fully styled DOM composition.
3. Occasion selector: Wedding / Party / Work; changes invitation and optional enquiry note, never price. Keyboard-accessible buttons with pressed state.
4. Menu carousel: one dominant real photo and huge menu name with numbered 01–05 navigation, visible published price/inclusions and choose CTA. All menu information remains available without JS. Buttons and arrow keys; no mandatory dragging.
5. Tricia story: original portrait, real 35-year experience, full-service events language grounded in supplied card.
6. Gathering planner: existing tested cents-based quote core retained, styled as a large number with progressive enquiry. Exact 75/150 Holy Grail packages; 50 minimum elsewhere. Explicit tax assumption. No auto-send.
7. Closing invitation: giant typography, logo, business contact/social.

## Engineering gates
All components readable without animation. Rendering paused when offscreen or document hidden; DPR capped; stop on reduced motion; explicit context-loss fallback. No 480px photograph enlarged beyond native displayed width. Local third-party module and license. New viewport/scene tests plus quote regression, HTML validation and both production URL verifications. No claimed visual sign-off from unavailable vision tool.
